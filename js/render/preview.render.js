/* =========================================================
   js/render/preview.render.js — Vista grande del carnet
   activo y cuadrícula de miniaturas
   ========================================================= */
'use strict'

/**
 * Renderiza el carnet en vista grande (escala 1.88).
 * Si no hay aprendices, muestra mensaje vacío.
 */
function rBig() {
  const el = qi('cbig')
  if (!fil.length) {
    el.innerHTML = '<div style="color:#555;padding:50px;text-align:center">Sin aprendices cargados</div>'
    qi('cinfo').innerHTML =
      '<div class="cinfo-title">Info del Carnet</div>' +
      '<div style="color:#555;text-align:center;padding:20px">Sin selección</div>'
    return
  }
  el.innerHTML = mkCarnet(fil[sel], cfg, 1.88)
  rInfo()
}

/**
 * Renderiza la cuadrícula de miniaturas de todos los carnets filtrados.
 * La miniatura seleccionada lleva la clase CSS `.on`.
 */
function rThumbs() {
  qi('tcnt').textContent = `Vista general — ${fil.length} carnet${fil.length === 1 ? '' : 's'}`
  qi('tgrid').innerHTML = fil.map((l, i) =>
    `<div class="thi${sel === i ? ' on' : ''}" onclick="pick(${i})" title="${l.nombre}">
      ${mkCarnet(l, cfg, 0.52)}
    </div>`
  ).join('')
}

/**
 * Selecciona un aprendiz desde la lista o la cuadrícula y actualiza las vistas.
 * @param {number} i - Índice en `fil`
 */
function pick(i) {
  sel = i
  rList()
  rBig()
  rThumbs()
}
