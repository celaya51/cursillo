import asyncio
import hmac
import io
import json
import os
import sqlite3
import subprocess
import sys
import wave
from contextlib import asynccontextmanager
from pathlib import Path
from threading import Lock

from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from piper import PiperVoice, SynthesisConfig
from pydantic import BaseModel, Field

DATA_DIR = Path(os.getenv("DATA_DIR", "/data"))
DB_PATH = DATA_DIR / "cursillo.db"
VOICE_ID = os.getenv("PIPER_VOICE", "es_MX-ald-medium")
VOICE_DIR = DATA_DIR / "voices"
VOICE_PATH = VOICE_DIR / f"{VOICE_ID}.onnx"
SYNC_TOKEN = os.getenv("SYNC_TOKEN", "")
CORS_ORIGIN = os.getenv("CORS_ORIGIN", "https://celaya51.github.io")

_voice: PiperVoice | None = None
_voice_lock = Lock()


def db_connect():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS progress (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            state_json TEXT NOT NULL,
            updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    return conn


def ensure_voice():
    global _voice
    VOICE_DIR.mkdir(parents=True, exist_ok=True)
    if not VOICE_PATH.exists():
        subprocess.check_call([
            sys.executable,
            "-m",
            "piper.download_voices",
            "--data-dir",
            str(VOICE_DIR),
            VOICE_ID,
        ])
    _voice = PiperVoice.load(VOICE_PATH)


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not SYNC_TOKEN or len(SYNC_TOKEN) < 12:
        raise RuntimeError("SYNC_TOKEN must be set to a private value with at least 12 characters")
    with db_connect() as conn:
        conn.commit()
    await asyncio.to_thread(ensure_voice)
    yield


app = FastAPI(title="Ruta Julio Sync API", version="1.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[CORS_ORIGIN],
    allow_credentials=False,
    allow_methods=["GET", "PUT", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type"],
)


def authorize(authorization: str | None = Header(default=None)):
    expected = f"Bearer {SYNC_TOKEN}"
    if not authorization or not hmac.compare_digest(authorization, expected):
        raise HTTPException(status_code=401, detail="Unauthorized")


class ProgressIn(BaseModel):
    state: dict


class TTSIn(BaseModel):
    text: str = Field(min_length=1, max_length=5000)


@app.get("/health")
def health():
    return {"ok": True, "voice": VOICE_ID}


@app.get("/v1/progress", dependencies=[Depends(authorize)])
def get_progress():
    with db_connect() as conn:
        row = conn.execute("SELECT state_json, updated_at FROM progress WHERE id = 1").fetchone()
    if not row:
        return {"state": None, "updated_at": None}
    try:
        state = json.loads(row["state_json"])
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Stored progress is invalid")
    return {"state": state, "updated_at": row["updated_at"]}


@app.put("/v1/progress", dependencies=[Depends(authorize)])
def put_progress(payload: ProgressIn):
    raw = json.dumps(payload.state, ensure_ascii=False, separators=(",", ":"))
    if len(raw.encode("utf-8")) > 100_000:
        raise HTTPException(status_code=413, detail="Progress payload too large")
    with db_connect() as conn:
        conn.execute(
            """
            INSERT INTO progress (id, state_json, updated_at)
            VALUES (1, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(id) DO UPDATE SET
              state_json = excluded.state_json,
              updated_at = CURRENT_TIMESTAMP
            """,
            (raw,),
        )
        conn.commit()
        row = conn.execute("SELECT updated_at FROM progress WHERE id = 1").fetchone()
    return {"ok": True, "updated_at": row["updated_at"]}


def render_wav(text: str) -> bytes:
    if _voice is None:
        raise RuntimeError("Voice not loaded")
    buf = io.BytesIO()
    with _voice_lock:
        with wave.open(buf, "wb") as wav_file:
            _voice.synthesize_wav(
                text,
                wav_file,
                syn_config=SynthesisConfig(length_scale=1.08),
            )
    return buf.getvalue()


@app.post("/v1/tts", dependencies=[Depends(authorize)])
async def tts(payload: TTSIn):
    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=422, detail="Text is empty")
    try:
        audio = await asyncio.to_thread(render_wav, text)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"TTS failed: {type(exc).__name__}") from exc
    return Response(content=audio, media_type="audio/wav", headers={"Cache-Control": "private, max-age=86400"})
