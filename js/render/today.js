// ============================================================
// js/render/today.js — the daily companion (design: 1a / 1c).
// Compact block rows: title + one cue + ⓘ how-to popup + check.
// Header reflects a phase "bridge" honestly when the session spans
// more than one phase (the current starting position is 1 → 2a).
// ============================================================

import { generateSession, lastPainFlag } from '../session.js';
import { DRILLS } from '../../data/plan.js';
import { bannersHTML, infoButton } from './parts.js';

const MINUTES = [10, 20, 30, 45];
const CONDITIONS = [
  { id: 'dry', label: 'DRY GRASS', flex: 1.2 },
  { id: 'wet', label: 'WET', flex: 1 },
  { id: 'indoorsHard', label: 'INDOORS', flex: 1 },
];
const ORDER = ['p1', 'p2a', 'p2b', 'p3', 'p4'];
const PHASE_LABEL = { p1: 'PHASE 1', p2a: 'PHASE 2A', p2b: 'PHASE 2B', p3: 'PHASE 3', p4: 'PHASE 4' };
const PHASE_NUM = { p1: '1', p2a: '2A', p2b: '2B', p3: '3', p4: '4' };
const PHASE_SHORT = { p1: 'Ball mastery', p2a: 'Walking dribble', p2b: 'Turns & stops', p3: 'Wall passing', p4: 'Game shape' };
const DRILL_SHORT = {
  toeTaps: 'toe taps', foundations: 'foundations', soleRolls: 'sole rolls', juggling: 'juggling',
  dribbleLaces: 'walking dribble', coneWeave: 'cone weave', pullBack: 'pull-back turn', redLight: 'red light / green light',
  pushPass: 'push pass', wallClose: 'wall passing', firstTouch: 'first touch', wallStepped: 'wall passing',
  smallSided: 'small-sided games', soloUpkeep: 'solo upkeep', feint: 'feint',
};

function isoDate(d) {
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
}
function dateLine(d) {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return `${days[d.getDay()]} · ${months[d.getMonth()]} ${d.getDate()}`;
}
function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

function subtitleFor(session) {
  if (session.meta.scaledDown) return 'Stationary touch only.';
  const names = (session.meta.mainPicks || []).map((id) => DRILL_SHORT[id] || DRILLS[id].name);
  if (!names.length) return 'Warm-up and touch work.';
  return cap(names.join(' + ')) + '.';
}
function footwearShort(conditions) {
  switch (conditions) {
    case 'wet': return 'Wet — turf/cushioned, mind your footing';
    case 'indoorsHard': return 'Indoors — cushioned trainers, no cleats';
    default: return 'Dry grass — cleats or turf once moving';
  }
}

function segRow(action, current, opts, interactive = true) {
  return opts.map((o) => {
    const val = typeof o === 'object' ? o.id : o;
    const label = typeof o === 'object' ? o.label : String(o);
    const on = String(current) === String(val);
    const flex = (typeof o === 'object' && o.flex) ? ` style="flex:${o.flex}"` : '';
    const act = interactive ? ` data-action="${action}" data-value="${val}"` : '';
    const tag = interactive ? 'button' : 'span';
    return `<${tag} class="seg-cell"${flex}${act} aria-pressed="${on}">${label}</${tag}>`;
  }).join('');
}

function infoKeyFor(block, warmupType) {
  if (block.kind === 'warmup') return warmupType === 'dynamic' ? 'warmupDynamic' : 'warmupBall';
  if (block.kind === 'weakfoot') return 'weakfoot';
  if (block.kind === 'cooldown') return 'cooldown';
  return null;
}

const TAG_LABEL = { p1: 'P1', p2a: '2A', p2b: '2B', p3: 'P3', p4: 'P4' };

// Small phase tag per block, so the bridge (mixing phases) is legible.
function phaseTagFor(block) {
  if (block.drillId) {
    const ph = DRILLS[block.drillId].phase;
    return { text: TAG_LABEL[ph] || ph.toUpperCase(), cls: `ph-${ph}` };
  }
  if (block.kind === 'warmup') return { text: 'WARM', cls: 'ph-gen' };
  if (block.kind === 'weakfoot') return { text: 'WEAK', cls: 'ph-gen' };
  if (block.kind === 'cooldown') return { text: 'COOL', cls: 'ph-gen' };
  return null;
}

function blockCard(block, ui, warmupType) {
  const checked = ui.today.checked.has(block.id);
  const infoAttr = block.drillId ? `data-drill="${block.drillId}"` : `data-info="${infoKeyFor(block, warmupType)}"`;
  const tag = phaseTagFor(block);
  const tagHTML = tag ? `<span class="phase-tag ${tag.cls}">${tag.text}</span>` : '';
  return `
<div class="block${checked ? ' done' : ''}">
  <div class="time-col"><span class="time">${block.range}</span>${tagHTML}</div>
  <div class="b-main"><div class="b-title">${block.name}</div><div class="b-cue">${block.cue}</div></div>
  ${infoButton(infoAttr)}
  <input type="checkbox" class="check" data-action="today.block" data-block="${block.id}"${checked ? ' checked' : ''} aria-label="Mark done: ${block.name}">
</div>`;
}

function afterCard(store, session) {
  const { state, ui } = store;
  const logged = state.sessions.filter((s) => s.date === isoDate(new Date())).slice(-1)[0] || null;
  const painSel = logged ? logged.pain : ui.today.pain;
  const energySel = logged ? logged.energy : ui.today.energy;
  const painOpts = [{ id: 0, label: 'None' }, { id: 1, label: 'Niggle' }, { id: 2, label: 'Sharp' }];
  const energyOpts = [{ id: 1, label: 'Low' }, { id: 2, label: 'OK' }, { id: 3, label: 'High' }];

  const doneControl = logged
    ? `<div class="markdone done">✓ DONE${logged.time ? ` · ${logged.time}` : ''}</div>`
    : `<button class="markdone" data-action="today.save">MARK DONE</button>`;
  const warn = painSel === 2
    ? `<div class="warnbox tint-tan"><p>Sharp pain is a stop sign, not a setback. You did the right thing by logging it.</p><span class="warn-sub">TOMORROW · SCALED TO STATIONARY WORK</span></div>`
    : '';

  return `
<div class="card after">
  <div class="label">After the session</div>
  <div class="after-row"><span class="after-key">DONE</span>${doneControl}</div>
  <div class="after-row"><span class="after-key">PAIN</span><div class="seg light">${segRow('today.pain', painSel, painOpts, !logged)}</div></div>
  <div class="after-row"><span class="after-key">ENERGY</span><div class="seg light">${segRow('today.energy', energySel, energyOpts, !logged)}</div></div>
  ${warn}
</div>`;
}

export function renderToday(store) {
  const { state, ui } = store;
  const minutes = ui.today.minutes;
  const conditions = ui.today.conditions;

  const session = generateSession({
    minutes, conditions,
    drillStates: state.drillStates,
    hipStatus: state.hipStatus,
    lastPain: lastPainFlag(state.sessions),
    rotationIndex: state.rotationIndex,
  });
  ui.today.session = session;

  const today = new Date();
  const phaseSet = new Set(session.blocks.filter((b) => b.drillId).map((b) => DRILLS[b.drillId].phase));
  const distinct = ORDER.filter((p) => phaseSet.has(p));
  const bridge = distinct.length > 1;
  const title = session.meta.scaledDown ? 'Scaled down' : (bridge ? 'Bridge week' : (PHASE_SHORT[state.phase] || 'Today'));
  const badgeText = session.meta.scaledDown
    ? (PHASE_LABEL[state.phase] || '')
    : (bridge ? distinct.map((p) => PHASE_NUM[p]).join(' → ') : (PHASE_LABEL[state.phase] || ''));

  const pickers = `
<div class="pickers">
  <div><div class="label picker-label">Time</div><div class="seg" role="group" aria-label="Minutes available">${segRow('today.minutes', minutes, MINUTES)}</div></div>
  <div><div class="label picker-label">Conditions</div><div class="seg" role="group" aria-label="Conditions">${segRow('today.conditions', conditions, CONDITIONS)}</div></div>
</div>`;

  const blocks = session.blocks.map((b) => blockCard(b, ui, session.meta.warmupType)).join('');

  return `
<section class="view view-today">
  <div class="today-head">
    <div class="daterow"><span class="date">${dateLine(today)}</span><span class="phase-badge">${badgeText}</span></div>
    <h1 class="screen-title">${title}</h1>
    <p class="screen-sub">${subtitleFor(session)}</p>
  </div>

  ${pickers}
  ${bannersHTML(session.banners)}
  <div class="session-meta">≈ ${session.minutes} MIN · ${session.meta.warmupType === 'dynamic' ? 'DYNAMIC WARM-UP' : 'BALL-TOUCH WARM-UP'} · tap ⓘ for how-to</div>

  <div class="blocks">${blocks}</div>

  ${afterCard(store, session)}

  <div class="safety-strip">
    <span class="safety-chip"><span class="sc-ico">👟</span>${footwearShort(conditions)}</span>
    <button class="safety-more" data-action="info.open" data-info="safety">Pain &amp; weather rules <span class="i-inline" aria-hidden="true">i</span></button>
  </div>
</section>`;
}
