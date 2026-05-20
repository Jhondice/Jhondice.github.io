/* =========================================================
   js/render/design.render.js — Vista previa en la pestaña
   Diseño (renderiza con el primer aprendiz disponible)
   ========================================================= */
'use strict'

/**
 * Renderiza la vista previa del carnet en la pestaña Diseño.
 * Usa el aprendiz seleccionado, o el primero disponible,
 * o un aprendiz de muestra si la lista está vacía.
 */
function rDesign() {
  const l = fil[sel] || learners[0] || {
    id: 0,
    nombre: 'ANDREA VALENTINA TORRES PEÑA',
    documento: '1075678901',
    rh: 'O+',
    programa: 'PROGRAMACION DE SOFTWARE',
    ficha: '2987654',
    foto: null
  }
  qi('dprev').innerHTML = mkCarnet(l, cfg, 1.88)
}
