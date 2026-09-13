'use strict';
const D=[
['Seguir el flujo','Leo una función de 15–25 líneas y explico qué camino sigue con entradas distintas.'],
['Variables y tipos','Distingo string, número, booleano, lista y objeto/diccionario.'],
['Condiciones y ciclos','Escribo o corrijo un if y un for/while sencillo.'],
['Funciones','Creo una función con parámetros, retorno y un caso de error simple.'],
['JSON y APIs','Entiendo GET/POST, headers, status codes y puedo leer JSON.'],
['SQL','Escribo SELECT, WHERE e INSERT sencillos y explico una clave primaria.'],
['Git','Entiendo commit, branch, merge, diff y revert aunque consulte comandos.'],
['Debugging','Leo el error, reduzco el problema y pruebo hipótesis antes de reescribir.'],
['Tests','Distingo unitario, integración y end-to-end.'],
['Proyecto propio','Explico una decisión técnica de ZPrint, SANHER o VEIA sin leer el código.']
];
const M=[
['Modelo mental: cómo corre un programa','Estado, flujo, entradas, salidas y efectos secundarios.','Traza una función como entrada → estado → decisión → salida. Distingue cálculo de efectos secundarios. Predice antes de ejecutar.','Toma una función de ZPrint y haz una traza manual con dos entradas.','Explicas una función de 20–30 líneas y detectas sus efectos secundarios.','Busca primero nombres, entradas y retornos. Luego marca qué líneas cambian estado externo.'],
['Python esencial','Tipos, colecciones, control de flujo, funciones y excepciones.','Practica strings, números, listas y dicts con datos de productos, órdenes e impresiones. Haz funciones pequeñas y errores explícitos.','Implementa validar_lote(cantidad,total,inicio) y prueba casos límite.','Resuelves lógica básica y explicas cada línea.','Empieza con tres casos: válido, cero/negativo y cantidad que excede total.'],
['JSON, HTTP y APIs','Contratos entre sistemas, status codes, autenticación y errores.','Método + URL + headers + body → status + headers + body. Diseña también caminos 400/401/404/409/422/500.','Consume una API pública y documenta request, response y un error.','Explicas una llamada completa y depuras un status inesperado.','Antes de programar, escribe el request y response esperados como JSON pequeño.'],
['SQL y persistencia','SELECT, JOIN, constraints y transacciones.','Cada consulta responde una pregunta. Practica relaciones, claves e integridad antes de depender de un ORM.','Crea SQLite con impresiones y responde cinco preguntas con SQL.','Escribes consultas básicas y explicas una transacción.','Modela primero dos tablas: impresiones y productos. Decide la clave de cada una.'],
['Git de verdad','Commits, ramas, diff, merge, revert y PR.','Usa commits pequeños con intención clara. Aprende a leer diff y a revertir sin miedo.','Crea una rama, cambia una regla, prueba, commit y PR.','Puedes recuperar un cambio equivocado sin borrar historial.','Haz un cambio de una sola línea y usa git diff antes del commit.'],
['Debugging sistemático','Reproducir → localizar → hipótesis → experimento → verificar.','No pidas a la IA que reescriba todo. Reduce el caso, inspecciona datos, logs y traceback.','Arregla un bug sembrado documentando tres hipótesis.','Encuentras una causa y añades un test de regresión.','Escribe literalmente: “sé que falla cuando…”. Después cambia una sola variable por experimento.'],
['Testing','Unitarios, integración, API y E2E.','Los tests convierten expectativas humanas en verificaciones. Aprende Arrange/Act/Assert y una pirámide práctica.','Añade tests a lógica de ZPrint o una API pequeña.','Sabes qué probar en cada nivel y por qué.','Elige una función pura primero: entrada conocida → salida verificable.'],
['Playwright y Selenium','Automatización web orientada a empleo.','Primero selectores estables y Playwright; después Selenium para compatibilidad laboral. Separa flakiness de bugs reales.','Automatiza SANHER: carga, navegación, carrusel y responsive.','La suite corre dos veces seguidas sin falsos fallos.','Empieza por una prueba banal: abrir la página y verificar un heading visible.'],
['FastAPI / backend','Endpoints, validación, dependencias, auth y errores.','Construye contratos pequeños, valida con modelos y separa lógica de transporte.','API CRUD pequeña con DB, validación y tests.','Puedes explicar request → servicio → persistencia → response.','Haz primero GET /health y POST /items sin base de datos; luego persiste.'],
['JavaScript / TypeScript','Fluidez suficiente para leer y modificar frontend.','Funciones, arrays, objetos, async/await, fetch y tipos básicos. No memorices APIs completas.','Modifica una función real del sitio y añade una prueba.','Lees JS/TS cotidiano sin pedir traducción línea por línea.','Busca primero datos, eventos y efectos en DOM. Ignora detalles de CSS.'],
['Docker y CI','Entornos reproducibles y verificación automática.','Imagen, contenedor, volumen, variables y pipeline. Lo importante es reproducibilidad.','Dockeriza la API y ejecuta tests en GitHub Actions.','Un tercero levanta el proyecto con instrucciones claras.','Primero Dockerfile mínimo; después compose; al final CI.'],
['Desarrollo con IA verificable','Prompts como especificaciones, diffs pequeños y evidencia.','Define objetivo, restricciones, criterios de aceptación y verificación. Confía en tests/logs/docs, no en fluidez.','Revisa un diff de IA y escribe riesgos antes de pedir segunda opinión.','Puedes rechazar una solución convincente y demostrar por qué está mal.','Pide cambios de máximo una responsabilidad y revisa el diff antes del siguiente.'],
['Capstone: perfil empleable','Portfolio, caso técnico, tests, demo y entrevista.','ZPrint como integración, SANHER como QA y una API como backend. Prepara historias Problema → Contexto → Decisión → Verificación → Resultado.','Graba una explicación de 5 minutos y simula preguntas técnicas.','Un tercero puede ejecutar tus proyectos y tú defender las decisiones.','Usa un proyecto real como hilo conductor; no construyas otro “todo app” genérico.']
];
const R=[
['¿Qué cuatro cosas buscas al leer una función?','Entrada, decisiones/flujo, salida y efectos secundarios.'],
['¿Qué significa contrato de una API?','Formato, tipos, significado, errores y comportamiento acordado entre cliente y servidor.'],
['Orden mínimo de debugging','Reproducir → localizar → hipótesis → experimento → verificar → test de regresión.'],
['¿Por qué sirven los tests al usar IA?','Convierten expectativas en verificaciones automáticas y reducen aceptar cambios incorrectos.'],
['Commit, branch y PR','Commit: cambio versionado; branch: línea de trabajo; PR: propuesta revisable de integración.'],
['¿Qué es idempotencia?','Repetir la misma operación válida no causa efectos adicionales no deseados.'],
['Imagen, contenedor y volumen','Imagen: artefacto; contenedor: instancia/proceso; volumen: persistencia externa.'],
['Selector E2E estable','Representa semántica o contrato de prueba, no estructura visual accidental.']
];
const REVIEW_TO_MODULE=[0,2,5,6,4,2,10,7];
const ROUTES={
  foundations:{name:'fundamentos primero',headline:'Ruta: fundamentos con salida rápida a proyectos',text:'No vas a “estudiar programación” en abstracto. Primero flujo, Python y debugging; después APIs y tests sobre proyectos reales.',order:[0,1,5,2,6,4,7,3,8,9,11,10,12]},
  bridge:{name:'puente aplicado',headline:'Ruta: cerrar huecos mientras construyes evidencia',text:'Ya hay base. Prioriza APIs, debugging, testing y automatización; vuelve a fundamentos sólo cuando un fallo lo exija.',order:[2,5,6,7,8,4,3,1,9,11,10,12,0]},
  applied:{name:'aplicada',headline:'Ruta: proyectos, tests y defensa técnica',text:'Tu mejor retorno está en testing, integración y portfolio. Los fundamentos se repasan de forma puntual al detectar huecos.',order:[6,7,8,11,12,2,5,10,9,3,4,1,0]}
};
const DEFAULT_STATE={version:2,diag:{},mods:{},reviewHard:{},prefs:{dark:false,wide:false,focus:false,fs:16,sessionMode:'solo'},lastView:'home'};
