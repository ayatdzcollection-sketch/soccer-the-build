// ============================================================
// js/render/progress.js — Progress view (design: 1f).
// Week-aligned 28-day dot grid, gate checklists, weekly review.
// No streak counter / broken-chain — deliberate.
// ============================================================

import { PHASES } from '../../data/plan.js';
import { gateItem, promotionCard } from './parts.js';
import { gateItems, isChecked, pendingPromotion } from '../gates.js';

const PHASE_LABEL = { p1: 'PHASE 1', p2a: 'PHASE 2A', p2b: 'PHASE 2B', p3: 'PHASE 3', p4: 'PHASE 4' };

function isoDate(d) {
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
}
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); x.setHours(12, 0, 0, 0); return x; }
function daysBetween(isoA, dB) {
  const a = new Date(isoA + 'T12:00:00');
  const b = new Date(isoDate(dB) + 'T12:00:00');
  return Math.round((b - a) / 86400000);
}
function weekStartMonday(d) { const x = new Date(d); const dow = (x.getDay() + 6) % 7; return addDays(x, -dow); }

function sessionsByDate(sessions) {
  const map = {};
  for (const s of sessions) (map[s.date] = map[s.date] || []).push(s);
  return map;
}

function dotGrid(sessions) {
  const today = new Date();
  const todayIso = isoDate(today);
  const byDate = sessionsByDate(sessions);
  const gridStart = addDays(weekStartMonday(today), -21);
  const dow = ['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((x) => `<span>${x}</span>`).join('');
  let cells = '';
  for (let i = 0; i < 28; i++) {
    const d = addDays(gridStart, i);
    const iso = isoDate(d);
    const list = byDate[iso] || [];
    const hasSession = list.length > 0;
    const worstPain = hasSession ? Math.max(...list.map((s) => s.pain || 0)) : 0;
    let cls, label;
    if (iso === todayIso) {
      cls = hasSession ? (worstPain >= 1 ? 'pain today' : 'done today') : 'today';
      label = `${iso} — today`;
    } else if (daysBetween(iso, today) < 0) {
      cls = 'future'; label = `${iso} — upcoming`;
    } else if (hasSession) {
      cls = worstPain >= 1 ? 'pain' : 'done';
      label = worstPain >= 1 ? `${iso} — session, pain flagged` : `${iso} — session done`;
    } else {
      cls = 'miss'; label = `${iso} — no session`;
    }
    cells += `<span class="dot ${cls}" title="${label}"></span>`;
  }
  return `
<div class="card">
  <div class="label" style="margin-bottom:12px">Last 28 days</div>
  <div class="dow">${dow}</div>
  <div class="dotgrid" role="img" aria-label="Last 28 days of sessions">${cells}</div>
  <div class="legend">
    <span><span class="dot done"></span>done</span>
    <span><span class="dot pain"></span>pain flagged</span>
    <span><span class="dot miss"></span>no session</span>
    <span><span class="dot today"></span>today</span>
  </div>
</div>`;
}

function sessionsThisWeek(sessions) {
  const today = new Date();
  const mon = weekStartMonday(today);
  return sessions.filter((s) => {
    const diff = daysBetween(isoDate(mon), new Date(s.date + 'T12:00:00'));
    return diff >= 0 && diff <= 6;
  }).length;
}

function gatesCard(state) {
  const withGates = PHASES.filter((p) => p.gate);
  const rows = withGates.map((p, idx) => {
    const req = gateItems(p.id).filter((it) => !it.optional);
    const done = req.filter((it) => isChecked(state, p.id, it.id)).length;
    const complete = done >= req.length;
    const head = `
<div class="gate-head${idx > 0 ? ' divided' : ''}">
  <span class="label">${PHASE_LABEL[p.id]} gates</span>
  <span class="gate-count ${complete ? 'complete' : ''}">${done}/${req.length}</span>
</div>`;
    const items = p.gate.items.map((it) => gateItem(state, p.id, it)).join('');
    return head + items;
  }).join('');
  return `<div class="card gates-card">${rows}</div>`;
}

function painSummary(windowSessions) {
  if (!windowSessions.length) return 'No sessions logged since your last review.';
  const twinges = windowSessions.filter((s) => s.pain === 1).length;
  const sharp = windowSessions.filter((s) => s.pain === 2).length;
  if (twinges === 0 && sharp === 0) return 'No pain flagged — clean stretch.';
  const parts = [];
  parts.push(`${twinges} niggle${twinges === 1 ? '' : 's'}`);
  parts.push(sharp === 0 ? 'no sharp pain' : `${sharp} sharp`);
  return parts.join(', ') + '.';
}

function reviewCard(state) {
  const reviews = state.weeklyReviews || [];
  const last = reviews.length ? reviews[reviews.length - 1].date : null;
  const windowSessions = (state.sessions || []).filter((s) => !last || s.date > last);
  const past = reviews.slice().reverse().map((r) => {
    const bits = [];
    if (r.bestFoundationsSec != null && r.bestFoundationsSec !== '') bits.push(`Foundations ${r.bestFoundationsSec}`);
    if (r.jugglingPB != null && r.jugglingPB !== '') bits.push(`Juggle ${r.jugglingPB}`);
    if (r.note) bits.push(String(r.note));
    return `<div class="past-row"><span class="pr-date">${r.date}</span><span class="pr-sum">${escapeHTML(bits.join(' · ')) || '—'}</span></div>`;
  }).join('') || '<p class="set-hint">No reviews yet.</p>';

  return `
<div class="card review-card">
  <div class="label">Weekly review</div>
  <div class="rv-row">
    <div class="rv-field"><div class="rv-key">BEST FOUNDATIONS</div><input id="rf-foundations" type="number" min="0" inputmode="numeric" placeholder="secs"></div>
    <div class="rv-field"><div class="rv-key">JUGGLING PB</div><input id="rf-juggling" type="number" min="0" inputmode="numeric" placeholder="count"></div>
  </div>
  <div class="rv-field"><div class="rv-key">PAIN THIS WEEK <span class="rv-auto">AUTO</span></div><div class="rv-read">${painSummary(windowSessions)}</div></div>
  <div class="rv-field"><div class="rv-key">NOTE</div><textarea id="rf-note" rows="2" placeholder="What clicked, what to fix…"></textarea></div>
  <div class="rv-field"><div class="rv-key">FILM THIS NEXT WEEK</div><input id="rf-film" type="text" style="font-family:var(--serif)" placeholder="e.g. walking dribble, side view"></div>
  <button class="btn btn-primary full" data-action="review.save">SAVE REVIEW</button>
  <div class="past"><div class="label" style="letter-spacing:.14em">Past reviews</div>${past}</div>
</div>`;
}

function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function renderProgress(store) {
  const { state, ui } = store;
  const promo = ui.promoHidden ? null : pendingPromotion(state);
  return `
<section class="view view-progress">
  <div class="progress-head">
    <h1 class="screen-title">Progress</h1>
    <span class="week-tag">THIS WEEK · ${sessionsThisWeek(state.sessions)}</span>
  </div>
  ${dotGrid(state.sessions)}
  ${promo ? promotionCard(promo) : ''}
  ${gatesCard(state)}
  ${reviewCard(state)}
</section>`;
}
