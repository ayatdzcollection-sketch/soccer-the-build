// ============================================================
// js/render/settings.js — Settings (design: 1j).
// Hip status + data (export / import / two-step reset). The Speed
// module toggle from the mock is omitted (Speed is not built).
// ============================================================

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

  <div class="card" style="gap:9px;display:flex;flex-direction:column">
    <div class="label">Data</div>
    <p class="set-hint">Saved on this device only — no account, no cloud. Export a backup you can re-import on another browser or after clearing data.</p>
    <div class="data-btns">
      <button class="btn btn-outline-ink" data-action="data.export">EXPORT JSON</button>
      <button class="btn btn-outline-ink" data-action="data.import">IMPORT</button>
    </div>
    ${dataBody}
    ${msg}
    <input type="file" id="import-file" accept="application/json,.json">
  </div>

  <p class="set-version">The Build · local build · schema v1</p>
</section>`;
}
