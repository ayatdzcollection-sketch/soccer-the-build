// ============================================================
// js/render/parts.js — shared HTML fragments (design anatomy).
// Content strings come from our own data modules (trusted), so
// inline <b>/<em> markup is intentionally passed through.
// ============================================================

import { DRILLS } from '../../data/plan.js';
import { DIAGRAMS } from '../../data/diagrams.js';
import { isChecked } from '../gates.js';

const STATE_LABEL = {
  locked: 'Locked', learning: 'Learning', main: 'Main',
  warmup: 'Warm-up', maintenance: 'Maintenance',
};

export function badge(state) {
  return `<span class="badge ${state}">${(STATE_LABEL[state] || state)}</span>`;
}

// Full drill anatomy: [diagram] → START HERE → full → FORM CUES →
// ADD LAST → goal/miss. The diagram slot is omitted until a mock exists.
export function drillBody(id) {
  const d = DRILLS[id];
  if (!d) return '';
  const diagram = DIAGRAMS[id] ? `<div class="diagram">${DIAGRAMS[id]}</div>` : '';
  const startbox = d.startHere
    ? `<div class="startbox"><div class="box-label">START HERE — CAN’T FAIL</div><p>${d.startHere}</p></div>`
    : '';
  const full = d.full ? `<p class="drill-full">${d.full}</p>` : '';
  const cues = (d.cues || []).length
    ? `<div class="cues"><div class="cues-label">FORM CUES</div>${d.cues
        .map((c) => `<div class="cue-row"><span class="cue-mark"></span><span>${c}</span></div>`)
        .join('')}</div>`
    : '';
  const addbox = d.addLast
    ? `<div class="addbox"><div class="box-label">${d.addLast.label.toUpperCase()} — PROGRESSION</div><p>${d.addLast.text}</p></div>`
    : '';
  const chips = (d.tags || []).length
    ? `<div class="chips">${d.tags.map((t) => `<span class="chip ${t.type}">${t.text}</span>`).join('')}</div>`
    : '';
  return `<div class="drill-body">${diagram}${startbox}${full}${cues}${addbox}${chips}</div>`;
}

// Drill row for the Plan view (expandable, with a status chip + optional note).
export function drillCard(id, { open = false, drillState = null, note = null } = {}) {
  const d = DRILLS[id];
  if (!d) return '';
  const noteHTML = note ? `<div class="dnote">${note}</div>` : '';
  return `
<details class="drill" data-drill="${id}"${open ? ' open' : ''}>
  <summary>
    <div class="row-main"><div class="row-name">${d.name}</div><div class="row-cue">${d.tagline}</div></div>
    ${drillState ? badge(drillState) : ''}
    <span class="chev">▶</span>
  </summary>
  ${noteHTML}${drillBody(id)}
</details>`;
}

// Locked drill — dashed, greyed, non-expandable.
export function lockedDrill(id) {
  const d = DRILLS[id];
  if (!d) return '';
  return `
<div class="locked-drill">
  <div class="row-main"><div class="row-name">${d.name}</div><div class="row-cue">${d.lockReason || 'Locked'}</div></div>
  <span class="badge locked">Locked</span>
</div>`;
}

// Small round info button. `attrs` carries the target, e.g. data-drill / data-info.
export function infoButton(attrs) {
  return `<button class="info-btn" data-action="info.open" ${attrs} aria-label="How to do this"><span aria-hidden="true">i</span></button>`;
}

// Gate checklist item (interactive checkbox bound to state.gates).
export function gateItem(state, phaseId, it) {
  const on = isChecked(state, phaseId, it.id);
  const opt = it.optional ? '<span class="opt">optional</span>' : '';
  return `
<label class="gate-item">
  <input type="checkbox" class="gcheck check" data-action="gate.toggle" data-phase="${phaseId}" data-item="${it.id}"${on ? ' checked' : ''}>
  <span>${it.text}${opt}</span>
</label>`;
}

export function bannersHTML(banners) {
  if (!banners || !banners.length) return '';
  return banners
    .map((b) => {
      const cls = b.kind === 'info' ? 'info' : 'warn';
      return `<div class="banner ${cls}"><span class="dot"></span><p>${b.text}</p></div>`;
    })
    .join('');
}

export function promotionCard(promo) {
  if (!promo) return '';
  return `
<div class="promo">
  <div class="promo-label">READY TO PROMOTE?</div>
  <p>All required gates are checked. ${promo.summary} Nothing advances until you say so.</p>
  <div class="promo-actions">
    <button class="btn btn-quiet" data-action="promo.dismiss">NOT YET</button>
    <button class="btn btn-primary" data-action="promo.confirm">PROMOTE</button>
  </div>
</div>`;
}

// ------------------------------------------------------------
// Info popups (how-to). Non-drill blocks + safety get short copy.
// ------------------------------------------------------------
export const HOWTO = {
  warmupDynamic: {
    title: 'Dynamic warm-up',
    body: 'Leg swings both planes, walking lunges, easy skips, then two easy 10-yard build-ups (~4–6 min). It primes the hips and legs before any movement drill — cold cutting is exactly how a hip flexor or groin goes.',
  },
  warmupBall: {
    title: 'Warm-up touches',
    body: 'Toe taps and sole rolls to wake the feet up before the touch work. Look down as much as you need — this is just to get the feel back.',
  },
  weakfoot: {
    title: 'Weak-foot finish',
    body: 'Run the session’s touch work again using only your weaker foot. It feels clumsy — that’s the point. A one-footed player is easy to defend, and this is the fastest gap you can close.',
  },
  cooldown: {
    title: 'Cool down',
    body: 'Easy juggling or sole rolls, nothing hard. Let the heart rate settle and finish on a clean touch.',
  },
};

function footwearFull(conditions) {
  switch (conditions) {
    case 'wet': return 'Wet grass — turf shoes or cushioned trainers, and watch your footing. A slip under load is a classic hip-flexor or groin injury.';
    case 'indoorsHard': return 'Indoors or driveway — cushioned trainers only, never cleats, never socks on smooth floors (shin-splint history).';
    default: return 'Dry grass — FG cleats or turf shoes once you’re moving; cushioned trainers on a hard driveway.';
  }
}

export function drillPopup(id) {
  const d = DRILLS[id];
  if (!d) return '';
  return `
<div class="modal-head">
  <div class="modal-title">${d.name}</div>
  <div class="modal-tagline">${d.tagline}</div>
</div>
${drillBody(id)}`;
}

export function notePopup(key) {
  const h = HOWTO[key];
  if (!h) return '';
  return `<div class="modal-head"><div class="modal-title">${h.title}</div></div><p class="modal-p">${h.body}</p>`;
}

export function safetyPopup(conditions) {
  return `
<div class="modal-head"><div class="modal-title">Safety rules</div></div>
<p class="modal-p"><b>Pain.</b> Sharp or pinching pain — especially at the front of the hip on a knee drive, cut, or stop — means stop that movement, finish with stationary work, and tell your PT. Dull next-day soreness is normal.</p>
<p class="modal-p"><b>Footwear.</b> ${footwearFull(conditions)}</p>
<p class="modal-p"><b>Weather.</b> Cold (&lt;~35°F): extend the warm-up, keep moving, nothing maximal until warm. Heat: shorten it, find shade, drink water.</p>
<p class="modal-p"><b>Missed days.</b> Resume where you left off; the first day back runs about 20% lighter. No make-up sessions — daily beats long.</p>`;
}

export { STATE_LABEL };
