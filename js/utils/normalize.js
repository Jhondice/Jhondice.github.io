/* =========================================================
   js/utils/normalize.js — Normalización de texto para
   comparaciones sin tildes ni distinción de mayúsculas
   ========================================================= */
'use strict'

/**
 * Normaliza un string: elimina tildes, convierte a mayúsculas y recorta espacios.
 * Usado para comparar nombres de programas, encabezados Excel, etc.
 * @param  {string} s
 * @returns {string}
 */
const norm = s =>
  (s || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim()

/**
 * Compara dos strings ignorando tildes y mayúsculas.
 * @param  {string} a
 * @param  {string} b
 * @returns {boolean}
 */
const normMatch = (a, b) => norm(a) === norm(b)
