/* =========================================================
   js/config/constants.js — Constantes globales del sistema
   ========================================================= */
'use strict'

/** Color verde SENA (por defecto de barra) */
const SG = '#39A900'

/** Color azul SENA */
const SB = '#003DA5'

/** Tipos de sangre válidos */
const RH = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']

/** Año en curso (se usa para vigencia y año de ingreso por defecto) */
const AÑO_ACTUAL = new Date().getFullYear()

/** Dimensiones del carnet CR80 / ISO 7810 ID-1 en milímetros */
const CR80 = {
  widthMM:  53.98,
  heightMM: 85.60,
  /** Escala base en px para renderizado interno (1 mm ≈ 3.779 px a 96 dpi) */
  scaleBase: 1,
  /** Factor para generación PDF a 300 DPI (mm → px) */
  scalePDF:  3.937
}
