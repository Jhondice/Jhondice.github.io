/* =========================================================
   js/features/navigation.js — Navegación entre pestañas
   y entre carnets con botones ◀ ▶
   ========================================================= */
'use strict'

/**
 * Cambia la pestaña activa mostrando el panel correspondiente
 * y marcando el botón de tab como seleccionado.
 *
 * @param {string}      name - Nombre de la pestaña: 'datos' | 'diseno' | 'carnets'
 * @param {HTMLElement} btn  - Botón de tab clickeado
 */
function goTab(name, btn) {
  // Ocultar todos los paneles
  ;['datos', 'diseno', 'carnets'].forEach(t => {
    qi('tab-' + t).style.display = t === name ? 'block' : 'none'
  })

  // Marcar el tab activo
  document.querySelectorAll('.tab').forEach(b => b.classList.remove('on'))
  btn.classList.add('on')

  // Actualizar vistas al cambiar de pestaña
  if (name === 'diseno')  rDesign()
  if (name === 'carnets') { rList(); rBig(); rThumbs() }
}

/**
 * Navega al carnet anterior o siguiente con las flechas ◀ ▶.
 * @param {number} d - Dirección: -1 (anterior) o +1 (siguiente)
 */
function nav(d) {
  if (!fil.length) return
  sel = Math.max(0, Math.min(fil.length - 1, sel + d))
  rList()
  rBig()
  rThumbs()
}
