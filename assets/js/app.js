/**
 * app.js — clean single-file version, no overrides, no legacy cruft
 */

window.App = {

  currentMode: 'demo',
  currentScenario: null,

  // ─── INIT ────────────────────────────────────────────────────────────────
  init() {
    window.ApiClient.init('claude');
    this.renderAgentPreview();
    this.populateScenarioDropdown();
    this.setMode('demo');

    // Restore saved keys
    const claudeKey = localStorage.getItem('blueprint_claude_key');
    const openaiKey = localStorage.getItem('blueprint_openai_key');
    if (claudeKey || openaiKey) {
      const input = document.getElementById('api-key-input');
      if (input) input.value = claudeKey || openaiKey;
    }

    // Wire buttons
    document.getElementById('btn-start-main')
      ?.addEventListener('click', () => window.App.startWizard());
    document.getElementById('btn-load-demo')
      ?.addEventListener('click', () => window.App.quickDemo());
    document.getElementById('btn-api-connect')
      ?.addEventListener('click', () => window.App.saveApiKey());
  },

  // ─── AGENT PREVIEW ───────────────────────────────────────────────────────
  renderAgentPreview() {
    const el = document.getElementById('agents-preview');
    if (!el || !window.AGENT_REGISTRY) return;
    el.innerHTML = window.AGENT_REGISTRY.map(a => `
      <div class="agent-dot-item"
           style="background:${a.color}15;border:0.5px solid ${a.color}40"
           title="${a.mission}">
        <i class="ti ${a.icon}" style="color:${a.color};font-size:13px"></i>
        <span style="color:${a.color}">${a.name.replace(' Agent','')}</span>
      </div>`).join('');
  },

  // ─── MODE ────────────────────────────────────────────────────────────────
  setMode(mode) {
    this.currentMode = mode;

    ['demo','claude','openai'].forEach(m => {
      document.getElementById('mode-' + m)?.classList.toggle('active', m === mode);
    });

    const keyGroup = document.getElementById('api-key-group');
    const status   = document.getElementById('settings-status');
    const input    = document.getElementById('api-key-input');

    if (mode === 'demo') {
      if (keyGroup) keyGroup.style.display = 'none';
      window.ApiClient.init('claude');
      this.setStatus('teal', 'ti-player-play',
        '<strong>Demo Mode active</strong> — No API key needed. Full pre-built blueprint in 8 seconds.');

    } else if (mode === 'claude') {
      if (keyGroup) keyGroup.style.display = '';
      window.ApiClient.init('claude');
      if (input) input.placeholder = 'sk-ant-...';
      const saved = localStorage.getItem('blueprint_claude_key');
      if (saved) { if (input) input.value = saved; this.setStatus('teal','ti-sparkles','<strong>Claude API connected</strong> — Ready to generate live blueprints.'); }
      else this.setStatus('gold', 'ti-key', '<strong>Claude API Mode</strong> — Enter your Anthropic key (sk-ant-...) then click Connect.');

    } else {
      if (keyGroup) keyGroup.style.display = '';
      window.ApiClient.init('openai');
      if (input) input.placeholder = 'sk-...';
      const saved = localStorage.getItem('blueprint_openai_key');
      if (saved) { if (input) input.value = saved; this.setStatus('indigo','ti-brand-openai','<strong>OpenAI connected</strong> — Ready to generate live blueprints.'); }
      else this.setStatus('indigo', 'ti-brand-openai', '<strong>OpenAI Mode</strong> — Enter your OpenAI key (sk-...) then click Connect.');
    }
  },

  setStatus(color, icon, text) {
    const el = document.getElementById('settings-status');
    if (!el) return;
    const colorMap = { teal:'var(--teal)', gold:'var(--gold)', indigo:'var(--indigo)' };
    const bgMap    = { teal:'rgba(13,148,136,0.08)', gold:'rgba(245,158,11,0.08)', indigo:'rgba(99,102,241,0.08)' };
    const bdrMap   = { teal:'rgba(13,148,136,0.2)',  gold:'rgba(245,158,11,0.2)',  indigo:'rgba(99,102,241,0.2)' };
    const c = colorMap[color] || colorMap.teal;
    el.style.background   = bgMap[color]  || bgMap.teal;
    el.style.borderColor  = bdrMap[color] || bdrMap.teal;
    el.innerHTML = `<i class="ti ${icon}" style="color:${c};font-size:14px;flex-shrink:0"></i>
                    <span style="color:${c}">${text}</span>`;
  },

  // ─── API KEY ─────────────────────────────────────────────────────────────
  saveApiKey() {
    const input = document.getElementById('api-key-input');
    const k = input?.value?.trim() || '';
    const p = window.ApiClient.provider;
    if (!p) { alert('Select a provider first.'); return; }
    if (!p.validateKey(k)) { alert(p.keyError); return; }
    const storageKey = this.currentMode === 'claude' ? 'blueprint_claude_key' : 'blueprint_openai_key';
    localStorage.setItem(storageKey, k);
    this.setStatus(
      this.currentMode === 'claude' ? 'teal' : 'indigo',
      this.currentMode === 'claude' ? 'ti-sparkles' : 'ti-brand-openai',
      `<strong>${p.name} connected · ${p.model}</strong> — Key stored locally.`
    );
  },

  getApiKey() {
    if (this.currentMode === 'demo') return 'demo-mode';
    const storageKey = this.currentMode === 'claude' ? 'blueprint_claude_key' : 'blueprint_openai_key';
    return localStorage.getItem(storageKey)
      || document.getElementById('api-key-input')?.value?.trim()
      || '';
  },

  // ─── SCENARIOS ───────────────────────────────────────────────────────────
  populateScenarioDropdown() {
    const sel = document.getElementById('scenario-select');
    if (!sel || !window.SCENARIOS) return;
    const byCategory = {};
    window.SCENARIOS.forEach(sc => {
      if (!byCategory[sc.category]) byCategory[sc.category] = [];
      byCategory[sc.category].push(sc);
    });
    let html = '<option value="">Select from 15 scenarios or fill wizard manually</option>';
    Object.entries(byCategory).forEach(([cat, list]) => {
      html += `<optgroup label="${cat}">`;
      list.forEach(sc => { html += `<option value="${sc.id}">${sc.title}</option>`; });
      html += '</optgroup>';
    });
    sel.innerHTML = html;
  },

  selectScenario(scenarioId) {
    if (!scenarioId) { this.currentScenario = null; return; }
    const sc = window.SCENARIOS?.find(s => s.id === scenarioId);
    if (!sc) return;
    this.currentScenario = sc;
    Object.assign(window.WizardState.answers, sc.answers);
  },

  // ─── WIZARD ──────────────────────────────────────────────────────────────
  startWizard(fromDemo = false) {
    if (!fromDemo) window.WizardState?.reset();
    document.getElementById('running-overlay')?.classList.remove('open');
    document.getElementById('results-page')?.classList.remove('open');
    const overlay = document.getElementById('wizard-overlay');
    if (!overlay) { console.error('wizard-overlay element not found'); return; }
    overlay.classList.add('open');
    window.WizardUI?.render();
  },

  // ─── QUICK DEMO ──────────────────────────────────────────────────────────
  quickDemo() {
    // Use selected scenario or default to first (Telco NOC)
    const selectedId = document.getElementById('scenario-select')?.value;
    const sc = (selectedId && window.SCENARIOS?.find(s => s.id === selectedId))
             || window.SCENARIOS?.[0];
    if (sc) {
      this.currentScenario = sc;
      Object.assign(window.WizardState.answers, sc.answers);
    }
    this.runPipeline();
  },

  // ─── PIPELINE ────────────────────────────────────────────────────────────
  async runPipeline() {
    if (this.currentMode === 'demo') {
      await this.runDemoPipeline();
    } else {
      await this.runLivePipeline();
    }
  },

  async runDemoPipeline() {
    document.getElementById('wizard-overlay')?.classList.remove('open');
    document.getElementById('running-overlay')?.classList.add('open');
    window.PipelineUI.init(window.AGENT_REGISTRY);

    const sc  = this.currentScenario;
    const src = sc ? sc.answers : window.WizardState.answers;
    const bp  = window.DEMO_BLUEPRINT;

    const msgs = {
      discovery:    `"${bp.prior.discovery.problemStatement.slice(0,55)}..."`,
      outcome:      `${bp.prior.outcome.outcomeHierarchy.length} outcomes defined · KPIs set`,
      capability:   `${bp.prior.capability.capabilityMap.length} capabilities mapped`,
      architecture: `${bp.prior.architecture.targetArchitectureLayers.length} layers · ${bp.prior.architecture.adrs.length} ADRs`,
      data:         `Data: ${bp.prior.data.dataReadinessAssessment.overall} · RAG pipeline designed`,
      governance:   `${bp.prior.governance.riskRegister.length} risks · ${bp.prior.governance.governanceControls.length} controls`,
      roadmap:      `${bp.prior.roadmap.roadmap.length} phases · critical path defined`,
      value:        `${bp.prior.value.recommendedDecision} · CFO narrative generated`,
    };

    for (const agent of window.AGENT_REGISTRY) {
      window.PipelineUI.setRunning(agent.id, 'Analyzing...');
      await new Promise(r => setTimeout(r, 500 + Math.random() * 400));
      window.PipelineUI.setDone(agent.id, msgs[agent.id] || 'Complete');
    }

    window.BlueprintData = {
      prior:     bp.prior,
      financials: window.FinancialModel.calculate(src),
      scores:    { ...bp.maturityScores, ...window.ScoringEngine.calculate(src) },
      warnings:  bp.warnings,
      answers:   src,
      isDemoMode: true,
      scenarioTitle: sc?.title || 'Telco Network AIOps Platform',
    };

    await new Promise(r => setTimeout(r, 400));
    document.getElementById('running-overlay')?.classList.remove('open');
    window.ResultsUI.render(window.BlueprintData);
  },

  async runLivePipeline() {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      alert(`Please connect your ${this.currentMode === 'claude' ? 'Anthropic' : 'OpenAI'} API key first.`);
      return;
    }
    document.getElementById('wizard-overlay')?.classList.remove('open');
    document.getElementById('running-overlay')?.classList.add('open');
    window.PipelineUI.init(window.AGENT_REGISTRY);

    const answers    = window.WizardState.answers;
    const financials = window.FinancialModel.calculate(answers);
    const scores     = window.ScoringEngine.calculate(answers);
    const warnings   = window.ScoringEngine.validate(answers);
    const prior      = {};

    try {
      for (const agent of window.AGENT_REGISTRY) {
        window.PipelineUI.setRunning(agent.id, 'Analyzing...');
        const result = agent.id === 'value'
          ? await agent.run(apiKey, answers, prior, financials)
          : await agent.run(apiKey, answers, prior);
        prior[agent.id] = result;
        window.PipelineUI.setDone(agent.id, this.doneMsg(agent.id, result));
      }
      window.BlueprintData = { prior, financials, scores, warnings, answers };
      await new Promise(r => setTimeout(r, 400));
      document.getElementById('running-overlay')?.classList.remove('open');
      window.ResultsUI.render(window.BlueprintData);
    } catch (err) {
      document.getElementById('running-overlay')?.classList.remove('open');
      alert(`Pipeline error: ${err.message}\n\nCheck your API key and try again.`);
    }
  },

  doneMsg(agentId, result) {
    const m = {
      discovery:    () => `"${result.problemStatement?.slice(0,50) || 'Problem framed'}"`,
      outcome:      () => `${(result.outcomeHierarchy||[]).length} outcomes defined`,
      capability:   () => `${(result.capabilityMap||[]).length} capabilities · ${result.recommendedPattern||''}`,
      architecture: () => `${(result.targetArchitectureLayers||[]).length} layers · ${(result.adrs||[]).length} ADRs`,
      data:         () => `${result.dataReadinessAssessment?.overall||'assessed'} · RAG designed`,
      governance:   () => `${(result.riskRegister||[]).length} risks · ${(result.governanceControls||[]).length} controls`,
      roadmap:      () => `${(result.roadmap||[]).length} phases · milestones defined`,
      value:        () => `${result.recommendedDecision||'Decision'} · CFO narrative generated`,
    };
    return (m[agentId] || (() => 'Complete'))();
  },

  // ─── EXPORT ──────────────────────────────────────────────────────────────
  downloadMarkdown() {
    if (!window.BlueprintData) { alert('No blueprint to export.'); return; }
    const { prior, financials: f, scores, answers: a } = window.BlueprintData;
    const arch = prior.architecture || {}, gov = prior.governance || {};
    const rm = prior.roadmap || {}, val = prior.value || {}, dis = prior.discovery || {};
    const cur = n => window.FinancialModel.currency(n);
    const pct = n => window.FinancialModel.percent(n);
    const mos = n => window.FinancialModel.months(n);
    let md = `# AI Architecture Blueprint\n**${a.industry} · ${a.businessFunction}**\nGenerated: ${new Date().toLocaleDateString()}\n\n`;
    md += `## Executive Summary\n${val.executiveSummary || dis.problemStatement || ''}\n\n`;
    md += `## Architecture Pattern\n${arch.architecturePattern || ''}\n\n`;
    md += `## ADRs\n${(arch.adrs||[]).map(r=>`### ${r.id}: ${r.title}\n**Decision:** ${r.decision}\n**Rationale:** ${r.rationale}\n`).join('\n')}\n`;
    md += `## Risk Register\n${(gov.riskRegister||[]).map(r=>`- **[${r.severity}] ${r.risk}** — ${r.mitigation}`).join('\n')}\n\n`;
    md += `## Value\n- ROI: ${pct(f.roi)}  - Payback: ${mos(f.payback)}  - NPV: ${cur(f.npv)}\n`;
    const blob = new Blob([md], {type:'text/markdown'});
    const a2 = document.createElement('a');
    a2.href = URL.createObjectURL(blob);
    a2.download = 'ai-architecture-blueprint.md';
    a2.click();
  },

  downloadJSON() {
    if (!window.BlueprintData) { alert('No blueprint to export.'); return; }
    const blob = new Blob([JSON.stringify(window.BlueprintData, null, 2)], {type:'application/json'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'ai-architecture-blueprint.json';
    a.click();
  },

  restartWizard() {
    document.getElementById('results-page')?.classList.remove('open');
    window.BlueprintData = null;
    this.startWizard();
  },
};

document.addEventListener('DOMContentLoaded', () => window.App.init());
