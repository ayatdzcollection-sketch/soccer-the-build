// ============================================================
// js/session.js — the session generator.
//
// Builds today's session from: minutes (10/20/30/45), conditions
// (dry | wet | indoorsHard), drillStates, hipStatus, and last
// session's pain flag. Rules apply in the priority order below.
// The generator suggests — it never mutates state or auto-advances.
// ============================================================

import { DRILLS } from '../data/plan.js';

// Time budgets per requested length: [warmup, main, stretch, weakfoot, cooldown]
const SCHEDULE = {
  10: { warmup: 3, main: 7, stretch: 0, weakfoot: 0, cooldown: 0, mainPicks: 1 },
  20: { warmup: 4, main: 12, stretch: 0, weakfoot: 4, cooldown: 0, mainPicks: 2 },
  30: { warmup: 5, main: 13, stretch: 7, weakfoot: 5, cooldown: 0, mainPicks: 3 },
  45: { warmup: 6, main: 16, stretch: 10, weakfoot: 8, cooldown: 5, mainPicks: 3 },
};

const BALL_WARMUP = {
  name: 'Warm-up touches',
  cue: 'Toe taps and sole rolls to wake the feet up. Look down as much as you need.',
};
const DYNAMIC_WARMUP = {
  name: 'Dynamic warm-up',
  cue: 'Leg swings (both planes), walking lunges, easy skips, two easy 10-yd build-ups.',
};

function rotate(arr, k) {
  if (arr.length === 0) return arr;
  const n = ((k % arr.length) + arr.length) % arr.length;
  return arr.slice(n).concat(arr.slice(0, n));
}

// Order a pool of drill ids so learning is favored over main over maintenance.
function priorityOrder(ids, drillStates) {
  const rank = { learning: 0, main: 1, maintenance: 2 };
  return ids
    .slice()
    .sort((a, b) => (rank[drillStates[a]] ?? 9) - (rank[drillStates[b]] ?? 9));
}

// Turn a list of {dur, ...block} into blocks with minute ranges.
function withRanges(rawBlocks) {
  let t = 0;
  return rawBlocks.map((b) => {
    const start = t;
    const end = t + b.dur;
    t = end;
    return { ...b, range: `${start}–${end}` };
  });
}

// Split a total duration across n picks (whole minutes, remainder to the front).
function splitDuration(total, n) {
  if (n <= 0) return [];
  const base = Math.floor(total / n);
  const rem = total - base * n;
  return Array.from({ length: n }, (_, i) => base + (i < rem ? 1 : 0));
}

// ------------------------------------------------------------
// Scale-down override (last session pain === sharp)
// Stationary-only: warm-up + foundations + juggling, capped 20.
// ------------------------------------------------------------
function scaleDownSession(reqMinutes) {
  const total = Math.min(reqMinutes || 20, 20);
  const w = Math.max(2, Math.round(total * 0.2));
  const f = Math.round(total * 0.5);
  const j = Math.max(1, total - w - f);
  const raw = [
    { dur: w, kind: 'warmup', id: 'warmup', drillId: null, ...BALL_WARMUP },
    { dur: f, kind: 'main', id: 'foundations', drillId: 'foundations', name: DRILLS.foundations.name, cue: DRILLS.foundations.cue },
    { dur: j, kind: 'stretch', id: 'juggling', drillId: 'juggling', name: DRILLS.juggling.name, cue: DRILLS.juggling.cue },
  ];
  return {
    blocks: withRanges(raw),
    banners: [{
      kind: 'warn', tone: 'scale',
      text: 'Scaled down after your last check-in. Stationary touch work only today. Mention the pain at PT if it repeats.',
    }],
    minutes: total,
    meta: { scaledDown: true, warmupType: 'ball', mainPicks: ['foundations'] },
  };
}

// ------------------------------------------------------------
// Main entry
// ------------------------------------------------------------
export function generateSession(input) {
  const {
    minutes: reqMinutes = 30,
    conditions = 'dry',
    drillStates = {},
    hipStatus = 'quiet',
    lastPain = 0,
    rotationIndex = 0,
  } = input || {};

  // Rule 1 — scale-down override (highest priority).
  if (lastPain === 2) return scaleDownSession(reqMinutes);

  const banners = [];
  const flared = hipStatus === 'flared';

  // Rule 1b — hip-flare softening (a modifier, not an early return).
  if (flared) {
    banners.push({ kind: 'warn', text: 'Hip flared — turns stay at walking pace today.' });
  }

  // Rule 2 — conditions filter.
  let minutes = reqMinutes;
  let stationaryOnly = false;
  if (conditions === 'wet') {
    banners.push({ kind: 'info', text: 'No turns or cuts on wet grass — today is straight-line and stationary work.' });
  } else if (conditions === 'indoorsHard') {
    stationaryOnly = true;
    minutes = Math.min(minutes, 20);
    banners.push({
      kind: 'info',
      text: 'Hard surface — stationary work only, keep it under 20 minutes. Cushioned trainers, never cleats.',
    });
  }

  const sched = SCHEDULE[minutes] || SCHEDULE[30];

  // ---- Build the available main pool ------------------------
  const unlocked = (id) => drillStates[id] && drillStates[id] !== 'locked';
  const isMainish = (id) => ['main', 'learning', 'maintenance'].includes(drillStates[id]);

  let mainPool = Object.keys(DRILLS).filter((id) => {
    const f = DRILLS[id].flags || {};
    if (!unlocked(id)) return false;
    if (!isMainish(id)) return false;
    if (f.stretchSkill) return false; // handled in its own slot
    // conditions
    if (stationaryOnly && !f.stationary) return false;
    if (conditions === 'wet' && f.cut) return false; // no turns/cuts on wet grass
    // hip flare drops red light / green light for the day
    if (flared && id === 'redLight') return false;
    return true;
  });

  mainPool = priorityOrder(mainPool, drillStates);
  mainPool = rotate(mainPool, rotationIndex);

  const nPicks = Math.min(sched.mainPicks, mainPool.length);
  const picks = mainPool.slice(0, nPicks);

  // Warm-up type: dynamic if any picked drill involves movement.
  const anyMovement = picks.some((id) => (DRILLS[id].flags || {}).movement);
  const warmupMeta = anyMovement ? DYNAMIC_WARMUP : BALL_WARMUP;

  // ---- Assemble blocks --------------------------------------
  const raw = [];
  raw.push({ dur: sched.warmup, kind: 'warmup', id: 'warmup', drillId: null, name: warmupMeta.name, cue: warmupMeta.cue });

  if (picks.length > 0) {
    const durs = splitDuration(sched.main, picks.length);
    picks.forEach((id, i) => {
      const drill = DRILLS[id];
      const f = drill.flags || {};
      let cue = drill.cue;
      // Hip-flare: any turning/cutting drill stays at walking pace.
      if (flared && (f.cut || f.turn)) cue = 'Walking pace only today (hip). ' + cue;
      raw.push({ dur: durs[i], kind: 'main', id, drillId: id, name: drill.name, cue });
    });
  } else {
    // Nothing in the main pool (heavily filtered) — fall back to foundations.
    raw.push({ dur: sched.main, kind: 'main', id: 'foundations', drillId: 'foundations', name: DRILLS.foundations.name, cue: DRILLS.foundations.cue });
  }

  // Stretch skill (juggling) — 30 & 45 only, if unlocked.
  if (sched.stretch > 0 && unlocked('juggling')) {
    raw.push({ dur: sched.stretch, kind: 'stretch', id: 'juggling', drillId: 'juggling', name: DRILLS.juggling.name, cue: DRILLS.juggling.cue });
  }

  // Weak-foot finish — 20/30/45.
  if (sched.weakfoot > 0) {
    raw.push({
      dur: sched.weakfoot, kind: 'weakfoot', id: 'weakfoot', drillId: null,
      name: 'Weak-foot finish',
      cue: 'Everything above, weaker foot only — the fastest gap you can close.',
    });
  }

  // Cool-down — 45 only.
  if (sched.cooldown > 0) {
    raw.push({
      dur: sched.cooldown, kind: 'cooldown', id: 'cooldown', drillId: null,
      name: 'Cool down',
      cue: 'Easy juggling or rolls — let the heart rate settle.',
    });
  }

  return {
    blocks: withRanges(raw),
    banners,
    minutes,
    meta: { scaledDown: false, warmupType: anyMovement ? 'dynamic' : 'ball', mainPicks: picks },
  };
}

// The pain flag from the most recent session (0 if none).
export function lastPainFlag(sessions) {
  if (!Array.isArray(sessions) || sessions.length === 0) return 0;
  const last = sessions[sessions.length - 1];
  return typeof last.pain === 'number' ? last.pain : 0;
}
