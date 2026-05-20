/* =========================================================
   js/utils/validators.js — Validación de campos del modal
   ========================================================= */
'use strict'

/**
 * Valida los campos del formulario de edición.
 * @param  {string} nombre   - Nombre completo
 * @param  {string} documento- N° de documento
 * @param  {string} ficha    - N° de ficha
 * @returns {string[]}       - Array de mensajes de error (vacío si todo OK)
 */
function validateLearnerForm(nombre, documento, ficha) {
  const errs = []
  if (!nombre)    errs.push('El nombre es obligatorio')
  if (!documento) errs.push('El documento es obligatorio')
  if (!ficha)     errs.push('La ficha es obligatoria')
  return errs
}
