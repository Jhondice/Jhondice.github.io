/* =========================================================
   js/app.js — Punto de entrada de la aplicación
   Se ejecuta al final, después de que todos los módulos
   han sido cargados por index.html
   ========================================================= */
'use strict'

/**
 * Verificación de logo al inicio.
 * Intenta cargar el logo desde assets/img/logosena.png.
 * Si falla, logoLoaded queda en false y el carnet omitirá la imagen.
 */
;(function initLogoCheck() {
  const img  = new Image()
  img.onload  = () => { logoLoaded = true }
  img.onerror = () => { logoLoaded = false }
  img.src = 'assets/img/logosena.png?t=' + Date.now()
})()

/**
 * Arranque inicial de la aplicación:
 * - Aplica los filtros por defecto (sin filtros)
 * - Renderiza la vista previa del tab Diseño
 */
applyFilter()
rDesign()
