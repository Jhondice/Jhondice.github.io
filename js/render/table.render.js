/* =========================================================
   js/render/table.render.js — Renderizado de la tabla de
   aprendices y actualización de los <select> de filtros
   ========================================================= */
'use strict'

/**
 * Renderiza la tabla de aprendices con la lista filtrada actual.
 * Actualiza también el contador del header y los <select> de filtro.
 */
function rTable() {
  const tbl = qi('tbl')
  const em  = qi('tempty')

  // Contador en el header
  qi('hcount').textContent = `${learners.length} aprendices`

  // Mostrar/ocultar mensaje vacío
  em.style.display = fil.length ? 'none' : 'block'

  // Generar filas
  tbl.innerHTML = fil.map((l, i) => {
    const progOk = PROGS.some(p => normMatch(p, l.programa))
    return `<tr class="${sel === i ? 'sel' : ''}" onclick="setSel(${i})">
      <td style="color:#555;font-size:12px">${i + 1}</td>
      <td>
        <div style="width:28px;height:32px;background:var(--E);border-radius:3px;overflow:hidden;
          display:flex;align-items:center;justify-content:center">
          ${l.foto
            ? `<img src="${l.foto}" style="width:100%;height:100%;object-fit:cover" alt="">`
            : '<span style="font-size:8px;color:#444">—</span>'}
        </div>
      </td>
      <td style="font-weight:bold;max-width:220px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis"
        title="${l.nombre}">${l.nombre}</td>
      <td style="color:#aaa;font-family:monospace;font-size:12px">${l.documento}</td>
      <td><span class="bdg bg-r">${l.rh}</span></td>
      <td style="color:${progOk ? '#aaa' : '#e6a817'};max-width:230px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"
        title="${l.programa}">${l.programa}${progOk ? '' : ' ⚠️'}</td>
      <td><span class="bdg bg-g">${l.ficha}</span></td>
      <td>
        <div style="display:flex;gap:4px">
          <button class="btn bd sm" onclick="event.stopPropagation();openEdit(${l.id})">✏️</button>
          <button class="btn sm" style="background:#3a1e1e;color:var(--R)"
            onclick="event.stopPropagation();delRow(${l.id})">🗑</button>
        </div>
      </td>
    </tr>`
  }).join('')

  updSelects()
  qi('fcnt').textContent = `${fil.length} de ${learners.length}`
}

/**
 * Actualiza los <select> de programa y ficha en todas las pestañas.
 * Preserva la selección activa en fProg / fFich.
 */
function updSelects() {
  const progs = [...new Set(learners.map(l => l.programa))].sort()
  const fichs = [...new Set(learners.map(l => l.ficha))].sort()

  // Selects de programa (tab Datos y tab Carnets)
  ;['fprog', 'cprog'].forEach(id => {
    const el = qi(id)
    if (!el) return
    el.innerHTML = '<option value="">Todos los programas</option>' +
      progs.map(p => `<option value="${p}"${p === fProg ? ' selected' : ''}>${p}</option>`).join('')
  })

  // Selects de ficha (tab Datos y tab Carnets)
  ;['ffich', 'cfich'].forEach(id => {
    const el = qi(id)
    if (!el) return
    el.innerHTML = '<option value="">Todas las fichas</option>' +
      fichs.map(f => `<option value="${f}"${f === fFich ? ' selected' : ''}>${f}</option>`).join('')
  })
}

/**
 * Establece el aprendiz seleccionado en la tabla.
 * @param {number} i - Índice en `fil`
 */
function setSel(i) {
  sel = i
  rTable()
}
