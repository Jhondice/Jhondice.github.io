/* =========================================================
   js/features/template.js — Descarga de plantilla Excel
   (proxy hacia export.service.js, mantenido separado para
   claridad en la arquitectura de features)
   ========================================================= */
'use strict'

/*
  La lógica completa de generación de la plantilla Excel
  con 3 hojas, estilos y validaciones está en:
    js/services/export.service.js → función dlTemplate()

  Este archivo existe para documentar que dlTemplate es
  una feature de la interfaz de usuario invocada desde
  el botón "⬇ Plantilla Excel (.xlsx)" en tab Datos.
*/
