// ============================================================
// js/render/parts.js — shared HTML fragments (design anatomy).
// Content strings come from our own data modules (trusted), so
// inline <b>/<em> markup is intentionally passed through.
// ============================================================

import { DRILLS, DRILL_SURFACE } from '../../data/plan.js';
import { DIAGRAMS } from '../../data/diagrams.js';
import { isChecked } from '../gates.js';

// ------------------------------------------------------------
// Surface physics — a small animated demo of how the ball behaves
// on grass (drags to a stop) vs concrete (rolls fast & true).
// CSS keyframes drive .demo-ball; honours prefers-reduced-motion.
// ------------------------------------------------------------
function surfLabel(where) {
  return where === 'grass' ? 'On grass' : where === 'concrete' ? 'On concrete' : 'Either surface';
}

export function surfaceDemo(where) {
  if (where !== 'grass' && where !== 'concrete') return '';
  const grass = where === 'grass';
  const lane = grass ? '#e9efe6' : '#eceadf';
  const laneB = grass ? '#bfceba' : '#ddd8c9';
  const marker = grass
    ? '<line x1="150" y1="18" x2="150" y2="50" stroke="#1f6b3b" stroke-width="1.5" stroke-dasharray="3 3"></line><text x="150" y="14" text-anchor="middle" font-family="ui-monospace,Menlo,monospace" font-size="8" fill="#6f6a5b">stops</text>'
    : '<line x1="236" y1="18" x2="236" y2="50" stroke="#8a6a33" stroke-width="1.5" stroke-dasharray="3 3"></line><text x="232" y="14" text-anchor="end" font-family="ui-monospace,Menlo,monospace" font-size="8" fill="#8a6a33">runs on…</text>';
  const cap = grass
    ? 'Grass drags the ball to a stop — it stays with you through the cut.'
    : 'Concrete rolls fast and true — great feedback, but keep your touch light or it runs.';
  return `
<div class="surf-demo">
  <svg viewBox="0 0 260 56" width="260" height="56" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="0" y="34" width="260" height="8" rx="2" fill="${lane}" stroke="${laneB}"></rect>
    ${marker}
    <g transform="translate(14,30)"><rect x="-12" y="-6" width="22" height="12" rx="6" fill="#fbfaf5" stroke="#13110d" stroke-width="1.5"></rect></g>
    <circle class="demo-ball ${grass ? 'grass' : 'concrete'}" cx="26" cy="30" r="7" fill="#fbfaf5" stroke="#13110d" stroke-width="1.5"></circle>
  </svg>
  <p class="surf-cap">${cap}</p>
</div>`;
}

export function surfacePopup() {
  return `
<div class="modal-head"><div class="modal-title">Grass vs concrete</div><div class="modal-tagline">Why the surface changes the drill</div></div>
${surfaceDemo('grass')}
${surfaceDemo('concrete')}
<p class="modal-p"><b>It comes down to friction and hardness.</b> Grass grips and drags the ball, so it slows and stops — that’s what keeps it with you when you cut, weave, or stop it dead, and the soft ground spares your hip and shins on the hard direction-changes (studs bite for grip, too). Concrete is smooth and hard: the ball rolls fast, far, and dead-true with no bobble — perfect for grooving a clean touch and true passes — but there’s almost no friction to stop a cut (the ball skids, you slip), and every landing pounds your joints.</p>
<p class="modal-p"><b>So:</b> touch, juggling, straight-line dribbling and passing live on <b>concrete</b>; anything that cuts, turns, or stops at pace lives on <b>grass</b>. On a day you’ve got both, each drill is tagged so you know where to stand.</p>`;
}

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
  const surf = DRILL_SURFACE[id];
  const surfSection = surf
    ? `<div class="surf-why"><span class="surf-pill ${surf.where}">${surfLabel(surf.where)}</span><p class="surf-why-text">${surf.why}</p>${surfaceDemo(surf.where)}</div>`
    : '';
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
  return `<div class="drill-body">${diagram}${surfSection}${startbox}${full}${cues}${addbox}${chips}</div>`;
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

function footwearFull(surface) {
  switch (surface) {
    case 'grass': return 'Grass — FG cleats or turf shoes once you’re moving.';
    case 'solid': return 'Concrete / solid ground — cushioned trainers only, never cleats (shin-splint history). Keep cutting and turning for a grass day.';
    case 'wet': return 'Wet grass — turf shoes or cushioned trainers, and watch your footing. A slip under load is a classic hip-flexor or groin injury.';
    case 'indoors': return 'Indoors — cushioned trainers only, never cleats, never socks on smooth floors (shin-splint history).';
    default: return 'You’ve got both today — cushioned trainers on the concrete for touch work; FG cleats or turf on the grass once you’re moving and cutting.';
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

export function safetyPopup(surface) {
  return `
<div class="modal-head"><div class="modal-title">Safety rules</div></div>
<p class="modal-p"><b>Pain.</b> Sharp or pinching pain — especially at the front of the hip on a knee drive, cut, or stop — means stop that movement, finish with stationary work, and tell your PT. Dull next-day soreness is normal.</p>
<p class="modal-p"><b>Surface.</b> Touch, juggling and straight-line dribbling are fine on concrete; turns and cuts belong on grass, where a slip or a hard stop won’t punish the hip or shins.</p>
<p class="modal-p"><b>Footwear.</b> ${footwearFull(surface)}</p>
<p class="modal-p"><b>Weather.</b> Cold (&lt;~35°F): extend the warm-up, keep moving, nothing maximal until warm. Heat: shorten it, find shade, drink water.</p>
<p class="modal-p"><b>Missed days.</b> Resume where you left off; the first day back runs about 20% lighter. No make-up sessions — daily beats long.</p>`;
}

export { STATE_LABEL };
