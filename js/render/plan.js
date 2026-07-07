// ============================================================
// js/render/plan.js — Plan view (design: 1d / 1e).
// Stacked phases with gate counts, promote card, status-chip drill
// rows, locked (dashed) drills. Reference material (How it works /
// Catch-up / Timeline / Science) sits behind a compact sub-nav.
// ============================================================

import {
  PHASES, PHASE_BY_ID, HOW_IT_WORKS, CATCHUP, TIMELINE, SCIENCE, FOOTER_TEXT,
} from '../../data/plan.js';
import { drillCard, lockedDrill, promotionCard } from './parts.js';
import { gateItems, isChecked, pendingPromotion } from '../gates.js';

const SECTIONS = [
  { id: 'phases', label: 'Phases' },
  { id: 'how', label: 'How it works' },
  { id: 'catchup', label: 'Catch-up' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'science', label: 'Science' },
];
const PHASE_LABEL = { p1: 'PHASE 1', p2a: 'PHASE 2A', p2b: 'PHASE 2B', p3: 'PHASE 3', p4: 'PHASE 4' };
const PHASE_DISPLAY = {
  p1: 'Stationary ball mastery',
  p2a: 'Movement — walking pace',
  p2b: 'Turns & stops',
  p3: 'Passing at the wall',
  p4: 'Pressure & play',
};

function subNav(current) {
  return `<div class="pnav" role="group" aria-label="Plan sections">${SECTIONS
    .map((s) => `<button class="pnav-btn" data-action="plan.section" data-value="${s.id}" aria-pressed="${s.id === current}">${s.label}</button>`)
    .join('')}</div>`;
}

function requiredGateProgress(state, phaseId) {
  const items = gateItems(phaseId).filter((it) => !it.optional);
  const done = items.filter((it) => isChecked(state, phaseId, it.id)).length;
  return { done, total: items.length };
}

function phaseBlock(store, phase, promo) {
  const { state, ui } = store;
  const anyUnlocked = phase.drills.some((id) => state.drillStates[id] !== 'locked');
  const isLockedPhase = !anyUnlocked;

  let count = '';
  if (phase.gate && !isLockedPhase) {
    const g = requiredGateProgress(state, phase.id);
    count = `<span class="gate-count ${g.done >= g.total ? 'complete' : ''}">GATES ${g.done}/${g.total}</span>`;
  } else if (isLockedPhase) {
    count = `<span class="gate-count locked">LOCKED</span>`;
  }

  const head = `
<div class="phase-head${isLockedPhase ? ' locked' : ''}">
  <div><span class="phase-eyebrow">${PHASE_LABEL[phase.id]}</span><span class="phase-name">${PHASE_DISPLAY[phase.id]}</span></div>
  ${count}
</div>`;

  const promoHTML = (promo && promo.from === phase.id) ? promotionCard(promo) : '';

  // Verbatim context, kept below the compact header.
  const sub = isLockedPhase ? '' : `<p class="screen-sub" style="font-size:13.5px">${phase.sub}</p>`;
  const intros = isLockedPhase ? '' : (phase.intros || [])
    .map((i) => `<div class="${i.kind === 'real' ? 'real' : 'note'}">${i.html}</div>`).join('');

  const drills = phase.drills.map((id) => {
    const st = state.drillStates[id];
    if (st === 'locked') return lockedDrill(id);
    return drillCard(id, {
      open: ui.openDrills.has(id),
      drillState: st,
      note: state.drillNotes ? state.drillNotes[id] : null,
    });
  }).join('');

  const outro = (!isLockedPhase && phase.outro)
    ? `<div class="${phase.outro.kind === 'real' ? 'real' : 'note'}">${phase.outro.html}</div>` : '';

  return `<div class="phase">${head}${promoHTML}${sub}${intros}${drills}${outro}</div>`;
}

function phasesSection(store) {
  const { state, ui } = store;
  const promo = ui.promoHidden ? null : pendingPromotion(state);
  const undo = state.undoSnapshot
    ? `<div class="undo-line">Just promoted. <button class="linkbtn" data-action="promo.undo">Undo</button></div>`
    : '';
  const phases = PHASES.map((p) => phaseBlock(store, p, promo)).join('');
  return `
<div>
  <h1 class="screen-title">The Plan</h1>
  <p class="screen-sub">Four phases. Gates decide readiness — you decide promotion.</p>
</div>
${undo}
${phases}`;
}

function howSection() {
  const H = HOW_IT_WORKS;
  const edges = H.edges.map((e) => `<div class="edge"><h3>${e.h3}</h3><p>${e.p}</p></div>`).join('');
  return `
<h1 class="screen-title">${H.h2}</h1>
<p class="answer">${H.answer}</p>
<p class="prose">${H.intro}</p>
<div class="mini">${H.miniTitle}</div>
${edges}
<div class="note">${H.note}</div>`;
}

function catchupSection() {
  const C = CATCHUP;
  const edges = C.edges.map((e) => `<div class="edge"><div class="lbl">${e.lbl}</div><h3>${e.h3}</h3><p>${e.p}</p></div>`).join('');
  const blocks = C.blocks.map((b) => `<div class="${b.kind === 'real' ? 'real' : 'note'}">${b.html}</div>`).join('');
  return `
<h1 class="screen-title">${C.h2}</h1>
<p class="screen-sub">${C.sub}</p>
${edges}
${blocks}`;
}

function timelineSection() {
  const T = TIMELINE;
  const rows = T.rows.map((r) => `<div class="tl-row"><div class="w">${r.w}</div><div><h4>${r.h4}</h4><p>${r.p}</p></div></div>`).join('');
  const blocks = T.blocks.map((b) => `<div class="${b.kind === 'real' ? 'real' : 'note'}">${b.html}</div>`).join('');
  return `
<h1 class="screen-title">${T.h2}</h1>
<p class="screen-sub">${T.sub}</p>
<div class="tl">${rows}</div>
${blocks}`;
}

function sciBlock(b) {
  if (b.type === 'p') return `<p class="prose">${b.html}</p>`;
  if (b.type === 'small') return `<p class="prose" style="color:var(--muted);font-size:13px">${b.html}</p>`;
  if (b.type === 'note') return `<div class="note">${b.html}</div>`;
  if (b.type === 'stats') return `<div class="stats">${b.items.map((s) => `<div class="stat"><div class="big">${s.big}<small>${s.unit}</small></div><div class="cap">${s.cap}</div></div>`).join('')}</div>`;
  if (b.type === 'levels') return `<div class="levels">${b.items.map((l) => `<div class="lvl"><div class="hrs">${l.hrs}</div><div><div class="bar"><i style="width:${l.pct}%"></i></div><div class="lbl2">${l.lbl}</div></div></div>`).join('')}</div>`;
  return '';
}

function scienceSection() {
  const S = SCIENCE;
  const b = S.blocks;
  let body = '';
  let i = 0;
  while (i < b.length) {
    if (b[i].type === 'q') {
      const q = b[i].text; i++;
      let inner = '';
      while (i < b.length && b[i].type !== 'q') { inner += sciBlock(b[i]); i++; }
      body += `<details class="sci"><summary>${q}<span class="sci-chev">▶</span></summary><div class="sci-inner">${inner}</div></details>`;
    } else {
      body += sciBlock(b[i]); i++;
    }
  }
  return `
<h1 class="screen-title">${S.h2}</h1>
<p class="screen-sub">${S.sub}</p>
<p class="answer">${S.answer}</p>
<p class="set-hint" style="margin-top:-4px">Tap a question to open it.</p>
${body}`;
}

export function renderPlan(store) {
  const current = store.ui.plan.section;
  let body;
  if (current === 'how') body = howSection();
  else if (current === 'catchup') body = catchupSection();
  else if (current === 'timeline') body = timelineSection();
  else if (current === 'science') body = scienceSection();
  else body = phasesSection(store);

  return `
<section class="view view-plan">
  ${subNav(current)}
  ${body}
  <footer class="plan-footer">${FOOTER_TEXT}</footer>
</section>`;
}
