// ============================================================
// js/app.js — routing between views + init + event wiring.
// Bottom nav (mobile) / top nav (desktop). All events handled by
// delegation. Expanded drill cards survive re-renders via
// ui.openDrills (captured from `toggle` events).
// ============================================================

import * as State from './state.js';
import { todayStr } from './state.js';
import { renderToday } from './render/today.js';
import { renderPlan } from './render/plan.js';
import { renderProgress } from './render/progress.js';
import { renderTransfer } from './render/transfer.js';
import { renderSettings } from './render/settings.js';
import { drillPopup, notePopup, safetyPopup } from './render/parts.js';
import { setGate, promote, undoPromotion } from './gates.js';

const VIEWS = [
  { id: 'today', label: 'TODAY' },
  { id: 'plan', label: 'PLAN' },
  { id: 'progress', label: 'PROGRESS' },
  { id: 'transfer', label: 'TRANSFER' },
  { id: 'settings', label: 'SETTINGS' },
];
const RENDERERS = { today: renderToday, plan: renderPlan, progress: renderProgress, transfer: renderTransfer, settings: renderSettings };

const store = {
  state: State.load(),
  ui: {
    view: 'today',
    openDrills: new Set(),
    promoHidden: false,
    toast: '',
    today: { minutes: 30, conditions: 'dry', checked: new Set(), pain: 0, energy: 2, session: null },
    plan: { section: 'phases' },
    settings: { msg: '', msgTone: '', confirmReset: false },
    modal: { open: false, drill: null, info: null },
  },
  save() { State.save(this.state); },
  go(view) {
    this.ui.view = view;
    this.ui.settings.msg = '';
    closeModal();
    renderActive();
    scrollTop();
  },
};

let navEl, panelEl, toastEl, modalEl;

// ------------------------------------------------------------
// Rendering
// ------------------------------------------------------------
function renderNav() {
  const items = VIEWS.map((v) => {
    const on = store.ui.view === v.id;
    return `
<button class="nav-item${on ? ' active' : ''}" data-view="${v.id}" role="tab" id="tab-${v.id}" aria-selected="${on}">
  <span class="nav-dot"></span><span class="nav-label">${v.label}</span>
</button>`;
  }).join('');
  navEl.innerHTML = `<div class="nav-inner"><span class="nav-brand">The Build</span><div class="nav-items">${items}</div></div>`;
}

function renderActive() {
  renderNav();
  const fn = RENDERERS[store.ui.view] || renderToday;
  panelEl.innerHTML = fn(store);
  renderToast();
}

function renderToast() {
  if (!store.ui.toast) { toastEl.hidden = true; toastEl.textContent = ''; return; }
  toastEl.hidden = false;
  toastEl.textContent = store.ui.toast;
}
function flashToast(msg) {
  store.ui.toast = msg;
  renderToast();
  clearTimeout(flashToast._t);
  flashToast._t = setTimeout(() => { store.ui.toast = ''; renderToast(); }, 2600);
}
function scrollTop() { window.scrollTo({ top: 0, behavior: 'auto' }); }

// ------------------------------------------------------------
// Info modal (how-to popup) — independent of panel re-renders.
// ------------------------------------------------------------
function renderModal() {
  const m = store.ui.modal;
  if (!m.open) { modalEl.hidden = true; modalEl.innerHTML = ''; return; }
  let content = '';
  if (m.drill) content = drillPopup(m.drill);
  else if (m.info === 'safety') content = safetyPopup(store.ui.today.conditions);
  else if (m.info) content = notePopup(m.info);
  modalEl.hidden = false;
  modalEl.innerHTML = `
<div class="modal-backdrop" id="modal-backdrop">
  <div class="modal-card" role="dialog" aria-modal="true" tabindex="-1">
    <button class="modal-close" data-action="info.close" aria-label="Close">✕</button>
    ${content}
  </div>
</div>`;
  const card = modalEl.querySelector('.modal-card');
  if (card) card.focus();
}
function openModal({ drill = null, info = null }) {
  store.ui.modal = { open: true, drill, info };
  renderModal();
}
function closeModal() {
  if (!store.ui.modal.open) return;
  store.ui.modal = { open: false, drill: null, info: null };
  renderModal();
}

// ------------------------------------------------------------
// Actions
// ------------------------------------------------------------
function dispatch(action, ds, e) {
  const { state, ui } = store;
  switch (action) {
    // ----- Today -----
    case 'today.minutes':
      ui.today.minutes = Number(ds.value);
      state.settings.defaultMinutes = Number(ds.value);
      ui.today.checked.clear();
      store.save();
      renderActive();
      break;
    case 'today.conditions':
      ui.today.conditions = ds.value;
      state.settings.conditions = ds.value;
      ui.today.checked.clear();
      store.save();
      renderActive();
      break;
    case 'today.block': {
      const cb = e.target;
      if (cb.checked) ui.today.checked.add(ds.block); else ui.today.checked.delete(ds.block);
      const block = cb.closest('.block');
      if (block) block.classList.toggle('done', cb.checked);
      break;
    }
    case 'today.pain':
      ui.today.pain = Number(ds.value);
      renderActive();
      break;
    case 'today.energy':
      ui.today.energy = Number(ds.value);
      renderActive();
      break;
    case 'today.save':
      saveSession();
      break;

    // ----- Info modal -----
    case 'info.open':
      openModal({ drill: ds.drill || null, info: ds.info || null });
      break;
    case 'info.close':
      closeModal();
      break;

    // ----- Plan -----
    case 'plan.section':
      ui.plan.section = ds.value;
      renderActive();
      scrollTop();
      break;

    // ----- Gates & promotion -----
    case 'gate.toggle': {
      setGate(state, ds.phase, ds.item, e.target.checked);
      ui.promoHidden = false;
      store.save();
      renderActive();
      break;
    }
    case 'promo.confirm':
      if (promote(state)) {
        store.save();
        ui.promoHidden = false;
        flashToast('Promoted. Undo from the Plan.');
        renderActive();
      }
      break;
    case 'promo.dismiss':
      ui.promoHidden = true;
      renderActive();
      break;
    case 'promo.undo':
      if (undoPromotion(state)) {
        store.save();
        flashToast('Promotion undone.');
        renderActive();
      }
      break;

    // ----- Settings -----
    case 'set.hip':
      state.hipStatus = ds.value === 'flared' ? 'flared' : 'quiet';
      store.save();
      renderActive();
      break;
    case 'data.export':
      State.exportState(state);
      ui.settings.msg = 'Backup downloaded ✓';
      ui.settings.msgTone = 'ok';
      renderActive();
      break;
    case 'data.import': {
      const input = document.getElementById('import-file');
      if (input) input.click();
      break;
    }
    case 'data.reset':
      ui.settings.confirmReset = true;
      renderActive();
      break;
    case 'data.resetCancel':
      ui.settings.confirmReset = false;
      renderActive();
      break;
    case 'data.resetConfirm':
      State.clearStorage();
      store.state = State.defaultState();
      resetUiToState();
      store.save();
      ui.settings.msg = 'All data reset.';
      ui.settings.msgTone = 'ok';
      store.go('today');
      break;

    // ----- Weekly review -----
    case 'review.save':
      saveReview();
      break;

    default:
      break;
  }
}

function saveSession() {
  const { state, ui } = store;
  const session = ui.today.session;
  if (!session) return;
  let time = '';
  try { time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }); } catch { time = ''; }
  state.sessions.push({
    date: todayStr(),
    time,
    minutes: session.minutes,
    blocksDone: [...ui.today.checked],
    pain: ui.today.pain,
    energy: ui.today.energy,
  });
  state.rotationIndex = (state.rotationIndex || 0) + 1;
  store.save();
  ui.today.checked = new Set();
  ui.today.pain = 0;
  ui.today.energy = 2;
  flashToast('Session logged ✓');
  renderActive();
}

function saveReview() {
  const { state, ui } = store;
  const num = (id) => { const v = document.getElementById(id); return v && v.value !== '' ? Number(v.value) : null; };
  const txt = (id) => { const v = document.getElementById(id); return v ? v.value.trim() : ''; };
  state.weeklyReviews.push({
    date: todayStr(),
    bestFoundationsSec: num('rf-foundations'),
    jugglingPB: num('rf-juggling'),
    note: txt('rf-note'),
    filmTarget: txt('rf-film'),
  });
  store.save();
  flashToast('Weekly review saved ✓');
  renderActive();
}

function handleImportFile(file) {
  State.importFromFile(file)
    .then((imported) => {
      const ok = window.confirm('Import this backup? It will replace all data currently on this device.');
      if (!ok) return;
      store.state = imported;
      resetUiToState();
      store.save();
      store.ui.settings.msg = 'Backup imported ✓';
      store.ui.settings.msgTone = 'ok';
      store.go('today');
      flashToast('Backup imported ✓');
    })
    .catch((err) => {
      store.ui.settings.msg = 'Import failed: ' + (err && err.message ? err.message : 'invalid file');
      store.ui.settings.msgTone = 'err';
      renderActive();
    });
}

function resetUiToState() {
  const s = store.state;
  store.ui.openDrills = new Set();
  store.ui.promoHidden = false;
  store.ui.today = {
    minutes: s.settings.defaultMinutes,
    conditions: s.settings.conditions,
    checked: new Set(), pain: 0, energy: 2, session: null,
  };
  store.ui.plan = { section: 'phases' };
  store.ui.settings = { msg: '', msgTone: '', confirmReset: false };
}

// ------------------------------------------------------------
// Init & global listeners
// ------------------------------------------------------------
function init() {
  navEl = document.getElementById('nav');
  panelEl = document.getElementById('panel');
  toastEl = document.getElementById('toast');
  modalEl = document.getElementById('modal');

  resetUiToState();
  renderActive();

  document.addEventListener('click', (e) => {
    if (e.target.id === 'modal-backdrop') { closeModal(); return; }
    const viewBtn = e.target.closest('[data-view]');
    if (viewBtn) { store.go(viewBtn.dataset.view); return; }
    const actor = e.target.closest('[data-action]');
    if (!actor) return;
    if (actor.tagName === 'INPUT' && actor.type === 'checkbox') return; // change handles it
    e.preventDefault();
    dispatch(actor.dataset.action, actor.dataset, e);
  });

  document.addEventListener('change', (e) => {
    const t = e.target;
    if (t.id === 'import-file') {
      if (t.files && t.files[0]) handleImportFile(t.files[0]);
      t.value = '';
      return;
    }
    const actor = t.closest('[data-action]');
    if (!actor) return;
    dispatch(actor.dataset.action, actor.dataset, e);
  });

  // Preserve <details> open state across re-renders.
  document.addEventListener('toggle', (e) => {
    const el = e.target;
    if (el && el.matches && el.matches('[data-drill]')) {
      if (el.open) store.ui.openDrills.add(el.dataset.drill);
      else store.ui.openDrills.delete(el.dataset.drill);
    }
  }, true);

  // Esc closes the info modal.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && store.ui.modal.open) { closeModal(); }
  });

  // Nav keyboard nav (roving arrows).
  navEl.addEventListener('keydown', (e) => {
    const tabs = [...navEl.querySelectorAll('.nav-item')];
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    if (e.key === 'ArrowRight') { tabs[(i + 1) % tabs.length].focus(); e.preventDefault(); }
    if (e.key === 'ArrowLeft') { tabs[(i - 1 + tabs.length) % tabs.length].focus(); e.preventDefault(); }
  });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
