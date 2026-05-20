/* =========================================================
   js/features/modal.js — Modal de edición y creación de
   aprendices con vista previa de carnet en tiempo real
   ========================================================= */
'use strict'

/**
 * Construye el formulario del modal con los datos del aprendiz.
 * Si se pasa null, construye el formulario vacío para nuevo aprendiz.
 *
 * @param {Object|null} l - Datos del aprendiz existente, o null si es nuevo
 */
function buildForm(l) {
  const isNew = !l
  const d = l || { nombre: '', documento: '', rh: 'O+', programa: PROGS[0], ficha: '' }

  qi('mdltitle').textContent = isNew ? '➕ Nuevo Aprendiz' : '✏️ Editar Aprendiz'

  qi('mform').innerHTML = `
    <div class="fgrp" style="grid-column:1/-1">
      <label>Nombre Completo *</label>
      <input type="text" id="en" value="${d.nombre}" oninput="upMP()"
        placeholder="NOMBRE COMPLETO EN MAYÚSCULAS" style="text-transform:uppercase">
    </div>
    <div class="fgrp">
      <label>N° Documento *</label>
      <input type="text" id="ed" value="${d.documento}" oninput="upMP()" placeholder="10 dígitos">
    </div>
    <div class="fgrp">
      <label>Tipo de Sangre (RH) *</label>
      <select id="er" onchange="upMP()">
        ${RH.map(r => `<option${d.rh === r ? ' selected' : ''}>${r}</option>`).join('')}
      </select>
    </div>
    <div class="fgrp">
      <label>N° Ficha *</label>
      <input type="text" id="ef" value="${d.ficha}" oninput="upMP()" placeholder="Ej: 2987654">
    </div>
    <div class="fgrp">
      <label>Año ingreso</label>
      <input type="text" id="eano" value="${d.ano || ''}" placeholder="2026" style="color:#aaa">
    </div>
    <div class="fgrp" style="grid-column:1/-1">
      <label>Programa de Formación *</label>
      <select id="ep" onchange="upMP()">
        ${PROGS.map(p => `<option value="${p}"${normMatch(p, d.programa) ? ' selected' : ''}>${p}</option>`).join('')}
      </select>
    </div>`

  // Foto en el modal
  const ph = qi('mfphoto')
  ph.innerHTML = l?.foto
    ? `<img src="${l.foto}" style="width:100%;height:100%;object-fit:cover" alt="">`
    : 'SIN<br>FOTO'

  // Vista previa del carnet
  qi('mprev').innerHTML = mkCarnet(d, cfg, 0.55)
  qi('merrors').style.display = 'none'
}

/**
 * Abre el modal.
 * @param {number|null} id - ID del aprendiz a editar, o null para nuevo
 */
function openEdit(id) {
  eid = id
  if (id === null) {
    buildForm(null)
  } else {
    const l = learners.find(x => x.id === id)
    if (!l) return
    buildForm(l)
  }
  qi('mdl').style.display = 'flex'
}

/**
 * Actualiza la vista previa del carnet en tiempo real mientras
 * el usuario edita el formulario.
 */
function upMP() {
  const l = {
    nombre:    (qi('en')?.value  || '').toUpperCase(),
    documento: qi('ed')?.value   || '',
    rh:        qi('er')?.value   || 'O+',
    programa:  qi('ep')?.value   || '',
    ficha:     qi('ef')?.value   || '',
    ano:       parseInt(qi('eano')?.value) || AÑO_ACTUAL,
    foto:      eid ? (learners.find(x => x.id === eid)?.foto || null) : null
  }
  qi('mprev').innerHTML = mkCarnet(l, cfg, 0.55)
}

/**
 * Maneja la carga de una nueva foto desde el modal de edición.
 * @param {HTMLInputElement} inp
 */
function onMFoto(inp) {
  const f = inp.files[0]
  if (!f) return

  const rd = new FileReader()
  rd.onload = e => {
    if (eid !== null) {
      const idx = learners.findIndex(l => l.id === eid)
      if (idx >= 0) learners[idx].foto = e.target.result
    }
    qi('mfphoto').innerHTML =
      `<img src="${e.target.result}" style="width:100%;height:100%;object-fit:cover" alt="">`
    upMP()
  }

  rd.readAsDataURL(f)
  inp.value = ''
}

/**
 * Valida y guarda los datos del formulario (edición o nuevo aprendiz).
 */
function saveEdit() {
  const nombre    = (qi('en').value || '').trim().toUpperCase()
  const documento = (qi('ed').value || '').trim()
  const ficha     = qi('ef').value.trim()

  const errs = validateLearnerForm(nombre, documento, ficha)

  if (errs.length) {
    const em = qi('merrors')
    em.innerHTML = '<b>⚠️ Errores:</b><br>' + errs.join('<br>')
    em.style.display = 'block'
    return
  }

  const rec = {
    nombre,
    documento,
    rh:       qi('er').value || 'O+',
    programa: qi('ep').value || '',
    ficha,
    ano:      parseInt(qi('eano').value) || AÑO_ACTUAL
  }

  if (eid === null) {
    // Nuevo aprendiz
    learners.push({ id: uid++, ...rec, foto: null })
    toast('✅ Aprendiz agregado correctamente')
  } else {
    // Actualizar existente
    const idx = learners.findIndex(l => l.id === eid)
    if (idx >= 0) learners[idx] = { ...learners[idx], ...rec }
    toast('✅ Aprendiz actualizado')
  }

  applyFilter()
  closeMdl()
}

/** Cierra el modal y limpia el ID en edición. */
function closeMdl() {
  qi('mdl').style.display = 'none'
  eid = null
}

/**
 * Cierra el modal si se hace clic en el fondo oscuro (overlay).
 * @param {MouseEvent} e
 */
function mdlOut(e) {
  if (e.target === qi('mdl')) closeMdl()
}
