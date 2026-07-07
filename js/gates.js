// ============================================================
// js/gates.js — gate checklists + promotion logic.
//
// A phase is promotable when every NON-optional gate item for the
// current phase is checked. Promotion is never automatic: the UI
// shows a suggestion card, the user confirms, and only then is the
// transition map applied. One snapshot is kept for undo.
// ============================================================

import { PHASE_BY_ID, PHASES } from '../data/plan.js';

// ------------------------------------------------------------
// Gate helpers
// ------------------------------------------------------------
export function gateItems(phaseId) {
  const p = PHASE_BY_ID[phaseId];
  return p && p.gate ? p.gate.items : [];
}

export function isChecked(state, phaseId, itemId) {
  return !!(state.gates && state.gates[phaseId] && state.gates[phaseId][itemId]);
}

export function setGate(state, phaseId, itemId, value) {
  if (!state.gates) state.gates = {};
  if (!state.gates[phaseId]) state.gates[phaseId] = {};
  state.gates[phaseId][itemId] = !!value;
}

// All required (non-optional) items checked?
export function isGateComplete(state, phaseId) {
  const items = gateItems(phaseId).filter((it) => !it.optional);
  if (items.length === 0) return false;
  return items.every((it) => isChecked(state, phaseId, itemId(it)));
}

function itemId(it) {
  return typeof it === 'string' ? it : it.id;
}

// ------------------------------------------------------------
// Transition maps — what each promotion does to drillStates.
// Each returns { drillStates, drillNotes } patches; `summary` is a
// one-paragraph description of what changes.
// ------------------------------------------------------------
const TRANSITIONS = {
  p1: {
    to: 'p2a',
    summary:
      'You’re moving to Phase 2a. Your straight-line dribbling and cone weave become the main work. Foundations drops to a warm-up — keep it in for about one more week. Wall passing unlocks early as learning work, since it’s stationary and pairs naturally with 2a.',
    apply(ds, dn) {
      ds.foundations = 'warmup';
      dn.foundations = 'Hold as a warm-up for about one more week.';
      ds.dribbleLaces = 'main';
      ds.coneWeave = 'main';
      ds.pushPass = 'learning';
      ds.wallClose = 'learning';
      ds.firstTouch = 'learning';
      ds.wallStepped = 'learning';
    },
  },
  p2a: {
    to: 'p2b',
    summary:
      'On to Phase 2b. Your first turns unlock: the pull-back turn and red light / green light (built from about half pace, then faster once clean). Straight-line dribbling and the cone weave stay in as your main work.',
    apply(ds) {
      ds.pullBack = 'learning';
      ds.redLight = 'learning';
      ds.dribbleLaces = 'main';
      ds.coneWeave = 'main';
    },
  },
  p2b: {
    to: 'p3',
    summary:
      'Phase 3 is passing. Wall passing and first touch become the main work. Your dribbling and turns drop to maintenance so they stay sharp without taking over the session. Weak foot gets its own set every day.',
    apply(ds, dn) {
      ds.pushPass = 'main';
      ds.wallClose = 'main';
      ds.firstTouch = 'main';
      ds.wallStepped = 'main';
      ds.dribbleLaces = 'maintenance';
      ds.coneWeave = 'maintenance';
      ds.pullBack = 'maintenance';
      ds.redLight = 'maintenance';
      delete dn.foundations;
    },
  },
  p3: {
    to: 'p4',
    summary:
      'Phase 4 makes small-sided games the main event. Solo work shrinks to about 15 minutes of maintenance, weighted toward weak foot and first touch. Add one simple feint once your close control is reliable.',
    apply(ds) {
      ds.smallSided = 'main';
      ds.feint = 'learning';
      ds.soloUpkeep = 'maintenance';
      ds.pushPass = 'maintenance';
      ds.wallClose = 'maintenance';
      ds.firstTouch = 'maintenance';
      ds.wallStepped = 'maintenance';
    },
  },
};

// ------------------------------------------------------------
// Is a promotion available right now?
// Returns { from, to, summary } or null.
// ------------------------------------------------------------
export function pendingPromotion(state) {
  const from = state.phase;
  const t = TRANSITIONS[from];
  if (!t) return null; // final phase, no promotion
  if (!isGateComplete(state, from)) return null;
  return { from, to: t.to, summary: t.summary };
}

// ------------------------------------------------------------
// Promote — mutates state in place. Snapshots for undo first.
// ------------------------------------------------------------
export function promote(state) {
  const t = TRANSITIONS[state.phase];
  if (!t) return false;

  // one-deep snapshot
  state.undoSnapshot = {
    phase: state.phase,
    drillStates: { ...state.drillStates },
    drillNotes: { ...(state.drillNotes || {}) },
  };

  const ds = { ...state.drillStates };
  const dn = { ...(state.drillNotes || {}) };
  t.apply(ds, dn);
  state.drillStates = ds;
  state.drillNotes = dn;
  state.phase = t.to;
  return true;
}

export function canUndo(state) {
  return !!state.undoSnapshot;
}

export function undoPromotion(state) {
  const snap = state.undoSnapshot;
  if (!snap) return false;
  state.phase = snap.phase;
  state.drillStates = { ...snap.drillStates };
  state.drillNotes = { ...snap.drillNotes };
  state.undoSnapshot = null;
  return true;
}

// Ordered phase ids for progress display
export const PHASE_IDS = PHASES.map((p) => p.id);
