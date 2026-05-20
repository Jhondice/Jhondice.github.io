/* =========================================================
   js/features/design.js — Control de configuración visual
   del carnet: activar/desactivar barra y cambiar color
   ========================================================= */
'use strict'

/**
 * Activa o desactiva la barra superior del carnet.
 * Actualiza el estado `cfg`, los botones y la sección de color.
 * @param {boolean} on
 */
function setBar(on) {
  cfg.on = on
  qi('bon').className  = `btn sm ${on ? 'bg' : 'bd'}`
  qi('boff').className = `btn sm ${!on ? 'br' : 'bd'}`
  qi('csec').style.display = on ? 'block' : 'none'
  rDesign()
}

/**
 * Cambia el color de la barra del carnet.
 * Resalta visualmente el botón de color preestablecido si corresponde.
 * @param {string} c - Color en formato hexadecimal (#RRGGBB)
 */
function setColor(c) {
  cfg.color = c
  qi('cpick').value = c

  // Quitar resaltado de todos los botones de presets
  document.querySelectorAll('.cpbtn').forEach(b => { b.style.outline = 'none' })

  // Resaltar el botón preset si coincide con el color seleccionado
  const presets = {
    '#39A900': 'cpv',
    '#003DA5': 'cpb',
    '#FFFFFF': 'cpw'
  }
  const id = presets[c.toUpperCase()] || presets[c]
  if (id && qi(id)) qi(id).style.outline = '2px solid #fff'

  rDesign()
}
