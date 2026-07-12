// ============================================================
// js/render/settings.js — Settings (design: 1j).
// Hip status + cloud sync + data (export / import / two-step
// reset). The Speed module toggle from the mock is omitted.
// ============================================================

import * as SYNC from '../sync.js';

const HIP_OPTS = [
  { id: 'quiet', title: 'Quiet', desc: 'Skill work as planned.' },
  { id: 'flared', title: 'Flared', desc: 'Turns stay at walking pace; red light / green light drops for the day.' },
];

function radio(state) {
  return HIP_OPTS.map((o) => {
    const on = state.hipStatus === o.id;
    return `
<button class="radio-opt" data-action="set.hip" data-value="${o.id}" aria-pressed="${on}">
  <span class="radio-mark"></span>
  <span><span class="r-title">${o.title}</span><span class="r-desc">${o.desc}</span></span>
</button>`;
  }).join('');
}

function syncCard() {
  const status = SYNC.getStatus();
  const label = SYNC.STATUS_LABEL[status] || status;

  if (!SYNC.enabled()) {
    return `
<div class="card" style="gap:9px;display:flex;flex-direction:column">
  <div class="label">Cloud sync</div>
  <p class="set-hint">Keep phone and laptop on the same log. No account — devices share a private 16-character code. Everything still works offline; changes catch up when you’re back online.</p>
  <button class="btn btn-ink full" data-action="sync.enable">TURN ON SYNC</button>
  <p class="set-hint" style="margin-top:2px">Already synced on another device?</p>
  <div class="data-btns">
    <input type="text" id="sync-code-input" class="sync-input" placeholder="xxxx-xxxx-xxxx-xxxx" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Sync code from your other device">
    <button class="btn btn-outline-ink" data-action="sync.link">LINK</button>
  </div>
</div>`;
  }

  const last = SYNC.lastSync()
    ? 'Last synced ' + new Date(SYNC.lastSync()).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    : 'Not synced yet';
  return `
<div class="card" style="gap:9px;display:flex;flex-direction:column">
  <div class="label">Cloud sync</div>
  <div class="sync-row">
    <span class="sync-pill" data-sync-status data-state="${status}">${label}</span>
    <span class="set-hint" data-sync-last>${last}</span>
  </div>
  <p class="set-hint">Enter this code on your other device to share one log:</p>
  <div class="sync-code-row">
    <code class="sync-code">${SYNC.formatCode(SYNC.code())}</code>
    <button class="btn btn-outline-ink" data-action="sync.copy">COPY</button>
  </div>
  <div class="data-btns">
    <button class="btn btn-outline-ink" data-action="sync.now">SYNC NOW</button>
    <button class="btn btn-quiet" data-action="sync.unlink">TURN OFF</button>
  </div>
  <p class="set-hint">Turning it off keeps everything on this device — it just stops mirroring.</p>
</div>`;
}

export function renderSettings(store) {
  const { state, ui } = store;
  const msg = ui.settings.msg ? `<p class="set-msg ${ui.settings.msgTone || ''}">${ui.settings.msg}</p>` : '';

  const dataBody = ui.settings.confirmReset
    ? `<div class="confirm-box">
         <p>This erases check-ins, gate progress, and reviews. The plan itself is untouched. Export first?</p>
         <div class="confirm-actions">
           <button class="btn btn-quiet" data-action="data.resetCancel">CANCEL</button>
           <button class="btn btn-ink" data-action="data.resetConfirm">ERASE EVERYTHING</button>
         </div>
       </div>`
    : `<button class="btn btn-quiet full" data-action="data.reset">RESET ALL DATA</button>`;

  return `
<section class="view view-settings">
  <h1 class="screen-title">Settings</h1>

  <div class="card" style="gap:10px;display:flex;flex-direction:column">
    <div class="label">Hip status</div>
    ${radio(state)}
    <p class="set-hint">Skill drills are cleared by PT; this only softens turns on a flare. Sharp pain at check-in scales tomorrow’s session down on its own.</p>
  </div>

  ${syncCard()}

  <div class="card" style="gap:9px;display:flex;flex-direction:column">
    <div class="label">Data</div>
    <p class="set-hint">Saved on this device (plus the cloud mirror if sync is on). Export a backup file any time — it works with or without sync.</p>
    <div class="data-btns">
      <button class="btn btn-outline-ink" data-action="data.export">EXPORT JSON</button>
      <button class="btn btn-outline-ink" data-action="data.import">IMPORT</button>
    </div>
    ${dataBody}
    ${msg}
    <input type="file" id="import-file" accept="application/json,.json">
  </div>

  <p class="set-version">The Build · offline-first, cloud-synced · schema v2</p>
</section>`;
}
