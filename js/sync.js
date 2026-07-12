// ============================================================
// js/sync.js — opt-in cloud sync, offline-first.
//
// Pattern proven in exam-study-app: devices share one high-entropy
// 16-char CODE and read/write a single row through SECURITY DEFINER
// RPCs (sync_get / sync_put / sync_rev) on Supabase, so the public
// key can never enumerate rows — you must already know the code.
//
// localStorage stays the source of truth; the cloud is a mirror:
//   boot/online/visible → pull → MERGE remote into local → push
//   local change        → debounced push (pull-merge-push)
//   other device        → woken by a Realtime broadcast, plus a
//                         cheap rev poll as the always-on fallback
//
// MERGE, not clobber: sessions & reviews union by id, gate ticks
// OR together, scalars (phase/drillStates/settings…) take the side
// with the newer updatedAt. Offline or backend-paused → status
// turns "offline"/"error" and the app works exactly as before.
// ============================================================

import * as State from './state.js';

// Supabase project (shared with the Recall study app — same owner;
// rows are namespaced by code, payloads carry an app marker).
const HOST = 'https://gyfqhkhgosjpyvatffbi.supabase.co';
const KEY = 'sb_publishable_q-_2MgYpTJB-OeGGIy8EzA_8mvRB1nb'; // publishable (client-safe)
const RPC = HOST + '/rest/v1/rpc/';
const HEADERS = { 'Content-Type': 'application/json', apikey: KEY, Authorization: 'Bearer ' + KEY };
const APP_MARKER = 'thebuild';

const META_KEY = 'thebuild.sync.v1'; // {code, rev, last} — separate from app state
const PUSH_DEBOUNCE = 800, POLL_FAST = 5000, POLL_IDLE = 30000, ACTIVE_WINDOW = 120000;

let host = null; // { getState, applyState, onStatus } provided by app.js
let status = 'off'; // off|idle|syncing|ok|offline|error|wrongapp
let inSync = false, pushTimer = null, pollTimer = null, lastActivity = 0;

// ------------------------------------------------------------
// Meta (code / rev / last-synced) in its own localStorage key so
// sync bookkeeping never dirties the synced state itself.
// ------------------------------------------------------------
function meta() {
  try { return JSON.parse(localStorage.getItem(META_KEY)) || {}; } catch { return {}; }
}
function writeMeta(patch) {
  const m = { ...meta(), ...patch };
  try { localStorage.setItem(META_KEY, JSON.stringify(m)); } catch { /* full/blocked: sync still works this session */ }
  return m;
}

export const STATUS_LABEL = {
  off: 'Off',
  idle: 'Waiting…',
  syncing: 'Syncing…',
  ok: 'Synced',
  offline: 'Offline — will sync when back',
  error: 'Can’t reach the sync server',
  wrongapp: 'That code belongs to a different app',
};

export function enabled() { return !!meta().code; }
export function code() { return meta().code || ''; }
export function lastSync() { return meta().last || 0; }
export function getStatus() { return enabled() ? status : 'off'; }

function setStatus(s) { status = s; if (host && host.onStatus) { try { host.onStatus(s); } catch { /* UI hook */ } } }
function online() { return typeof navigator === 'undefined' || navigator.onLine !== false; }
function visible() { return typeof document === 'undefined' || document.visibilityState === 'visible'; }
function markActivity() { lastActivity = Date.now(); }

// ------------------------------------------------------------
// Code: 16 base32 chars (~80 bits) — doubles as the row's secret.
// ------------------------------------------------------------
function genCode() {
  const alpha = '0123456789abcdefghjkmnpqrstvwxyz';
  const buf = new Uint8Array(16);
  crypto.getRandomValues(buf);
  let out = '';
  for (let i = 0; i < 16; i++) out += alpha[buf[i] & 31];
  return out;
}
export function formatCode(c) {
  c = (c || '').replace(/[^0-9a-z]/gi, '').toLowerCase();
  return c.replace(/(.{4})(?=.)/g, '$1-');
}
export function cleanCode(c) {
  c = String(c || '').trim();
  const m = c.match(/#\/?link\/([0-9a-z-]+)/i);
  if (m) c = m[1];
  return c.replace(/[^0-9a-z]/gi, '').toLowerCase();
}

// ------------------------------------------------------------
// Transport
// ------------------------------------------------------------
function rpc(fn, body) {
  return fetch(RPC + fn, { method: 'POST', headers: HEADERS, body: JSON.stringify(body) })
    .then((r) => { if (!r.ok) throw new Error('rpc ' + fn + ' ' + r.status); return r.json(); });
}
function firstRow(rows) { return Array.isArray(rows) ? rows[0] : rows; }

function blobOf(state) { return JSON.stringify({ app: APP_MARKER, v: State.SCHEMA_VERSION, state }); }
function parseBlob(text) {
  try {
    const p = JSON.parse(text);
    if (!p || typeof p !== 'object') return { bad: true };
    if (p.app !== APP_MARKER) return { wrongApp: true };
    return { state: State.normalize(State.migrate(p.state || {})) };
  } catch { return { bad: true }; }
}

// ------------------------------------------------------------
// Merge — phone + laptop combine instead of clobbering.
// ------------------------------------------------------------
function unionById(a, b, fallbackKey) {
  const seen = new Map();
  const keyOf = (x, i, side) => x.id || fallbackKey(x, i, side);
  a.forEach((x, i) => seen.set(keyOf(x, i, 'a'), x));
  b.forEach((x, i) => { const k = keyOf(x, i, 'b'); if (!seen.has(k)) seen.set(k, x); });
  return [...seen.values()].sort((x, y) => (x.date + (x.time || '')).localeCompare(y.date + (y.time || '')));
}

export function merge(local, remote) {
  const lt = local.updatedAt || '';
  const rt = remote.updatedAt || '';
  const newer = rt > lt ? remote : local; // scalars follow the most recent editor

  const out = { ...newer };

  // Append-only collections: union so nothing logged offline is lost.
  out.sessions = unionById(local.sessions, remote.sessions, (x, i, s) => `${x.date}#${x.time || ''}#${s}${i}`);
  out.weeklyReviews = unionById(local.weeklyReviews, remote.weeklyReviews, (x, i, s) => `${x.date}#${s}${i}`);

  // Gate ticks OR together (checked anywhere = checked).
  const gates = {};
  for (const src of [local.gates, remote.gates]) {
    for (const ph of Object.keys(src || {})) {
      gates[ph] = gates[ph] || {};
      for (const it of Object.keys(src[ph] || {})) gates[ph][it] = gates[ph][it] || !!src[ph][it];
    }
  }
  out.gates = gates;

  out.rotationIndex = Math.max(local.rotationIndex || 0, remote.rotationIndex || 0);
  out.updatedAt = rt > lt ? rt : lt;
  return out;
}

// ------------------------------------------------------------
// The sync cycle: pull → merge → apply → push (rev-guarded).
// ------------------------------------------------------------
function doSync(c, attempt) {
  return rpc('sync_get', { p_code: c }).then((rows) => {
    const row = firstRow(rows);
    let knownRev = 0;
    let local = host.getState();

    if (row && row.data) {
      knownRev = row.rev || 0;
      const parsed = parseBlob(row.data);
      if (parsed.wrongApp) { setStatus('wrongapp'); return false; } // never touch another app's row
      if (parsed.state) {
        const merged = merge(local, parsed.state);
        host.applyState(merged);
        local = merged;
        if (blobOf(local) === row.data) { // server already has exactly this
          writeMeta({ rev: knownRev, last: Date.now() });
          setStatus('ok');
          return true;
        }
      }
    }

    return rpc('sync_put', { p_code: c, p_data: blobOf(local), p_rev: knownRev }).then((rows2) => {
      const r2 = firstRow(rows2);
      if (r2 && r2.conflict && attempt < 4) return doSync(c, attempt + 1); // raced another device: re-merge
      const newRev = (r2 && r2.rev) || knownRev + 1;
      writeMeta({ rev: newRev, last: Date.now() });
      setStatus('ok');
      rtBroadcast(newRev);
      return true;
    });
  });
}

export function syncNow() {
  const c = code();
  if (!c || !host) return Promise.resolve(false);
  if (!online()) { setStatus('offline'); return Promise.resolve(false); }
  if (inSync) return Promise.resolve(false);
  inSync = true;
  setStatus('syncing');
  return doSync(c, 0)
    .then((ok) => { inSync = false; if (getStatus() === 'syncing') setStatus(ok ? 'ok' : 'error'); return ok; })
    .catch(() => { inSync = false; setStatus(online() ? 'error' : 'offline'); return false; });
}

// Called by the store after every local save — debounced push.
export function onLocalChange() {
  if (!enabled() || inSync || !online()) return;
  markActivity();
  if (pushTimer) clearTimeout(pushTimer);
  pushTimer = setTimeout(() => { pushTimer = null; syncNow(); }, PUSH_DEBOUNCE);
  if (!pollTimer) scheduleNextPoll();
}

// ------------------------------------------------------------
// Cheap fallback poll: only the rev; full sync when it moves.
// ------------------------------------------------------------
function pollTick() {
  pollTimer = null;
  if (!enabled()) return;
  if (online() && visible()) {
    rpc('sync_rev', { p_code: code() })
      .then((rows) => {
        const row = firstRow(rows);
        const rev = +((row && (row.rev != null ? row.rev : row.sync_rev)) ?? row) || 0;
        if (rev !== (meta().rev || 0)) { markActivity(); syncNow(); }
      })
      .catch(() => { /* backend unreachable: poll again later */ })
      .then(scheduleNextPoll);
  } else scheduleNextPoll();
}
function scheduleNextPoll() {
  if (pollTimer) clearTimeout(pollTimer);
  if (!enabled()) return;
  const iv = Date.now() - lastActivity < ACTIVE_WINDOW ? POLL_FAST : POLL_IDLE;
  pollTimer = setTimeout(pollTick, iv);
}

// ------------------------------------------------------------
// Best-effort realtime (Phoenix broadcast) — instant cross-device
// wake on push; the poll covers it whenever this can't connect.
// ------------------------------------------------------------
let ws = null, wsRef = 0, hbTimer = null, reconnectTimer = null, joined = false;
function wsUrl() { return HOST.replace(/^http/, 'ws') + '/realtime/v1/websocket?apikey=' + encodeURIComponent(KEY) + '&vsn=1.0.0'; }
function chan() { return 'realtime:thebuild-' + code(); }
function wsSend(o) { try { if (ws && ws.readyState === 1) ws.send(JSON.stringify(o)); } catch { /* socket gone */ } }
function rtConnect() {
  if (typeof WebSocket === 'undefined' || !enabled() || !online()) return;
  if (ws && (ws.readyState === 0 || ws.readyState === 1)) return;
  try { ws = new WebSocket(wsUrl()); } catch { ws = null; return; }
  joined = false;
  ws.onopen = () => {
    wsSend({ topic: chan(), event: 'phx_join', payload: { config: { broadcast: { self: false, ack: false }, presence: { key: '' } } }, ref: String(++wsRef) });
    if (hbTimer) clearInterval(hbTimer);
    hbTimer = setInterval(() => wsSend({ topic: 'phoenix', event: 'heartbeat', payload: {}, ref: String(++wsRef) }), 25000);
  };
  ws.onmessage = (ev) => {
    let m; try { m = JSON.parse(ev.data); } catch { return; }
    if (m.event === 'phx_reply' && m.payload && m.payload.status === 'ok') { joined = true; return; }
    if (m.event === 'broadcast' && m.payload && m.payload.event === 'sync') { markActivity(); syncNow(); }
  };
  ws.onclose = () => { joined = false; if (hbTimer) { clearInterval(hbTimer); hbTimer = null; } scheduleReconnect(); };
  ws.onerror = () => { try { ws.close(); } catch { /* already closed */ } };
}
function scheduleReconnect() {
  if (reconnectTimer) clearTimeout(reconnectTimer);
  if (!enabled()) return;
  reconnectTimer = setTimeout(rtConnect, 5000);
}
function rtBroadcast(rev) {
  if (joined) wsSend({ topic: chan(), event: 'broadcast', payload: { type: 'broadcast', event: 'sync', payload: { r: rev } }, ref: String(++wsRef) });
}
function rtDisconnect() {
  if (hbTimer) { clearInterval(hbTimer); hbTimer = null; }
  if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
  try { if (ws) { ws.onclose = null; ws.close(); } } catch { /* already closed */ }
  ws = null; joined = false;
}

function start() { markActivity(); scheduleNextPoll(); rtConnect(); }

// ------------------------------------------------------------
// Lifecycle
// ------------------------------------------------------------
export function enable() { // first device: mint a new identity
  if (enabled()) return code();
  writeMeta({ code: genCode(), rev: 0, last: 0 });
  setStatus('idle');
  start();
  syncNow();
  return code();
}
export function linkWith(input) { // another device: join an existing code
  const c = cleanCode(input);
  if (!c || c.length < 12) return false;
  rtDisconnect();
  writeMeta({ code: c, rev: 0, last: 0 });
  setStatus('idle');
  start();
  syncNow();
  return true;
}
export function unlink() { // stop syncing; local data stays put
  rtDisconnect();
  if (pollTimer) { clearTimeout(pollTimer); pollTimer = null; }
  if (pushTimer) { clearTimeout(pushTimer); pushTimer = null; }
  try { localStorage.removeItem(META_KEY); } catch { /* nothing to remove */ }
  setStatus('off');
}

export function init(hostApi) {
  host = hostApi;
  window.addEventListener('online', () => { rtConnect(); markActivity(); syncNow(); });
  document.addEventListener('visibilitychange', () => { if (visible()) { markActivity(); rtConnect(); syncNow(); } });
  if (enabled()) { setStatus('idle'); start(); syncNow(); }
}
