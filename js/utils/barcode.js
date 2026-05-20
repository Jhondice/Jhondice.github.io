/* =========================================================
   js/utils/barcode.js — Generador de código de barras SVG
   (Decorativo basado en el número de documento)
   ========================================================= */
'use strict'

/**
 * Genera un SVG de código de barras decorativo a partir de un valor numérico.
 * No es un código de barras estándar (EAN, Code 128, etc.), es visual.
 *
 * @param  {string|number} val - Valor base (número de documento)
 * @param  {number}        w   - Ancho en píxeles
 * @param  {number}        h   - Alto en píxeles
 * @returns {string}           - HTML del elemento <svg>
 */
function barcode(val, w, h) {
  const s = (val + '').padEnd(14, '0')
  let svg = ''
  let x = 1
  const bw = (w - 2) / 72

  for (let i = 0; i < 72; i++) {
    const c = s.charCodeAt(i % s.length) || 48
    const t = ((c * 17 + i * 13) % 7) < 2 ? 2.1 : 1.0
    if (((c * 7 + i * 11) % 5) !== 0)
      svg += `<rect x="${x.toFixed(1)}" y="0" width="${(bw * t * 0.68).toFixed(1)}" height="${h}" fill="#111"/>`
    x += bw
  }

  // Barras de inicio y fin
  svg += `<rect x="1" y="0" width="${(bw * 0.9).toFixed(1)}" height="${h}" fill="#111"/>`
  svg += `<rect x="${(w - bw - 1).toFixed(1)}" y="0" width="${(bw * 0.9).toFixed(1)}" height="${h}" fill="#111"/>`

  return `<svg width="${w}" height="${h}" style="display:block;flex-shrink:0">` +
         `<rect width="${w}" height="${h}" fill="white"/>` +
         svg +
         `</svg>`
}
