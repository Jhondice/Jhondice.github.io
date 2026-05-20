/* =========================================================
   js/config/programs.js — Listado oficial de programas SENA
   Articulación con la Educación Media Técnica
   ========================================================= */
'use strict'

/**
 * Listado oficial de programas técnicos de articulación.
 * Se usa para:
 *  - Validar programas al importar Excel/CSV
 *  - Poblar el <select> del modal de edición
 *  - Generar la hoja "Programas" de la plantilla Excel
 */
const PROGS = [
  'ASESORIA COMERCIAL',
  'PROGRAMACION DE SOFTWARE',
  'MANTENIMIENTO E INSTALACION DE SISTEMAS SOLARES FOTOVOLTAICOS',
  'MANTENIMIENTO DE AUTOMATISMOS INDUSTRIALES',
  'MANTENIMIENTO Y ENSAMBLE DE EQUIPOS ELECTRONICOS',
  'ASISTENCIA ADMINISTRATIVA',
  'COCINA',
  'OPERACION TURISTICA LOCAL',
  'SERVICIOS DE AGENCIAS DE VIAJES',
  'CONTABILIZACION DE OPERACIONES COMERCIALES Y FINANCIERAS',
  'INTEGRACION DE CONTENIDOS DIGITALES',
  'MANTENIMIENTO DE EQUIPOS DE COMPUTO',
  'SISTEMAS TELEINFORMATICOS',
  'ALISTAMIENTO DE LABORATORIOS DE MICROBIOLOGIA Y BIOTECNOLOGIA',
  'PATRONAJE INDUSTRIAL DE PRENDAS DE VESTIR',
  'PANIFICACION'
]
