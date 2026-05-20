/* =========================================================
   js/render/list.render.js — Lista lateral de la pestaña
   Carnets con navegación y contador de posición
   ========================================================= */
'use strict'

/**
 * Renderiza la lista lateral de aprendices en la pestaña Carnets.
 * Marca visualmente el aprendiz seleccionado (índice `sel`).
 */
function rList() {
  qi('navcnt').textContent = `${fil.length ? sel + 1 : 0} / ${fil.length}`

  qi('clist').innerHTML = fil.map((l, i) => `
    <div onclick="pick(${i})" style="padding:8px 10px;cursor:pointer;border-bottom:1px solid var(--E);
      background:${sel === i ? '#1e2235' : 'transparent'};display:flex;align-items:center;gap:8px;
      transition:background .15s">
      <div style="width:26px;height:30px;background:var(--E);border-radius:3px;overflow:hidden;
        flex-shrink:0;display:flex;align-items:center;justify-content:center">
        ${l.foto
          ? `<img src="${l.foto}" style="width:100%;height:100%;object-fit:cover" alt="">`
          : '<span style="color:#444;font-size:10px">—</span>'}
      </div>
      <div style="overflow:hidden;min-width:0">
        <div style="font-size:11px;font-weight:bold;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${l.nombre}</div>
        <div style="font-size:10px;color:#555">${l.ficha} · ${l.rh}</div>
      </div>
    </div>`
  ).join('')
}
