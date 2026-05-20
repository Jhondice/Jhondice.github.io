/* =========================================================
   js/utils/dom.js — Utilidades de manipulación del DOM
   ========================================================= */
'use strict'

/** Alias corto de document.querySelector */
const q  = s  => document.querySelector(s)

/** Alias corto de document.getElementById */
const qi = id => document.getElementById(id)

/**
 * Muestra un mensaje toast (notificación temporal).
 * @param {string} m    - Mensaje a mostrar
 * @param {string} type - 'ok' | 'err' | 'wrn'
 */
function toast(m, type = 'ok') {
  const el = qi('toast')
  el.textContent = m
  el.className = type === 'ok' ? 'tok' : type === 'err' ? 'terr' : 'twrn'
  clearTimeout(el._t)
  el._t = setTimeout(() => { el.className = '' }, 4000)
}
