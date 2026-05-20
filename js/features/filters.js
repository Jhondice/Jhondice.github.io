/* =========================================================
   js/features/filters.js — Lógica de filtros por programa
   y ficha, sincronización entre pestañas
   ========================================================= */
'use strict'

/**
 * Aplica los filtros activos (fProg y fFich) sobre `learners`
 * y actualiza `fil`. Luego re-renderiza las vistas afectadas.
 */
function applyFilter() {
  fil = learners.filter(l =>
    (!fProg || normMatch(l.programa, fProg)) &&
    (!fFich || l.ficha === fFich)
  )

  // Ajustar índice de selección para que no quede fuera de rango
  sel = Math.min(sel, Math.max(0, fil.length - 1))

  rTable()

  // Si la pestaña Carnets está activa, refrescar también sus vistas
  const ct = qi('tab-carnets')
  if (ct && ct.style.display !== 'none') {
    rList()
    rBig()
    rThumbs()
  }
}

/**
 * Sincroniza el valor de un filtro entre los <select> de ambas
 * pestañas (Datos y Carnets) y aplica el filtro.
 *
 * @param {string} type  - 'prog' o 'fich'
 * @param {string} val   - Valor seleccionado
 */
function syncFilter(type, val) {
  if (type === 'prog') {
    fProg = val
    ;['fprog', 'cprog'].forEach(id => { const e = qi(id); if (e) e.value = val })
  } else {
    fFich = val
    ;['ffich', 'cfich'].forEach(id => { const e = qi(id); if (e) e.value = val })
  }
  applyFilter()
}
