/**
 * pipeline.js
 * Running overlay — animated agent pipeline visualization.
 * Shows each agent's status as it runs, in sequence.
 */
window.PipelineUI = {

  init(agents) {
    const el = document.getElementById('pipeline-viz');
    el.innerHTML = agents.map(a => `
      <div class="pipeline-agent" id="pa-${a.id}">
        <div class="pa-icon"><i class="ti ${a.icon}" style="color:${a.color}"></i></div>
        <div class="pa-info">
          <div class="pa-name" id="pa-name-${a.id}">${a.name}</div>
          <div class="pa-status" id="pa-status-${a.id}">${a.mission}</div>
        </div>
        <div class="pa-indicator" id="pa-ind-${a.id}"></div>
      </div>
    `).join('');
  },

  setRunning(id, message) {
    const card = document.getElementById(`pa-${id}`);
    const status = document.getElementById(`pa-status-${id}`);
    const ind    = document.getElementById(`pa-ind-${id}`);
    if (!card) return;

    card.className = 'pipeline-agent running';
    if (status) status.textContent = message;
    if (ind) ind.innerHTML = '<div class="pa-spinner"></div>';

    // Scroll into view
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  },

  setDone(id, message) {
    const card = document.getElementById(`pa-${id}`);
    const status = document.getElementById(`pa-status-${id}`);
    const ind    = document.getElementById(`pa-ind-${id}`);
    if (!card) return;

    card.className = 'pipeline-agent done';
    if (status) status.textContent = message;
    if (ind) ind.innerHTML = '<i class="ti ti-check" style="font-size:14px;color:var(--green)"></i>';
  },

  setError(id, message) {
    const card = document.getElementById(`pa-${id}`);
    const status = document.getElementById(`pa-status-${id}`);
    const ind    = document.getElementById(`pa-ind-${id}`);
    if (!card) return;

    card.className = 'pipeline-agent error';
    if (status) status.textContent = message;
    if (ind) ind.innerHTML = '<i class="ti ti-x" style="font-size:14px;color:var(--red)"></i>';
  },
};
