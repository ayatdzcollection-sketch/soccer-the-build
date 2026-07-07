// ============================================================
// js/render/transfer.js — "Running → Soccer" (design language:
// the Speed screen's green hero + phase-list treatment, reused
// for the carryover reference since the Speed module is skipped).
// ============================================================

import { TRANSFER as T } from '../../data/transfer.js';

function givesCard(col) {
  const items = col.items.map((i) => `<div class="gives-item"><span class="b-dot"></span><span>${i}</span></div>`).join('');
  return `<div class="card"><div class="label">${col.title}</div><div class="gives-list">${items}</div></div>`;
}

export function renderTransfer() {
  const edges = T.edges
    .map((e) => `<div class="edge"><div class="lbl">${e.lbl}</div><h3>${e.h3}</h3><p>${e.p}</p></div>`)
    .join('');
  const tmpl = T.template.blocks
    .map((b) => `<div class="tmpl-row"><span class="m">${b.m}</span><span class="body">${b.body}</span></div>`)
    .join('');
  const safety = T.safety.map((s) => `<div class="${s.kind === 'real' ? 'real' : 'note'}">${s.html}</div>`).join('');

  return `
<section class="view view-transfer">
  <h1 class="screen-title">Running → Soccer</h1>
  <div class="hero">
    <div class="hero-eyebrow">${T.kick}</div>
    <div class="hero-big">${T.h2}.</div>
    <p>${T.sub}</p>
    <div class="rule"></div>
  </div>

  ${givesCard(T.gives.running)}
  ${givesCard(T.gives.soccer)}

  <div class="mini">How to slot it in</div>
  ${edges}

  <div class="mini">${T.template.title}</div>
  <p class="screen-sub">${T.template.note}</p>
  <div class="card" style="gap:12px;display:flex;flex-direction:column">${tmpl}</div>

  ${safety}
</section>`;
}
