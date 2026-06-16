/**
 * results.js
 * Results page rendering — all 7 tabs.
 * Called by App after the pipeline completes.
 * Reads from window.BlueprintData which is set by app.js orchestrator.
 */
window.ResultsUI = {

  switchTab(el) {
    document.querySelectorAll('.res-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.res-panel').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    document.getElementById('tab-' + el.dataset.tab).classList.add('active');
  },

  // ── UTILITIES ─────────────────────────────────────────────────────────────
  cur(n)   { return window.FinancialModel.currency(n); },
  pct(n)   { return window.FinancialModel.percent(n); },
  mos(n)   { return window.FinancialModel.months(n); },
  barCol(n){ return n >= 70 ? 'sc-high' : n >= 50 ? 'sc-good' : n >= 30 ? 'sc-mid' : 'sc-low'; },
  sevPill(s){ const m = { Critical:'pill-red', High:'pill-orange', Medium:'pill-amber', Low:'pill-green' }; return m[s] || 'pill-indigo'; },
  tag(t)   { return `<span class="pill pill-indigo" style="font-size:10px">${t}</span>`; },

  // ── RENDER ALL TABS ───────────────────────────────────────────────────────
  render(data) {
    const { prior, financials: f, scores: sc, warnings, answers: a } = data;
    const arch = prior.architecture || {};
    const gov  = prior.governance   || {};
    const rm   = prior.roadmap      || {};
    const val  = prior.value        || {};
    const dis  = prior.discovery    || {};
    const cap  = prior.capability   || {};
    const dp   = prior.data         || {};
    const out  = prior.outcome      || {};

    this.renderOverview(sc, warnings, val, dis, arch, a, out);
    this.renderArchitecture(arch, cap);
    this.renderADRs(arch);
    this.renderRisk(gov);
    this.renderRoadmap(rm);
    this.renderValue(f, a);
    this.renderExecutive(val, f, a, arch, out);

    document.getElementById('results-page').classList.add('open');
  },

  // ── OVERVIEW TAB ──────────────────────────────────────────────────────────
  renderOverview(sc, warnings, val, dis, arch, a, out) {
    const interp = window.ScoringEngine.interpret(sc.overall || 0);
    document.getElementById('tab-overview').innerHTML = `
      <div class="exec-banner">
        <div class="exec-eyebrow">Blueprint Summary · ${a.industry} · ${a.businessFunction}</div>
        <div class="exec-text">${val.executiveSummary || dis.problemStatement || 'Blueprint generated.'}</div>
        <div class="exec-meta">
          <div class="exec-meta-item"><i class="ti ti-topology-star" style="color:var(--indigo)"></i><strong>Pattern:</strong> ${arch.architecturePattern || '—'}</div>
          <div class="exec-meta-item"><i class="ti ti-chart-radar" style="color:var(--teal)"></i><strong>Readiness:</strong> ${sc.overall || '—'}/100</div>
          <div class="exec-meta-item"><i class="ti ti-building" style="color:var(--muted)"></i>${a.companySize} · ${a.industry}</div>
        </div>
      </div>

      <div class="score-grid">
        ${[['Overall','overall','var(--indigo)'],['Business','business','var(--teal)'],['Data','data','var(--orange)'],['Governance','governance','var(--green)'],['Delivery','delivery','var(--violet)'],['Security','security','var(--red)'],['Platform','platform','var(--gold)']].map(([l,k,c]) => `
          <div class="score-card">
            <div class="sc-label">${l}</div>
            <div class="sc-value" style="color:${c}">${sc[k] || 0}</div>
            <div class="sc-bar-wrap"><div class="sc-bar ${this.barCol(sc[k]||0)}" style="width:${sc[k]||0}%"></div></div>
          </div>`).join('')}
      </div>

      <div class="content-section" style="margin-bottom:14px">
        <div class="cs-header"><i class="ti ti-info-circle" style="color:var(--indigo)"></i><span class="cs-title">How to read the readiness scores</span><span class="cs-badge b-indigo">Overall: ${sc.overall||0}/100 · ${interp.label}</span></div>
        <div class="cs-body" style="padding:0">
          <table class="res-table">
            <thead><tr><th>Range</th><th>Status</th><th>What it means</th><th>Recommended next step</th></tr></thead>
            <tbody>
              <tr><td><span class="pill pill-red">0–35</span></td><td style="font-weight:600">Not ready</td><td style="font-weight:400;color:var(--muted)">Foundational gaps — assess and plan before building.</td><td style="color:var(--teal);white-space:nowrap">AI Readiness Assessment</td></tr>
              <tr><td><span class="pill pill-amber">36–55</span></td><td style="font-weight:600">Emerging</td><td style="font-weight:400;color:var(--muted)">Pilots viable. Data governance and strategy needed before scale.</td><td style="color:var(--teal);white-space:nowrap">AI Strategy & Roadmap</td></tr>
              <tr style="background:rgba(99,102,241,0.05)"><td><span class="pill pill-indigo">56–70</span></td>
                <td style="font-weight:700;color:var(--indigo)">Moderate ${sc.overall>=56&&sc.overall<=70?'<span style="font-size:10px;padding:1px 6px;border-radius:4px;background:rgba(99,102,241,0.15);margin-left:4px">← this client</span>':''}</td>
                <td style="font-weight:400;color:var(--muted)">Can run governed pilots. Data and governance gaps must close before production.</td><td style="color:var(--teal);white-space:nowrap">Governance + Embedded TPM</td></tr>
              <tr><td><span class="pill pill-green">71–85</span></td><td style="font-weight:600">Ready to scale</td><td style="font-weight:400;color:var(--muted)">Production viable. Focus on adoption and expanding use cases.</td><td style="color:var(--teal);white-space:nowrap">Platform Design + Deployment</td></tr>
              <tr><td><span class="pill pill-teal">86–100</span></td><td style="font-weight:600">Mature</td><td style="font-weight:400;color:var(--muted)">AI embedded in operations. Optimize and expand AI COE.</td><td style="color:var(--teal);white-space:nowrap">Technical Advisory Retainer</td></tr>
            </tbody>
          </table>
          <div style="padding:10px 14px;border-top:0.5px solid var(--border);display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:6px">
            ${[['Business','business','Current AI state and maturity of existing programs','var(--teal)'],['Data','data','Data quality and governance readiness for RAG','var(--orange)'],['Governance','governance','AI risk, policy, and oversight maturity','var(--green)'],['Delivery','delivery','Internal AI engineering and delivery capability','var(--violet)'],['Security','security','Access controls, RBAC/ABAC, and auditability','var(--red)'],['Platform','platform','Deployment model — cloud, hybrid, or private','var(--gold)']].map(([lbl,key,desc,c])=>`
              <div style="display:flex;align-items:flex-start;gap:8px;padding:5px 0">
                <div style="width:8px;height:8px;border-radius:50%;background:${c};flex-shrink:0;margin-top:4px"></div>
                <div><div style="font-size:12px;font-weight:700;color:var(--ink)">${lbl}: <span style="color:${c}">${sc[key]||0}/100</span></div><div style="font-size:11px;color:var(--dim)">${desc}</div></div>
              </div>`).join('')}
          </div>
        </div>
      </div>

      ${warnings.length ? `
        <div class="content-section"><div class="cs-header" style="border-color:rgba(245,158,11,0.2)"><i class="ti ti-alert-triangle" style="color:var(--gold)"></i><span class="cs-title">Validation Warnings</span><span class="cs-badge b-gold">${warnings.length} items</span></div>
        <div class="cs-body"><div class="validation-warnings">${warnings.map(w => `<div class="warn-item"><i class="ti ti-alert-triangle"></i>${w}</div>`).join('')}</div></div></div>` : ''}

      ${(val.advisoryPath||[]).length ? `
        <div class="content-section"><div class="cs-header"><i class="ti ti-map-route" style="color:var(--indigo)"></i><span class="cs-title">Advisory Engagement Path</span></div>
        <div class="cs-body"><div class="advisory-chips">${(val.advisoryPath||[]).map(s=>`<div class="adv-chip"><i class="ti ti-circle-check"></i>${s}</div>`).join('')}</div></div></div>` : ''}`;
  },

  // ── ARCHITECTURE TAB ──────────────────────────────────────────────────────
  renderArchitecture(arch, cap) {
    const layers   = arch.targetArchitectureLayers || [];
    const caps     = cap.capabilityMap             || [];
    const patterns = arch.integrationPatterns      || [];
    const COLORS   = [
      ['rgba(99,102,241,0.5)','rgba(99,102,241,0.15)','#c7d2fe'],
      ['rgba(124,58,237,0.5)','rgba(124,58,237,0.12)','#ddd6fe'],
      ['rgba(13,148,136,0.5)','rgba(13,148,136,0.12)','#99f6e4'],
      ['rgba(37,99,235,0.5)','rgba(37,99,235,0.12)','#bfdbfe'],
      ['rgba(245,158,11,0.5)','rgba(245,158,11,0.12)','#fde68a'],
      ['rgba(220,38,38,0.4)','rgba(220,38,38,0.1)','#fca5a5'],
    ];
    document.getElementById('tab-architecture').innerHTML = `
      <div class="content-section"><div class="cs-header"><i class="ti ti-layers" style="color:var(--indigo)"></i><span class="cs-title">Reference Architecture · ${arch.architecturePattern || 'Target State'}</span><span class="cs-badge b-indigo">${layers.length} layers</span></div>
      <div class="cs-body">
        <div class="arch-diagram">
          ${layers.map((layer, i) => {
            const [bc, bg, tc] = COLORS[i % COLORS.length];
            return `<div class="arch-layer" style="border-color:${bc}">
              <div class="arch-layer-name" style="color:${tc}">${layer.layer}</div>
              <div class="arch-comps">${(layer.components||[]).map(c=>`<div class="arch-comp" style="background:${bg};color:${tc};border:0.5px solid ${bc}" title="${c.purpose}">${c.name}<span style="opacity:0.6;font-weight:400"> · ${c.tech}</span></div>`).join('')}</div>
            </div>
            ${i < layers.length - 1 ? '<div class="arch-arrow">↓</div>' : ''}`;}).join('')}
        </div>
      </div></div>

      <div class="content-section"><div class="cs-header"><i class="ti ti-cpu" style="color:var(--teal)"></i><span class="cs-title">AI Capability Map</span><span class="cs-badge b-teal">${caps.length} capabilities</span></div>
      <div class="cs-body"><table class="res-table"><thead><tr><th>Capability</th><th>Pattern</th><th>Priority</th><th>Rationale</th><th>Implementation</th></tr></thead>
      <tbody>${caps.map(c=>`<tr><td>${c.capability}</td><td><span class="pill pill-indigo">${c.pattern}</span></td><td><span class="pill ${c.priority==='Core'?'pill-teal':'pill-violet'}">${c.priority}</span></td><td style="font-weight:400">${c.rationale}</td><td style="font-weight:400;color:var(--dim)">${c.implementation||'—'}</td></tr>`).join('')}</tbody></table></div></div>

      <div class="content-section"><div class="cs-header"><i class="ti ti-git-branch" style="color:var(--orange)"></i><span class="cs-title">Integration Patterns</span><span class="cs-badge b-orange">${patterns.length}</span></div>
      <div class="cs-body"><table class="res-table"><thead><tr><th>Pattern</th><th>Type</th><th>Description</th><th>Data Flow</th></tr></thead>
      <tbody>${patterns.map(p=>`<tr><td>${p.pattern}</td><td><span class="pill pill-orange">${p.type}</span></td><td style="font-weight:400">${p.description}</td><td style="font-family:monospace;font-size:11px;color:var(--dim)">${p.dataFlow}</td></tr>`).join('')}</tbody></table></div></div>`;
  },

  // ── ADRs TAB ──────────────────────────────────────────────────────────────
  renderADRs(arch) {
    const adrs = arch.adrs || [];
    document.getElementById('tab-adrs').innerHTML = `
      <div class="content-section"><div class="cs-header"><i class="ti ti-file-certificate" style="color:var(--violet)"></i><span class="cs-title">Architecture Decision Records</span><span class="cs-badge b-violet">${adrs.length} decisions</span></div>
      <div class="cs-body"><div class="adr-list">${adrs.map(a => `
        <div class="adr-card">
          <div class="adr-head"><span class="adr-id">${a.id}</span><span class="adr-title">${a.title}</span><span class="pill pill-indigo">${a.status}</span></div>
          <div class="adr-body">
            <span class="adr-key">Context</span><span class="adr-val">${a.context}</span>
            <span class="adr-key">Decision</span><span class="adr-val" style="font-weight:600;color:var(--ink)">${a.decision}</span>
            <span class="adr-key">Rationale</span><span class="adr-val">${a.rationale}</span>
            ${(a.pros||[]).length?`<span class="adr-key">Pros</span><span class="adr-val">${a.pros.map(p=>`<span style="color:var(--green)">✓ ${p}</span>`).join(' · ')}</span>`:''}
            ${(a.cons||[]).length?`<span class="adr-key">Tradeoffs</span><span class="adr-val">${a.cons.map(c=>`<span style="color:var(--red)">✗ ${c}</span>`).join(' · ')}</span>`:''}
            ${(a.alternatives||[]).length?`<span class="adr-key">Alternatives</span><span class="adr-val">${a.alternatives.join(' · ')}</span>`:''}
          </div>
        </div>`).join('')}</div></div></div>`;
  },

  // ── RISK TAB ──────────────────────────────────────────────────────────────
  renderRisk(gov) {
    const risks    = (gov.riskRegister      || []).sort((a,b) => ['Critical','High','Medium','Low'].indexOf(a.severity) - ['Critical','High','Medium','Low'].indexOf(b.severity));
    const controls = gov.governanceControls || [];
    document.getElementById('tab-risk').innerHTML = `
      <div class="content-section"><div class="cs-header"><i class="ti ti-shield-check" style="color:var(--green)"></i><span class="cs-title">Risk Register</span><span class="cs-badge b-red">${risks.length} risks · sorted by severity</span></div>
      <div class="cs-body"><table class="res-table"><thead><tr><th>Severity</th><th>Risk</th><th>Category</th><th>Likelihood</th><th>Mitigation</th><th>Owner</th></tr></thead>
      <tbody>${risks.map(r=>`<tr><td><span class="pill ${this.sevPill(r.severity)}">${r.severity}</span></td><td>${r.risk}</td><td>${this.tag(r.category)}</td><td><span class="pill ${this.sevPill(r.likelihood)}">${r.likelihood}</span></td><td style="font-weight:400">${r.mitigation}</td><td style="color:var(--dim);white-space:nowrap">${r.owner}</td></tr>`).join('')}</tbody></table></div></div>

      <div class="content-section"><div class="cs-header"><i class="ti ti-lock" style="color:var(--teal)"></i><span class="cs-title">Governance Controls</span></div>
      <div class="cs-body">${controls.map(c=>`<div style="display:flex;align-items:flex-start;gap:8px;padding:8px 0;border-bottom:0.5px solid var(--border);font-size:13px;color:var(--muted)"><i class="ti ti-circle-check" style="color:var(--green);font-size:14px;flex-shrink:0;margin-top:1px"></i>${typeof c === 'string' ? c : c.description || c.control}</div>`).join('')}</div></div>`;
  },

  // ── ROADMAP TAB ───────────────────────────────────────────────────────────
  renderRoadmap(rm) {
    const phases = rm.roadmap || [];
    document.getElementById('tab-roadmap').innerHTML = `
      <div class="content-section"><div class="cs-header"><i class="ti ti-map" style="color:var(--gold)"></i><span class="cs-title">30 / 60 / 90 Day Delivery Roadmap</span><span class="cs-badge b-gold">${phases.length} phases</span></div>
      <div class="cs-body"><div class="roadmap-phases">${phases.map((p, i) => `
        <div class="roadmap-phase">
          <div class="rp-head"><div class="rp-num">${i+1}</div><div class="rp-title">${p.phase}</div><div class="rp-duration">${p.duration}</div></div>
          <div class="rp-body">
            <div><div class="rp-col-label">Objectives</div><ul class="rp-items">${(p.objectives||[]).map(o=>`<li>${o}</li>`).join('')}</ul></div>
            <div><div class="rp-col-label">Deliverables</div><ul class="rp-items">${(p.deliverables||[]).map(d=>`<li>${d}</li>`).join('')}</ul></div>
          </div>
          ${p.milestone?`<div style="padding:8px 16px 12px;font-size:12px;color:var(--teal);display:flex;align-items:center;gap:6px"><i class="ti ti-flag-2"></i>${p.milestone}</div>`:''}
        </div>`).join('')}</div></div></div>

      ${(rm.goLiveCriteria||[]).length ? `
        <div class="content-section"><div class="cs-header"><i class="ti ti-checklist" style="color:var(--green)"></i><span class="cs-title">Go-Live Criteria</span></div>
        <div class="cs-body">${rm.goLiveCriteria.map(c=>`<div style="display:flex;align-items:flex-start;gap:8px;padding:7px 0;border-bottom:0.5px solid var(--border);font-size:13px;color:var(--muted)"><i class="ti ti-circle-check" style="color:var(--green);font-size:14px;flex-shrink:0;margin-top:1px"></i>${c}</div>`).join('')}</div></div>` : ''}

      ${rm.teamStructure ? `
        <div class="content-section"><div class="cs-header"><i class="ti ti-users-group" style="color:var(--violet)"></i><span class="cs-title">Recommended Team Structure</span></div>
        <div class="cs-body"><div style="font-size:13px;color:var(--muted);margin-bottom:10px">${rm.teamStructure.recommendation||''}</div>
          <div class="tags">${(rm.teamStructure.coreTeam||[]).map(r=>`<span class="tag tag-indigo">${r}</span>`).join('')}${(rm.teamStructure.extended||[]).map(r=>`<span class="tag">${r}</span>`).join('')}</div>
        </div></div>` : ''}`;
  },

  // ── VALUE TAB ─────────────────────────────────────────────────────────────
  renderValue(f, a) {
    document.getElementById('tab-value').innerHTML = `
      <div class="kpi-grid">
        <div class="kpi-card kpi-green"><div class="kpi-label">Annual gross benefit</div><div class="kpi-val">${this.cur(f.grossBenefit)}</div><div class="kpi-sub">Labor + rework + delay savings</div></div>
        <div class="kpi-card kpi-teal"><div class="kpi-label">ROI (${f.yrs||3}-year)</div><div class="kpi-val">${this.pct(f.roi)}</div><div class="kpi-sub">Net benefit / TCO</div></div>
        <div class="kpi-card kpi-indigo"><div class="kpi-label">NPV</div><div class="kpi-val">${this.cur(f.npv)}</div><div class="kpi-sub">At ${a.discountRate||8}% discount rate</div></div>
        <div class="kpi-card kpi-gold"><div class="kpi-label">Payback period</div><div class="kpi-val">${this.mos(f.payback)}</div><div class="kpi-sub">Break-even timeline</div></div>
        <div class="kpi-card kpi-red"><div class="kpi-label">Cost of inaction</div><div class="kpi-val">${this.cur(f.coi)}</div><div class="kpi-sub">Total cost if nothing done · ${f.yrs||3} yr</div></div>
      </div>
      <div class="content-section"><div class="cs-header"><i class="ti ti-chart-bar" style="color:var(--gold)"></i><span class="cs-title">TCO / ROI Detail</span></div>
      <div class="cs-body"><table class="res-table"><thead><tr><th>Category</th><th>Amount</th><th>Notes</th></tr></thead>
      <tbody>
        <tr><td>Annual labor cost (current)</td><td>${this.cur(f.laborCost)}</td><td style="font-weight:400">${(a.annualVolume||0).toLocaleString()} items × ${Math.round((a.manualEffortMinutes||0)/60*100)/100}h × ${this.cur(a.laborRate||0)}/hr</td></tr>
        <tr><td>Annual rework cost (current)</td><td>${this.cur(f.reworkCost)}</td><td style="font-weight:400">${a.errorRate||0}% error rate × ${this.cur(a.costPerError||0)} per event</td></tr>
        <tr><td>Annual delay / escalation cost</td><td>${this.cur(f.delay)}</td><td style="font-weight:400">As stated</td></tr>
        <tr style="background:rgba(248,113,113,0.05)"><td style="color:var(--red)">Total current-state cost (annual)</td><td style="color:var(--red)">${this.cur(f.currentState)}</td><td style="font-weight:400">Baseline</td></tr>
        <tr style="background:rgba(52,211,153,0.05)"><td style="color:var(--green)">Labor savings</td><td style="color:var(--green)">${this.cur(f.laborSave)}</td><td style="font-weight:400">${a.productivityImprovement||0}% productivity gain</td></tr>
        <tr style="background:rgba(52,211,153,0.05)"><td style="color:var(--green)">Rework savings</td><td style="color:var(--green)">${this.cur(f.reworkSave)}</td><td style="font-weight:400">${a.riskReduction||0}% rework reduction</td></tr>
        <tr style="background:rgba(52,211,153,0.05)"><td style="color:var(--green)">Delay / escalation savings</td><td style="color:var(--green)">${this.cur(f.delaySave)}</td><td style="font-weight:400">Derived from productivity + risk inputs</td></tr>
        <tr><td>Implementation cost</td><td>${this.cur(f.impl)}</td><td style="font-weight:400">One-time</td></tr>
        <tr><td>Annual operating cost</td><td>${this.cur(f.opex)}</td><td style="font-weight:400">Platform + support</td></tr>
        <tr style="background:rgba(245,158,11,0.06)"><td style="font-weight:700">Total TCO (${f.yrs||3} yr)</td><td style="font-weight:700">${this.cur(f.tco)}</td><td style="font-weight:400">Implementation + ${f.yrs||3}yr OPEX</td></tr>
      </tbody></table></div></div>

      <div class="content-section"><div class="cs-header"><i class="ti ti-adjustments" style="color:var(--violet)"></i><span class="cs-title">Sensitivity Analysis</span></div>
      <div class="cs-body"><table class="res-table"><thead><tr><th>Scenario</th><th>Annual gross benefit</th><th>Vs expected</th></tr></thead>
      <tbody>
        <tr><td>Conservative (65%)</td><td style="color:var(--muted)">${this.cur((f.sensitivity||{}).low)}</td><td><span class="pill pill-amber">−35%</span></td></tr>
        <tr><td>Expected (100%)</td><td style="color:var(--green)">${this.cur((f.sensitivity||{}).mid)}</td><td><span class="pill pill-green">Baseline</span></td></tr>
        <tr><td>Optimistic (125%)</td><td style="color:var(--teal)">${this.cur((f.sensitivity||{}).high)}</td><td><span class="pill pill-teal">+25%</span></td></tr>
      </tbody></table></div></div>`;
  },

  // ── EXECUTIVE TAB ─────────────────────────────────────────────────────────
  renderExecutive(val, f, a, arch, out) {
    document.getElementById('tab-executive').innerHTML = `
      <div class="exec-banner" style="background:linear-gradient(135deg,rgba(99,102,241,0.08),rgba(13,148,136,0.05))">
        <div class="exec-eyebrow">CFO / Executive Narrative · One-Page Business Case</div>
        <div class="exec-text">${val.cfoNarrative || val.executiveSummary || 'Executive narrative generated.'}</div>
        <div class="exec-meta">
          <div class="exec-meta-item"><i class="ti ti-chart-bar" style="color:var(--gold)"></i><strong>ROI:</strong> ${this.pct(f.roi)} over ${f.yrs||3} years</div>
          <div class="exec-meta-item"><i class="ti ti-clock" style="color:var(--teal)"></i><strong>Payback:</strong> ${this.mos(f.payback)}</div>
          <div class="exec-meta-item"><i class="ti ti-trending-up" style="color:var(--green)"></i><strong>NPV:</strong> ${this.cur(f.npv)}</div>
          <div class="exec-meta-item"><i class="ti ti-alert-circle" style="color:var(--red)"></i><strong>Cost of inaction:</strong> ${this.cur(f.coi)} / ${f.yrs||3} yr</div>
        </div>
      </div>

      ${val.investmentJustification ? `
        <div class="content-section"><div class="cs-header"><i class="ti ti-bulb" style="color:var(--gold)"></i><span class="cs-title">Investment Justification</span></div>
        <div class="cs-body">
          <div style="display:flex;flex-direction:column;gap:10px">
            <div style="padding:10px 14px;background:rgba(52,211,153,0.06);border-radius:var(--r);border:0.5px solid rgba(52,211,153,0.2)"><div style="font-size:11px;font-weight:700;color:var(--green);margin-bottom:4px;text-transform:uppercase;letter-spacing:0.06em">Primary Argument</div><div style="font-size:13px;color:var(--muted)">${val.investmentJustification.primaryArgument||''}</div></div>
            <div style="padding:10px 14px;background:rgba(248,113,113,0.06);border-radius:var(--r);border:0.5px solid rgba(248,113,113,0.2)"><div style="font-size:11px;font-weight:700;color:var(--red);margin-bottom:4px;text-transform:uppercase;letter-spacing:0.06em">Urgency Driver</div><div style="font-size:13px;color:var(--muted)">${val.investmentJustification.urgencyDriver||''}</div></div>
            <div style="padding:10px 14px;background:rgba(99,102,241,0.06);border-radius:var(--r);border:0.5px solid rgba(99,102,241,0.15)"><div style="font-size:11px;font-weight:700;color:var(--indigo);margin-bottom:4px;text-transform:uppercase;letter-spacing:0.06em">Competitive Context</div><div style="font-size:13px;color:var(--muted)">${val.investmentJustification.competitiveContext||''}</div></div>
          </div>
        </div></div>` : ''}

      <div class="content-section"><div class="cs-header"><i class="ti ti-gavel" style="color:var(--indigo)"></i><span class="cs-title">Recommended Decision</span></div>
      <div class="cs-body">
        <div style="font-size:22px;font-weight:800;color:var(--green);margin-bottom:6px">${val.recommendedDecision || 'Proceed'}</div>
        <div style="font-size:13px;color:var(--muted)">${val.recommendedDecisionRationale || ''}</div>
      </div></div>

      ${(val.advisoryPath||[]).length ? `
        <div class="content-section"><div class="cs-header"><i class="ti ti-list-check" style="color:var(--indigo)"></i><span class="cs-title">Advisory Engagement Path</span></div>
        <div class="cs-body"><div class="advisory-chips">${val.advisoryPath.map((s,i)=>`<div class="adv-chip"><span style="font-weight:800;margin-right:4px">${i+1}.</span>${s}</div>`).join('')}</div></div></div>` : ''}`;
  },
};
