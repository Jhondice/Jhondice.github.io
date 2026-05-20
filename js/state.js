/* =========================================================
   js/state.js — Estado global de la aplicación
   Toda variable mutable compartida entre módulos vive aquí.
   ========================================================= */
'use strict'

/**
 * Fuente del logo institucional.
 * Puede ser la ruta relativa o un dataURL si se sube manualmente.
 */
let logoSrc = 'assets/img/logosena.png'

/**
 * Indica si el logo fue cargado correctamente.
 * Se verifica al iniciar la app (ver app.js).
 */
let logoLoaded = false

/**
 * Contador incremental de ID único para cada aprendiz.
 * Arranca en 10 para dejar margen a los datos de muestra (IDs 1-4).
 */
let uid = 10

/**
 * Lista maestra de aprendices.
 * Cada objeto tiene: { id, nombre, documento, rh, programa, ficha, ano, foto }
 */
let learners = [
  { id: 1, nombre: 'ANDREA VALENTINA TORRES PEÑA',       documento: '1075678901', rh: 'O+',  programa: 'PROGRAMACION DE SOFTWARE',                                    ficha: '2987654', ano: 2025, foto: null },
  { id: 2, nombre: 'CARLOS ANDRES MUÑOZ SILVA',           documento: '1075234567', rh: 'A+',  programa: 'CONTABILIZACION DE OPERACIONES COMERCIALES Y FINANCIERAS',   ficha: '2987654', ano: 2025, foto: null },
  { id: 3, nombre: 'LAURA JIMENA VARGAS OSPINA',          documento: '1075345678', rh: 'B+',  programa: 'SISTEMAS TELEINFORMATICOS',                                   ficha: '2987655', ano: 2024, foto: null },
  { id: 4, nombre: 'JHON ALEXANDER MOLINA TRUJILLO',      documento: '1075456789', rh: 'AB+', programa: 'ASISTENCIA ADMINISTRATIVA',                                   ficha: '2987655', ano: 2024, foto: null }
]

/**
 * Lista filtrada de aprendices (subconjunto de `learners`).
 * Se recalcula en applyFilter().
 */
let fil = [...learners]

/**
 * Índice del aprendiz seleccionado en `fil`.
 */
let sel = 0

/**
 * ID del aprendiz en edición dentro del modal.
 * null si se está creando uno nuevo.
 */
let eid = null

/**
 * Configuración visual del carnet.
 * on    → barra superior activa
 * color → color de la barra
 */
let cfg = { on: true, color: SG }

/**
 * Filtros activos.
 * fProg → programa seleccionado ('' = todos)
 * fFich → ficha seleccionada   ('' = todas)
 */
let fProg = ''
let fFich = ''
