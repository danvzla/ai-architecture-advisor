/**
 * wizard.js
 * Wizard state management and UI rendering.
 * Owns: step navigation, chip/select interactions, field rendering.
 */

// ─── STATE ────────────────────────────────────────────────────────────────────
window.WizardState = {
  answers: {},
  currentStep: 0,

  reset() {
    this.answers = {};
    this.currentStep = 0;
  },
};

// ─── STEP DEFINITIONS ─────────────────────────────────────────────────────────
window.WIZARD_STEPS = [
  { id: 'profile',    label: 'Profile',     eyebrow: 'Step 1 · Context',      question: 'Tell us about the customer and initiative',    hint: 'Shapes the architecture pattern, governance model, and deployment approach.' },
  { id: 'problem',    label: 'Problems',    eyebrow: 'Step 2 · Discovery',    question: 'What problems are we solving?',                hint: 'Start with the pain, not the technology. Select all that apply.' },
  { id: 'outcomes',   label: 'Outcomes',    eyebrow: 'Step 3 · Outcomes',     question: 'What does success look like?',                 hint: 'Define measurable outcomes — these become the architecture\'s success criteria.' },
  { id: 'capabilities', label: 'AI Capabilities', eyebrow: 'Step 4 · Capabilities', question: 'What AI capabilities are required?',   hint: 'Map outcomes to the AI patterns that deliver them.' },
  { id: 'data',       label: 'Data',        eyebrow: 'Step 5 · Data & Platform', question: 'What data and platforms are in scope?',    hint: 'Assesses RAG feasibility, integration complexity, and deployment constraints.' },
  { id: 'governance', label: 'Governance',  eyebrow: 'Step 6 · Governance',   question: 'How will this be governed and delivered?',    hint: 'Risk, controls, operating model, and whether embedded TPM support is needed.' },
  { id: 'value',      label: 'Value',       eyebrow: 'Step 7 · Value',        question: 'What are the economics of the current state?', hint: 'Inputs drive the TCO, ROI, NPV, and CFO-ready business case.' },
];

// ─── MATURITY DESCRIPTIONS ────────────────────────────────────────────────────
const MATURITY_DESCS = {
  '1': 'No AI yet — explore, assess readiness, build the business case first.',
  '2': 'Exploring — define the strategy, identify use cases, get executive alignment.',
  '3': 'Pilots only — choose a production path, establish governance, measure ROI.',
  '4': 'Multiple fragmented pilots — consolidate onto a platform, establish standards.',
  '5': 'Production in limited areas — extend the platform, drive adoption, expand.',
  '6': 'Scaling AI enterprise-wide — optimize, govern at scale, build AI COE.',
};

// ─── UI ───────────────────────────────────────────────────────────────────────
window.WizardUI = {

  render() {
    const step = window.WIZARD_STEPS[window.WizardState.currentStep];
    const total = window.WIZARD_STEPS.length;
    const cur   = window.WizardState.currentStep;

    // Progress dots
    document.getElementById('step-dots').innerHTML = window.WIZARD_STEPS.map((s, i) => `
      <div class="step-dot-wrap ${i === cur ? 'active' : i < cur ? 'done' : ''}">
        <div class="step-dot ${i === cur ? 'active' : i < cur ? 'done' : ''}">
          ${i < cur ? '<i class="ti ti-check" style="font-size:10px"></i>' : i + 1}
        </div>
        <div class="step-dot-label">${s.label}</div>
      </div>
      ${i < total - 1 ? `<div class="step-connector ${i < cur ? 'done' : ''}"></div>` : ''}
    `).join('');

    document.getElementById('wiz-progress-fill').style.width = `${(cur / total) * 100}%`;
    document.getElementById('wiz-count').textContent = `${cur + 1} of ${total}`;
    document.getElementById('wiz-back').style.visibility = cur === 0 ? 'hidden' : 'visible';

    const isLast = cur === total - 1;
    const nb = document.getElementById('wiz-next');
    nb.innerHTML = isLast ? 'Generate Blueprint <i class="ti ti-sparkles"></i>' : 'Continue <i class="ti ti-arrow-right"></i>';
    nb.style.background = isLast ? 'var(--teal)' : 'var(--indigo-d)';

    // Step content
    document.getElementById('wiz-step-container').innerHTML = `
      <div class="wiz-step">
        <div class="wiz-eyebrow">${step.eyebrow}</div>
        <div class="wiz-question">${step.question}</div>
        <div class="wiz-hint">${step.hint}</div>
        ${this.renderFields(step.id)}
      </div>`;

    this.restoreAnswers(step.id);
  },

  next() {
    this.collectAnswers(window.WIZARD_STEPS[window.WizardState.currentStep].id);
    if (window.WizardState.currentStep < window.WIZARD_STEPS.length - 1) {
      window.WizardState.currentStep++;
      this.render();
    } else {
      App.runPipeline();
    }
  },

  prev() {
    this.collectAnswers(window.WIZARD_STEPS[window.WizardState.currentStep].id);
    if (window.WizardState.currentStep > 0) {
      window.WizardState.currentStep--;
      this.render();
    }
  },

  // ── FIELD RENDERERS ──────────────────────────────────────────────────────
  renderFields(stepId) {
    const a = window.WizardState.answers;
    const sel = (id, opts) =>
      `<select class="wiz-select" id="f_${id}">${opts.map(o => `<option ${a[id]===o?'selected':''}>${o}</option>`).join('')}</select>`;
    const chip = (field, val, multi) => {
      const on = multi
        ? (Array.isArray(a[field]) && a[field].includes(val))
        : a[field] === val;
      return `<div class="chip ${on?'on':''}" data-field="${field}" data-value="${val}" data-multi="${multi}">${val}</div>`;
    };

    if (stepId === 'profile') return `
      <div class="two-col">
        <div class="field-group"><div class="field-label req">Industry</div>${sel('industry',['Telecommunications','Financial Services','Healthcare','Manufacturing','Retail','Public Sector','Technology','Insurance','Energy','Other'])}</div>
        <div class="field-group"><div class="field-label req">Target business function</div>${sel('businessFunction',['IT Operations','Network / NOC','Cybersecurity','Customer Service','Sales / Pre-Sales','Finance','HR','Operations','Enterprise-wide'])}</div>
        <div class="field-group"><div class="field-label req">Company size</div>${sel('companySize',['Mid-market','Enterprise','Global Enterprise','Public Sector Agency'])}</div>
        <div class="field-group"><div class="field-label req">Business urgency</div>${sel('urgency',['Explore','Pilot in 90 days','Production MVP in 6 months','Scale existing AI','Critical executive priority'])}</div>
      </div>
      <div class="field-group">
        <div class="field-label req">Current AI maturity</div>
        <div class="maturity-row">
          ${[['1','None'],['2','Exploring'],['3','Pilots'],['4','Fragmented'],['5','Production'],['6','Scaling']].map(([v,l])=>`
            <div class="mat-card ${a.currentAiState===v?'on':''}" data-mat="${v}">
              <div class="mat-num">${v}</div><div class="mat-label">${l}</div>
            </div>`).join('')}
        </div>
        <div class="mat-desc" id="mat-desc">${a.currentAiState ? MATURITY_DESCS[a.currentAiState] : 'Select your current AI state.'}</div>
      </div>`;

    if (stepId === 'problem') return `
      <div class="field-group"><div class="field-label req">Problems to solve (select all)</div>
        <div class="chips-grid">${['High manual effort','Poor knowledge access','Slow decision-making','Operational incidents','Compliance risk','High support cost','Inconsistent service quality','Fragmented AI pilots','Security exposure','Revenue leakage'].map(v=>chip('primaryProblem',v,true)).join('')}</div>
      </div>
      <div class="two-col">
        <div class="field-group"><div class="field-label req">Pain level</div>${sel('painLevel',['Low','Medium','High','Critical'])}</div>
        <div class="field-group"><div class="field-label">Key stakeholders</div>
          <div class="chips-grid">${['CIO','CTO','CISO','CFO','VP Operations','Network Engineering','Enterprise Architecture','Compliance'].map(v=>chip('stakeholders',v,true)).join('')}</div>
        </div>
      </div>
      <div class="field-group"><div class="field-label req">Problem description</div>
        <textarea class="wiz-textarea" id="f_problemDetails" placeholder="Describe the current-state problem in business language...">${a.problemDetails||''}</textarea>
      </div>`;

    if (stepId === 'outcomes') return `
      <div class="field-group"><div class="field-label req">Target business outcomes</div>
        <div class="chips-grid">${['Reduce cost','Improve productivity','Improve customer experience','Reduce risk','Accelerate delivery','Increase revenue','Improve operational resilience'].map(v=>chip('primaryOutcome',v,true)).join('')}</div>
      </div>
      <div class="two-col">
        <div class="field-group"><div class="field-label req">Success metrics / KPIs</div>
          <div class="chips-grid">${['Reduce tickets','Reduce MTTR','Reduce manual effort','Improve compliance','Faster onboarding','Improve first-contact resolution','Reduce rework'].map(v=>chip('successMetric',v,true)).join('')}</div>
        </div>
        <div class="field-group">
          <div class="field-group"><div class="field-label req">Impact timeframe</div>${sel('impactTimeframe',['30 days','90 days','6 months','12 months'])}</div>
          <div class="field-group" style="margin-top:10px"><div class="field-label">Adoption target</div>${sel('adoptionTarget',['Small team','Department','Multiple business units','Enterprise-wide','External customers'])}</div>
        </div>
      </div>`;

    if (stepId === 'capabilities') return `
      <div class="field-group"><div class="field-label req">Required AI capabilities</div>
        <div class="chips-grid">${['Knowledge retrieval','Document summarization','Workflow automation','Agentic task execution','Decision support','Data extraction','Governance monitoring','Tool integration','Conversation assistant','Anomaly explanation'].map(v=>chip('capabilities',v,true)).join('')}</div>
      </div>
      <div class="two-col">
        <div class="field-group"><div class="field-label req">AI action autonomy</div>${sel('actionAutonomy',['Recommend only','Human approval required','Autonomous low-risk actions','Autonomous high-risk actions'])}</div>
        <div class="field-group"><div class="field-label req">Preferred user experience</div>${sel('userExperience',['Web copilot','Embedded in workflow tool','API-first service','Dashboard / control tower','Chat assistant','Mobile / field experience'])}</div>
        <div class="field-group"><div class="field-label">Multi-agent need</div>${sel('multiAgentNeed',['No','Maybe','Yes'])}</div>
        <div class="field-group"><div class="field-label">Output traceability</div>${sel('traceabilityNeed',['Low','Medium','High','Regulated / auditable'])}</div>
      </div>`;

    if (stepId === 'data') return `
      <div class="two-col">
        <div class="field-group"><div class="field-label req">Knowledge / data sources</div>
          <div class="chips-grid">${['SharePoint','Confluence','ServiceNow','CRM','Data lake','PDFs','OSS/BSS','Security tools','SIEM','Network telemetry','Email / Teams'].map(v=>chip('knowledgeSources',v,true)).join('')}</div>
        </div>
        <div>
          <div class="field-group"><div class="field-label req">Data quality</div>${sel('dataQuality',['Unknown','Fragmented','Partially governed','Well governed'])}</div>
          <div class="field-group"><div class="field-label req">Sensitive data</div>${sel('sensitiveData',['None','Some PII','Customer data','Financial data','Healthcare data','Confidential IP','Regulated data'])}</div>
          <div class="field-group"><div class="field-label req">Access control</div>${sel('accessControl',['Open','Role-based','Strict RBAC/ABAC','Regulated evidence required'])}</div>
        </div>
      </div>
      <div class="two-col">
        <div class="field-group"><div class="field-label req">Preferred deployment model</div>${sel('deploymentModel',['Public SaaS AI','Azure OpenAI','AWS Bedrock','Google Vertex AI','Private AI','Hybrid','Unknown'])}</div>
        <div class="field-group"><div class="field-label">Current platform</div>${sel('cloudPlatform',['AWS','Azure','GCP','Private Cloud / VCF','ServiceNow','Hybrid / Multi-cloud','Unknown'])}</div>
      </div>
      <div class="field-group"><div class="field-label">Enterprise integrations</div>
        <div class="chips-grid">${['APIs','ITSM','CRM','IAM','SIEM','Ticketing','OSS/BSS','Cloud platform','Data warehouse','Workflow automation'].map(v=>chip('integrations',v,true)).join('')}</div>
      </div>`;

    if (stepId === 'governance') return `
      <div class="two-col">
        <div class="field-group"><div class="field-label req">Industry risk level</div>${sel('industryRisk',['Low','Moderate','Regulated','Highly regulated'])}</div>
        <div class="field-group"><div class="field-label req">AI governance maturity</div>${sel('governanceMaturity',['None','Informal','Defined','Mature'])}</div>
        <div class="field-group"><div class="field-label req">Auditability required</div>${sel('auditability',['No','Basic logs','Full audit trail','Regulatory evidence'])}</div>
        <div class="field-group"><div class="field-label req">Internal AI engineering capability</div>${sel('internalCapability',['Low','Medium','High'])}</div>
        <div class="field-group"><div class="field-label req">Program complexity</div>${sel('programComplexity',['Single team','Multiple teams','Enterprise-wide','Regulated multi-stakeholder'])}</div>
        <div class="field-group"><div class="field-label req">Need embedded Senior TPM?</div>${sel('needTpm',['No','Partial','Yes'])}</div>
      </div>
      <div class="field-group"><div class="field-label req">Top AI risks</div>
        <div class="chips-grid">${['Hallucination','Privacy','IP leakage','Bias','Unsafe actions','Compliance','Cost overrun','Data leakage','Low adoption'].map(v=>chip('topRisks',v,true)).join('')}</div>
      </div>`;

    if (stepId === 'value') {
      const n = (key, def) => a[key] != null ? a[key] : def;
      return `
        <div style="font-size:12px;color:var(--muted);background:var(--surface);border-radius:var(--rl);padding:10px 14px;margin-bottom:1.25rem;border:0.5px solid var(--border)">
          Pre-filled with representative defaults — adjust for your scenario. These inputs drive TCO, ROI, NPV, and the CFO narrative.
        </div>
        <div class="two-col">
          <div class="field-group"><div class="field-label">Annual process / case volume</div><input type="number" class="wiz-number" id="f_annualVolume" value="${n('annualVolume',12000)}"><div class="wiz-helper">Tickets, incidents, SOWs, cases</div></div>
          <div class="field-group"><div class="field-label">Average manual effort per item (min)</div><input type="number" class="wiz-number" id="f_manualEffortMinutes" value="${n('manualEffortMinutes',35)}"></div>
          <div class="field-group"><div class="field-label">Loaded labor cost ($/hr)</div><input type="number" class="wiz-number" id="f_laborRate" value="${n('laborRate',95)}"></div>
          <div class="field-group"><div class="field-label">Error / rework rate (%)</div><input type="number" class="wiz-number" id="f_errorRate" value="${n('errorRate',8)}"></div>
          <div class="field-group"><div class="field-label">Cost per error ($)</div><input type="number" class="wiz-number" id="f_costPerError" value="${n('costPerError',300)}"></div>
          <div class="field-group"><div class="field-label">Annual delay / escalation cost ($)</div><input type="number" class="wiz-number" id="f_delayCostAnnual" value="${n('delayCostAnnual',180000)}"></div>
          <div class="field-group"><div class="field-label">Productivity improvement (%)</div><input type="number" class="wiz-number" id="f_productivityImprovement" value="${n('productivityImprovement',35)}"></div>
          <div class="field-group"><div class="field-label">Risk / rework reduction (%)</div><input type="number" class="wiz-number" id="f_riskReduction" value="${n('riskReduction',25)}"></div>
          <div class="field-group"><div class="field-label">Implementation cost ($)</div><input type="number" class="wiz-number" id="f_implementationCost" value="${n('implementationCost',250000)}"></div>
          <div class="field-group"><div class="field-label">Annual platform / operating cost ($)</div><input type="number" class="wiz-number" id="f_annualOperatingCost" value="${n('annualOperatingCost',90000)}"></div>
          <div class="field-group"><div class="field-label">Evaluation period</div><select class="wiz-select" id="f_evaluationYears">${['1','3','5'].map(o=>`<option ${n('evaluationYears','3')===o?'selected':''}>${o}</option>`).join('')}</select></div>
          <div class="field-group"><div class="field-label">Discount rate (%)</div><input type="number" class="wiz-number" id="f_discountRate" value="${n('discountRate',8)}"></div>
        </div>`;
    }
    return '';
  },

  // ── COLLECT + RESTORE ────────────────────────────────────────────────────
  collectAnswers(stepId) {
    const a = window.WizardState.answers;
    const get = id => { const el = document.getElementById(`f_${id}`); return el ? el.value : undefined; };
    const num = id => { const v = get(id); return v !== undefined ? Number(v) : undefined; };

    if (stepId === 'profile') {
      ['industry','businessFunction','companySize','urgency'].forEach(k => { const v=get(k); if(v) a[k]=v; });
    }
    if (stepId === 'problem') {
      ['painLevel'].forEach(k => { const v=get(k); if(v) a[k]=v; });
      const pd = get('problemDetails'); if (pd) a.problemDetails = pd;
    }
    if (stepId === 'outcomes') {
      ['impactTimeframe','adoptionTarget'].forEach(k => { const v=get(k); if(v) a[k]=v; });
    }
    if (stepId === 'capabilities') {
      ['actionAutonomy','userExperience','multiAgentNeed','traceabilityNeed'].forEach(k => { const v=get(k); if(v) a[k]=v; });
    }
    if (stepId === 'data') {
      ['dataQuality','sensitiveData','accessControl','deploymentModel','cloudPlatform'].forEach(k => { const v=get(k); if(v) a[k]=v; });
    }
    if (stepId === 'governance') {
      ['industryRisk','governanceMaturity','auditability','internalCapability','programComplexity','needTpm'].forEach(k => { const v=get(k); if(v) a[k]=v; });
    }
    if (stepId === 'value') {
      ['annualVolume','manualEffortMinutes','laborRate','errorRate','costPerError','delayCostAnnual',
       'productivityImprovement','riskReduction','implementationCost','annualOperatingCost','discountRate']
        .forEach(k => { const v=num(k); if(v!==undefined) a[k]=v; });
      const ey = get('evaluationYears'); if(ey) a.evaluationYears = ey;
    }
  },

  restoreAnswers(stepId) {
    // Chips restored via renderFields (on/off class set from answers at render time)
    // Maturity card click binding
    document.querySelectorAll('.mat-card').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.mat-card').forEach(c => c.classList.remove('on'));
        card.classList.add('on');
        window.WizardState.answers.currentAiState = card.dataset.mat;
        const desc = document.getElementById('mat-desc');
        if (desc) desc.textContent = MATURITY_DESCS[card.dataset.mat] || '';
      });
    });
    // Chip click binding
    document.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const { field, value, multi } = chip.dataset;
        const a = window.WizardState.answers;
        if (multi === 'true') {
          if (!Array.isArray(a[field])) a[field] = [];
          chip.classList.toggle('on');
          if (chip.classList.contains('on')) { if (!a[field].includes(value)) a[field].push(value); }
          else { a[field] = a[field].filter(v => v !== value); }
        } else {
          document.querySelectorAll(`[data-field="${field}"]`).forEach(c => c.classList.remove('on'));
          chip.classList.add('on');
          a[field] = value;
        }
      });
    });
  },
};
