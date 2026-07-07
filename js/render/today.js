// ============================================================
// js/render/today.js — the daily companion (design: 1a / 1c).
// Surface model: GRASS + SOLID are the everyday toggles (you have
// both outside on a good day); WET / INDOORS are non-central "just
// today" overrides. Which drills a surface allows depends on the
// drill — cutting/turning needs grass; touch/straight-line is fine
// on solid ground. In "both" mode each block is tagged with where
// to do it.
// ============================================================

import { generateSession, lastPainFlag } from '../session.js';
import { DRILLS, DRILL_SURFACE } from '../../data/plan.js';
import { bannersHTML, infoButton } from './parts.js';

const MINUTES = [10, 20, 30, 45];
const ORDER = ['p1', 'p2a', 'p2b', 'p3', 'p4'];
const PHASE_LABEL = { p1: 'PHASE 1', p2a: 'PHASE 2A', p2b: 'PHASE 2B', p3: 'PHASE 3', p4: 'PHASE 4' };
const PHASE_NUM = { p1: '1', p2a: '2A', p2b: '2B', p3: '3', p4: '4' };
const TAG_LABEL = { p1: 'P1', p2a: '2A', p2b: '2B', p3: 'P3', p4: 'P4' };
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
function footwearShort(surface) {
  switch (surface) {
    case 'grass': return 'Grass — FG cleats or turf shoes once moving';
    case 'solid': return 'Concrete — cushioned trainers, never cleats';
    case 'wet': return 'Wet — turf/cushioned, mind your footing';
    case 'indoors': return 'Indoors — cushioned trainers, no cleats';
    default: return 'Concrete for touch, grass for turns — cushioned trainers on concrete';
  }
}

function segRow(action, current, opts, interactive = true) {
  return opts.map((o) => {
    const val = typeof o === 'object' ? o.id : o;
    const label = typeof o === 'object' ? o.label : String(o);
    const on = String(current) === String(val);
    const act = interactive ? ` data-action="${action}" data-value="${val}"` : '';
    const tag = interactive ? 'button' : 'span';
    return `<${tag} class="seg-cell"${act} aria-pressed="${on}">${label}</${tag}>`;
  }).join('');
}

// Surface control: two availability toggles + two "just today" chips.
function surfaceControl(surface) {
  const grassOn = surface === 'both' || surface === 'grass';
  const solidOn = surface === 'both' || surface === 'solid';
  const chip = (id, label) => `<button class="special-chip" data-action="today.surface" data-surf="${id}" aria-pressed="${surface === id}">${label}</button>`;
  return `
<div class="surface">
  <div class="label picker-label">Surface <button class="mini-i" data-action="info.open" data-info="surface" aria-label="Why surface matters"><span aria-hidden="true">i</span></button></div>
  <div class="surface-avail" role="group" aria-label="Surfaces you have today">
    <button class="avail-btn" data-action="today.surface" data-surf="grass" aria-pressed="${grassOn}">GRASS</button>
    <button class="avail-btn" data-action="today.surface" data-surf="solid" aria-pressed="${solidOn}">SOLID</button>
  </div>
  <div class="surface-special">
    <span class="special-lbl">Just today</span>
    ${chip('wet', 'Wet grass')}
    ${chip('indoors', 'Indoors')}
  </div>
</div>`;
}

const TAG_MAP = TAG_LABEL;
function phaseTagFor(block) {
  if (block.drillId) {
    const ph = DRILLS[block.drillId].phase;
    return { text: TAG_MAP[ph] || ph.toUpperCase(), cls: `ph-${ph}` };
  }
  if (block.kind === 'warmup') return { text: 'WARM', cls: 'ph-gen' };
  if (block.kind === 'weakfoot') return { text: 'WEAK', cls: 'ph-gen' };
  if (block.kind === 'cooldown') return { text: 'COOL', cls: 'ph-gen' };
  return null;
}

// Only shown in "both" mode, where the split is the point.
function surfPillFor(block, surface) {
  if (surface !== 'both' || !block.drillId) return '';
  const where = (DRILL_SURFACE[block.drillId] || {}).where;
  if (where === 'grass') return `<span class="surf-pill grass">on grass</span>`;
  if (where === 'concrete') return `<span class="surf-pill concrete">on concrete</span>`;
  if (where === 'either') return `<span class="surf-pill either">either</span>`;
  return '';
}

function infoKeyFor(block, warmupType) {
  if (block.kind === 'warmup') return warmupType === 'dynamic' ? 'warmupDynamic' : 'warmupBall';
  if (block.kind === 'weakfoot') return 'weakfoot';
  if (block.kind === 'cooldown') return 'cooldown';
  return null;
}

function blockCard(block, ui, warmupType, surface) {
  const checked = ui.today.checked.has(block.id);
  const infoAttr = block.drillId ? `data-drill="${block.drillId}"` : `data-info="${infoKeyFor(block, warmupType)}"`;
  const tag = phaseTagFor(block);
  const tagHTML = tag ? `<span class="phase-tag ${tag.cls}">${tag.text}</span>` : '';
  const surfPill = surfPillFor(block, surface);
  return `
<div class="block${checked ? ' done' : ''}">
  <div class="time-col"><span class="time">${block.range}</span>${tagHTML}</div>
  <div class="b-main"><div class="b-title">${block.name}</div><div class="b-cue">${block.cue}</div>${surfPill}</div>
  ${infoButton(infoAttr)}
  <input type="checkbox" class="check" data-action="today.block" data-block="${block.id}"${checked ? ' checked' : ''} aria-label="Mark done: ${block.name}">
</div>`;
}

function energyLabel(e) { return e === 1 ? 'Low' : e === 3 ? 'High' : 'OK'; }
function painLabel(p) { return p === 1 ? 'niggle' : p === 2 ? 'sharp' : ''; }

function todaysLog(sessions) {
  if (!sessions.length) return '';
  const rows = sessions.map((s) => {
    const bits = [`${s.minutes} min`, `${s.blocksDone.length} block${s.blocksDone.length === 1 ? '' : 's'}`, energyLabel(s.energy)];
    const pain = painLabel(s.pain);
    return `<div class="log-row"><span class="log-time">${s.time || '—'}</span><span class="log-detail">${bits.join(' · ')}${pain ? ` · <span class="log-pain p${s.pain}">${pain}</span>` : ''}</span></div>`;
  }).join('');
  return `<div class="today-log"><div class="label">Today’s log · ${sessions.length}</div>${rows}</div>`;
}

function afterCard(store) {
  const { state, ui } = store;
  const todayIso = isoDate(new Date());
  const todaySessions = state.sessions.filter((s) => s.date === todayIso);
  const painSel = ui.today.pain;
  const energySel = ui.today.energy;
  const painOpts = [{ id: 0, label: 'None' }, { id: 1, label: 'Niggle' }, { id: 2, label: 'Sharp' }];
  const energyOpts = [{ id: 1, label: 'Low' }, { id: 2, label: 'OK' }, { id: 3, label: 'High' }];

  const anySharp = painSel === 2 || todaySessions.some((s) => s.pain === 2);
  const warn = anySharp
    ? `<div class="warnbox tint-tan"><p>Sharp pain is a stop sign, not a setback. You did the right thing by logging it.</p><span class="warn-sub">TOMORROW · SCALED TO STATIONARY WORK</span></div>`
    : '';
  const btnLabel = todaySessions.length ? 'LOG ANOTHER SESSION' : 'MARK DONE';

  return `
<div class="card after">
  <div class="label">${todaySessions.length ? 'Log a session' : 'After the session'}</div>
  <div class="after-row"><span class="after-key">PAIN</span><div class="seg light">${segRow('today.pain', painSel, painOpts, true)}</div></div>
  <div class="after-row"><span class="after-key">ENERGY</span><div class="seg light">${segRow('today.energy', energySel, energyOpts, true)}</div></div>
  <button class="markdone full" data-action="today.save">${btnLabel}</button>
  ${warn}
  ${todaysLog(todaySessions)}
</div>`;
}

export function renderToday(store) {
  const { state, ui } = store;
  const minutes = ui.today.minutes;
  const surface = ui.today.surface;

  const session = generateSession({
    minutes, surface,
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
  ${surfaceControl(surface)}
</div>`;

  const blocks = session.blocks.map((b) => blockCard(b, ui, session.meta.warmupType, surface)).join('');

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

  ${afterCard(store)}

  <div class="safety-strip">
    <span class="safety-chip"><span class="sc-ico">👟</span>${footwearShort(surface)}</span>
    <button class="safety-more" data-action="info.open" data-info="safety">Pain &amp; weather rules <span class="i-inline" aria-hidden="true">i</span></button>
  </div>
</section>`;
}
