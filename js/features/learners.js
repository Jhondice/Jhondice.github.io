/* =========================================================
   js/features/learners.js — Gestión de registros de
   aprendices: agregar, eliminar y limpiar la lista
   ========================================================= */
'use strict'

/**
 * Elimina un aprendiz de la lista por su ID.
 * Solicita confirmación antes de proceder.
 * @param {number} id
 */
function delRow(id) {
  if (!confirm('¿Eliminar este aprendiz?')) return
  learners = learners.filter(l => l.id !== id)
  applyFilter()
  toast('Aprendiz eliminado', 'wrn')
}

/**
 * Elimina todos los registros de la lista.
 * Solicita confirmación antes de proceder.
 */
function clearAll() {
  if (!confirm('¿Eliminar TODOS los registros? Esta acción no se puede deshacer.')) return
  learners = []
  sel = 0
  applyFilter()
  toast('Lista limpiada', 'wrn')
}

/**
 * Abre el modal en modo "nuevo aprendiz".
 */
function addNewRow() {
  openEdit(null)
}
