// ============================================================
// js/state.js — load / save / migrate localStorage, export/import.
//
// One key holds the whole app state as JSON. Corrupting the value
// by hand recovers to a clean default rather than crashing (the
// load path is fully guarded). schemaVersion + migrate() let the
// shape evolve later without wiping data.
//
// Saving model, adapted from the running-base reference:
//   - single localStorage key, try/catch → clean default on error
//   - export = download a .json file (spec) instead of clipboard
//   - import = file picker + validation + confirm-overwrite
//   - reset = two-step confirmation, then clears the key
// Cloud: js/sync.js mirrors this state to Supabase (opt-in, code-
// based). localStorage stays the source of truth; schema v2 adds
// the ids/updatedAt that make the cloud merge safe.
// ============================================================

import { DRILL_ORDER, DRILLS } from '../data/plan.js';

export const STORAGE_KEY = 'thebuild.v1';
export const SCHEMA_VERSION = 2;

// ------------------------------------------------------------
// Initial state — the current position is a Phase 1 → 2a bridge.
// ------------------------------------------------------------
export function defaultState() {
  return {
    schemaVersion: SCHEMA_VERSION,
    phase: 'p1', // current phase the user is working; promotions advance it
    drillStates: {
      // warm-up touches
      toeTaps: 'warmup',
      soleRolls: 'warmup',
      // main
      foundations: 'main',
      // learning (walking pace) — the 2a bridge
      dribbleLaces: 'learning',
      coneWeave: 'learning',
      // stretch skill: state "main" but never blocks promotion (flag in DRILLS)
      juggling: 'main',
      // locked until the Phase 2a promotion
      pullBack: 'locked',
      redLight: 'locked',
      // Phase 3 wall/pass drills — unlock on the Phase 2a promotion (stationary, overlaps 2a)
      pushPass: 'locked',
      wallClose: 'locked',
      firstTouch: 'locked',
      wallStepped: 'locked',
      // Phase 4 — opens later
      smallSided: 'locked',
      soloUpkeep: 'locked',
      feint: 'locked',
    },
    drillNotes: {}, // e.g. { foundations: "hold as warm-up ~1 more week" }
    hipStatus: 'quiet', // "quiet" | "flared"  — softens skill turns when flared
    gates: {}, // { [phaseId]: { [gateItemId]: boolean } }
    sessions: [], // { date, minutes, blocksDone:[id], pain:0|1|2, energy:1|2|3 }
    weeklyReviews: [], // { date, bestFoundationsSec, jugglingPB, note, filmTarget }
    settings: { defaultMinutes: 30, surface: 'both' },
    rotationIndex: 0, // day-to-day main-block rotation
    undoSnapshot: null, // one-deep { drillStates, phase, drillNotes } for promotion undo
    updatedAt: null, // stamped on every save; cloud merge compares sides with this
  };
}

// ------------------------------------------------------------
// Load — fully guarded. Any parse/shape error → clean default.
// ------------------------------------------------------------
export function load() {
  let raw;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return defaultState();
  }
  if (!raw) return defaultState();

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return defaultState();
  }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return defaultState();
  }

  try {
    return normalize(migrate(parsed));
  } catch {
    return defaultState();
  }
}

// ------------------------------------------------------------
// Migration stub — bump versions here as the schema evolves.
// ------------------------------------------------------------
export function migrate(state) {
  let s = state;
  const v = typeof s.schemaVersion === 'number' ? s.schemaVersion : 0;

  // v2: sessions & reviews get stable ids so cloud sync can union
  // records from two devices instead of clobbering; updatedAt lets
  // the merge pick the newer side for scalars.
  if (v < 2) {
    if (Array.isArray(s.sessions)) {
      s.sessions = s.sessions.map((x, i) =>
        x && typeof x === 'object' && !x.id ? { ...x, id: `${x.date || 'd'}#${x.time || ''}#${i}` } : x);
    }
    if (Array.isArray(s.weeklyReviews)) {
      s.weeklyReviews = s.weeklyReviews.map((x, i) =>
        x && typeof x === 'object' && !x.id ? { ...x, id: `${x.date || 'd'}#${i}` } : x);
    }
    if (!s.updatedAt) s.updatedAt = new Date().toISOString();
  }

  s.schemaVersion = SCHEMA_VERSION;
  return s;
}

// ------------------------------------------------------------
// Normalize — merge onto a fresh default so missing/garbage fields
// are always well-formed. This is what makes a hand-corrupted
// value recover instead of throwing downstream.
// ------------------------------------------------------------
export function normalize(state) {
  const d = defaultState();
  const s = state && typeof state === 'object' ? state : {};

  const out = {
    schemaVersion: SCHEMA_VERSION,
    phase: typeof s.phase === 'string' ? s.phase : d.phase,
    drillStates: { ...d.drillStates },
    drillNotes: s.drillNotes && typeof s.drillNotes === 'object' && !Array.isArray(s.drillNotes) ? { ...s.drillNotes } : {},
    hipStatus: s.hipStatus === 'flared' ? 'flared' : 'quiet',
    gates: s.gates && typeof s.gates === 'object' && !Array.isArray(s.gates) ? s.gates : {},
    sessions: Array.isArray(s.sessions) ? s.sessions.filter(isValidSession) : [],
    weeklyReviews: Array.isArray(s.weeklyReviews) ? s.weeklyReviews.filter((r) => r && typeof r === 'object') : [],
    settings: { defaultMinutes: 30, surface: 'both' },
    rotationIndex: Number.isFinite(s.rotationIndex) ? Math.floor(s.rotationIndex) : 0,
    undoSnapshot: s.undoSnapshot && typeof s.undoSnapshot === 'object' ? s.undoSnapshot : null,
    updatedAt: typeof s.updatedAt === 'string' ? s.updatedAt : null,
  };

  // Only carry drillStates for known drills, with a known value.
  const VALID = new Set(['locked', 'learning', 'main', 'warmup', 'maintenance']);
  if (s.drillStates && typeof s.drillStates === 'object') {
    for (const id of DRILL_ORDER) {
      const v = s.drillStates[id];
      if (VALID.has(v)) out.drillStates[id] = v;
    }
  }

  // Settings sanity + legacy conditions → surface migration
  const ss = s.settings && typeof s.settings === 'object' ? s.settings : {};
  if ([10, 20, 30, 45].includes(ss.defaultMinutes)) out.settings.defaultMinutes = ss.defaultMinutes;
  const SURFACES = ['both', 'grass', 'solid', 'wet', 'indoors'];
  if (SURFACES.includes(ss.surface)) out.settings.surface = ss.surface;
  else {
    const LEGACY = { dry: 'both', wet: 'wet', indoorsHard: 'indoors' };
    if (LEGACY[ss.conditions]) out.settings.surface = LEGACY[ss.conditions];
  }

  return out;
}

function isValidSession(x) {
  return x && typeof x === 'object' && typeof x.date === 'string' && Array.isArray(x.blocksDone);
}

// ------------------------------------------------------------
// Save
// ------------------------------------------------------------
// stamp=false is used when applying a cloud-merged state: keeping the
// merged updatedAt (instead of minting a new one) is what lets both
// devices converge on an identical blob and stop re-pushing.
export function save(state, stamp = true) {
  try {
    if (stamp) state.updatedAt = new Date().toISOString(); // cloud merge picks the newer side
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

// ------------------------------------------------------------
// Export — download the state as a .json file.
// ------------------------------------------------------------
export function exportState(state) {
  const text = JSON.stringify(state, null, 2);
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `the-build-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ------------------------------------------------------------
// Import — read a File, validate, return a normalized state.
// Throws on invalid input so the caller can show a message and
// keep the current state untouched. Caller confirms overwrite.
// ------------------------------------------------------------
export function importFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the file.'));
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
          throw new Error('Not a valid backup (expected a JSON object).');
        }
        // Loose sanity check: it should look like our state.
        if (!('drillStates' in parsed) && !('sessions' in parsed)) {
          throw new Error('This file doesn’t look like a The Build backup.');
        }
        resolve(normalize(migrate(parsed)));
      } catch (e) {
        reject(new Error(e && e.message ? e.message : 'Invalid backup file.'));
      }
    };
    reader.readAsText(file);
  });
}

// ------------------------------------------------------------
// Reset — clears the key. (Two-step confirmation lives in the UI.)
// ------------------------------------------------------------
export function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

// ------------------------------------------------------------
// Small helpers shared across modules
// ------------------------------------------------------------
export function isStretchSkill(id) {
  return !!(DRILLS[id] && DRILLS[id].flags && DRILLS[id].flags.stretchSkill);
}

export function todayStr(date) {
  const d = date instanceof Date ? date : new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0'),
  ].join('-');
}
