/* =========================================================
   js/utils/format.js — Utilidades de formato y cálculo
   ========================================================= */
'use strict'

/**
 * Calcula el año de vencimiento del carnet.
 * La vigencia es de 1 año a partir del año de ingreso.
 * @param  {number|string} ano - Año de ingreso del aprendiz
 * @returns {number}           - Año de vencimiento
 */
function calcVigencia(ano) {
  return (parseInt(ano) || AÑO_ACTUAL) + 1
}

/**
 * Indica si el carnet está actualmente vigente.
 * @param  {number|string} ano
 * @returns {boolean}
 */
function esVigente(ano) {
  return AÑO_ACTUAL <= calcVigencia(ano)
}
