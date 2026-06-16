# AI Architecture Advisor

> **8-agent AI system that converts a 7-step enterprise discovery session into a complete target-state architecture package — the same deliverables a Principal Architect takes a week to produce, in 60 seconds.**

**Live demo:** https://danvzla.github.io/ai-architecture-advisor/
&nbsp;·&nbsp; Part of the [AI portfolio](https://github.com/danvzla) by Daniel Mazzini

---

## The Problem

Every enterprise AI engagement starts the same way and takes too long:

| Step | Deliverable | Who produces it |
|------|-------------|-----------------|
| Day 1–2 | Discovery & problem framing | Senior Architect |
| Day 2–3 | Reference architecture design | Principal Architect |
| Day 3–4 | Architecture Decision Records (ADRs) | Principal Architect |
| Day 4–5 | Risk register & governance controls | Risk Architect |
| Day 5–6 | 30/60/90 day delivery roadmap | Senior TPM |
| Day 6–7 | ROI model & CFO executive narrative | Value Engineer |

**5–7 days. Each engagement starts from scratch. Discovery context gets lost in handoffs. ADRs are almost never written until an audit forces it. The ROI case gets assembled after the architecture decision — making it advocacy, not analysis.**

This tool solves all three problems simultaneously.

---

## What It Produces

Seven enterprise-grade deliverables from a single 7-step discovery session:

| # | Deliverable | What it contains |
|---|-------------|------------------|
| 1 | **Reference Architecture** | Layered target-state diagram with specific technologies per layer |
| 2 | **Architecture Decision Records (ADRs)** | Context · decision · rationale · tradeoffs · alternatives rejected |
| 3 | **Risk Register & Governance Controls** | Risks ranked by severity, category, likelihood, mitigation, and owner |
| 4 | **30/60/90 Day Delivery Roadmap** | Phased milestones, deliverables, dependencies, go-live criteria |
| 5 | **TCO / ROI / NPV Model** | Full financial model with sensitivity analysis at 65%, 100%, 125% |
| 6 | **CFO Executive Narrative** | Investment justification, urgency driver, recommended decision |
| 7 | **AI Readiness Scorecard** | 6-dimension maturity score with gap analysis and legend |

---

## The 8-Agent Pipeline

Each agent is a separate file with a single responsibility: one prompt, one output schema, one parsing function. Agents run sequentially and each one receives the accumulated outputs of all prior agents as context.

```
Agent 01 — Discovery Agent
  Problem framing · stakeholder mapping · pain quantification
  Output: problemStatement · rootCauses · stakeholderMap · urgencyRating

Agent 02 — Outcome Agent
  Business outcomes · KPI definition · success criteria
  Output: outcomeHierarchy · successCriteria · adoptionMilestones

Agent 03 — Capability Agent
  AI capability mapping · pattern selection · UX design
  Output: recommendedPattern · capabilityMap · agentDesign · uxRecommendation

Agent 04 — Architecture Agent       ← receives prior[discovery] + prior[capability]
  Target-state architecture · ADRs · integration patterns
  Output: targetArchitectureLayers · adrs · integrationPatterns

Agent 05 — Data & Platform Agent    ← receives prior[architecture]
  RAG pipeline design · data readiness · platform architecture
  Output: ragPipelineDesign · platformArchitecture · integrationDesign

Agent 06 — Governance Agent         ← receives prior[architecture] + prior[data]
  Risk register · governance controls · compliance framework
  Output: riskRegister · governanceControls · complianceRequirements

Agent 07 — Roadmap Agent            ← receives prior[governance].riskRegister
  30/60/90 day roadmap · milestones · team structure
  Output: roadmap · goLiveCriteria · teamStructure · criticalPath

Agent 08 — Value Engineering Agent  ← receives prior[ALL] + pre-calculated financials
  CFO narrative · investment justification · advisory path
  Output: executiveSummary · cfoNarrative · investmentJustification · advisoryPath
```

The financial model (TCO, ROI, NPV, payback, cost of inaction) is calculated by `financial.js` — a pure deterministic function — before Agent 08 runs. Agent 08 receives those numbers and writes the CFO narrative around them, ensuring the math is always accurate.

---

## Three Operating Modes

### Demo Mode — No API Key Required
The full blueprint loads in ~8 seconds using a pre-built Telco NOC scenario embedded in `assets/data/demo-blueprint.js`. All 8 agents animate in sequence. All 7 tabs populate with real, structured content. Works offline, works from the desktop, works anywhere.

Select **Demo** → choose a scenario → click **Quick Demo** or **Start Wizard**.

### Claude API Mode
Live generation using Anthropic's `claude-haiku-4-5`. Each of the 8 agents makes an independent API call and results chain forward. Full reasoning grounded in your specific discovery inputs.

Switch to **Claude** → enter your `sk-ant-...` key → run.

### OpenAI API Mode
Identical 8-agent pipeline running on `gpt-4o-mini`. Same output structure, same 7 tabs. Provider is swapped by one line in `api-client.js`.

Switch to **OpenAI** → enter your `sk-...` key → run.

---

## 15 Pre-Built Scenarios

Each scenario is a complete set of 40+ wizard answers covering a specific industry and use case. Select one and the wizard auto-fills — or fill it manually for a custom engagement.

| # | Scenario | Vertical |
|---|----------|----------|
| 01 | Telco Network AIOps Platform | Telecommunications |
| 02 | Financial Services GenAI Assistant | Financial Services |
| 03 | Healthcare Clinical Decision Support | Healthcare |
| 04 | Government Document Intelligence | Public Sector |
| 05 | Enterprise IT Operations (ServiceNow) | Technology |
| 06 | Retail Customer Experience AI | Retail |
| 07 | Manufacturing Predictive Maintenance | Manufacturing |
| 08 | Cybersecurity Threat Intelligence | Technology |
| 09 | Insurance Claims Processing AI | Financial Services |
| 10 | Energy Grid Optimization AI | Energy |
| 11 | Legal Contract Intelligence | Professional Services |
| 12 | Supply Chain Intelligence | Manufacturing |
| 13 | HR Talent Intelligence Platform | Technology |
| 14 | Pharma Clinical Trials AI | Healthcare |
| 15 | Private Cloud AI Infrastructure | Technology |

---

## The 7-Step Discovery Wizard

The wizard mirrors how a senior architect actually runs a discovery session:

| Step | Focus | Key inputs |
|------|-------|-----------|
| 1 — Profile | Context | Industry · function · company size · AI maturity (1–6) · urgency |
| 2 — Problems | Discovery | Problems to solve · pain level · stakeholders · problem description |
| 3 — Outcomes | Value | Target outcomes · success metrics · impact timeframe · adoption target |
| 4 — Capabilities | Design | Required AI capabilities · autonomy level · UX · multi-agent need |
| 5 — Data | Platform | Knowledge sources · data quality · deployment model · integrations |
| 6 — Governance | Risk | Industry risk · governance maturity · auditability · internal capability |
| 7 — Value | Economics | Annual volume · effort · labor cost · error rate · implementation cost |

Step 7 inputs drive the financial model: labor savings, rework reduction, delay avoidance, TCO, ROI, NPV, payback period, and cost of inaction.

---

## Architecture

### High-Level — Three Layers

```
┌─────────────────────────────────────────────────────────────────┐
│  PRESENTATION LAYER                                             │
│  index.html — mode selector, scenario dropdown, wizard shell    │
│  assets/css/styles.css — full design system, dark theme         │
│  Wizard overlay · Agent pipeline animation · 7-tab results      │
│  Browser-native · GitHub Pages · zero infrastructure cost       │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│  ORCHESTRATION LAYER                                            │
│  assets/js/app.js — mode management, pipeline loop, export      │
│  AGENT_REGISTRY[] — ordered agent array (10 lines)              │
│  Prior results accumulated and passed forward to each agent     │
│  FinancialModel.calculate() runs before Agent 08                │
└──────────────────────────┬──────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────────┐
│  AGENT + API LAYER                                              │
│  agent-01-discovery.js → agent-08-value.js (8 individual files) │
│  assets/js/api-client.js — Claude ↔ OpenAI provider swap       │
│  assets/data/demo-blueprint.js — pre-built output, no API key   │
│  assets/data/scoring.js + financial.js — pure math functions    │
└─────────────────────────────────────────────────────────────────┘
```

### Low-Level — Agent Design

Each agent file exposes the same interface:

```javascript
window.Agent04Architecture = {
  id:      'architecture',
  name:    'Architecture Agent',
  mission: 'Target architecture · ADRs · integration patterns',
  tokens:  4500,

  buildPrompt(answers, prior) {
    // Assembles prompt from wizard answers + all prior agent outputs
    // Agent 04 receives prior[discovery] + prior[capability]
  },

  async run(apiKey, answers, prior) {
    const raw = await window.ApiClient.call(apiKey, this.buildPrompt(answers, prior), this.tokens);
    return window.ApiClient.parseJSON(raw);
  },
};
```

**Prior results chaining** — each agent sees everything prior agents produced:
- Agent 07 (Roadmap) reads `prior.governance.riskRegister` to build phase-specific risk notes
- Agent 08 (Value) reads `prior[ALL]` plus pre-calculated financials to write the CFO narrative

**Provider abstraction** — one line change in `app.js` switches the entire pipeline:
```javascript
window.ApiClient.init('claude');   // or 'openai'
```

**JSON repair chain** — 5 attempts to handle malformed or token-truncated responses:
1. Direct `JSON.parse()`
2. Strip non-printable control characters
3. Collapse literal newlines inside strings
4. Collapse whitespace runs
5. Close unclosed brackets (handles token-limit truncation)

---

## File Structure

```
ai-architecture-advisor/
├── index.html                        ← deployed file (built, self-contained)
├── build.js                          ← build script for local development
│
└── assets/
    ├── css/
    │   └── styles.css                ← full design system
    │
    ├── data/
    │   ├── agents.js                 ← agent registry (10 lines)
    │   ├── scenarios.js              ← 15 complete scenario answer sets
    │   ├── demo-blueprint.js         ← pre-built Telco NOC blueprint
    │   ├── scoring.js                ← AI readiness scoring engine
    │   └── financial.js              ← TCO / ROI / NPV calculator
    │
    ├── agents/
    │   ├── agent-01-discovery.js     ← problem framing prompt + parse
    │   ├── agent-02-outcome.js       ← KPI definition prompt + parse
    │   ├── agent-03-capability.js    ← capability mapping prompt + parse
    │   ├── agent-04-architecture.js  ← architecture + ADRs prompt + parse
    │   ├── agent-05-data-platform.js ← RAG pipeline prompt + parse
    │   ├── agent-06-governance.js    ← risk register prompt + parse
    │   ├── agent-07-roadmap.js       ← 90-day roadmap prompt + parse
    │   └── agent-08-value.js         ← CFO narrative prompt + parse
    │
    └── js/
        ├── api-client.js             ← Claude ↔ OpenAI provider abstraction
        ├── wizard.js                 ← step navigation + field rendering
        ├── pipeline.js               ← agent pipeline animation
        ├── results.js                ← all 7 tab renderers
        └── app.js                    ← init · orchestrator · export
```

**Maintenance rule:** To add a 9th agent — create `agent-09-xxx.js` and add one line to `agents.js`. No other file changes needed.

---

## Telco NOC Demo — Sample Output

Running the Telco Network AIOps scenario (Scenario 01) produces:

**Financial model**
- Annual gross benefit: **$845K** (labor + rework + delay savings)
- 3-year ROI: **87%**
- NPV at 8% discount rate: **$1.1M**
- Payback period: **14 months**
- Cost of inaction (3 years): **$2.6M**

**Architecture pattern selected**
> RAG + Agentic AI with Human-in-the-Loop and Zero Trust Enterprise Integration

**Sample ADR produced (ADR-002)**
> **Decision:** Primary: Azure OpenAI gpt-4o. Fallback: Anthropic Claude claude-haiku-4-5 via Azure Marketplace.
> **Rationale:** Azure OpenAI meets data residency compliance. Dual-provider fallback ensures 99.9% AI availability with seamless failover.
> **Tradeoffs accepted:** Prompt compatibility testing required across both providers.
> **Alternatives rejected:** OpenAI direct API (data leaves Azure boundary). Single provider (unacceptable availability risk for 24/7 NOC).

---

## Local Development

### Prerequisites
- Node.js (any recent version)
- A text editor

### Workflow

```bash
# 1. Clone or download the repo
git clone https://github.com/danvzla/ai-architecture-advisor.git
cd ai-architecture-advisor

# 2. Edit any source file in assets/
#    - Add or modify an agent prompt:  assets/agents/agent-04-architecture.js
#    - Update a scenario:              assets/data/scenarios.js
#    - Change styling:                 assets/css/styles.css
#    - Modify the financial model:     assets/data/financial.js

# 3. Build the self-contained deployment file
node build.js
# → produces dist/index.html (self-contained, works everywhere)

# 4. Test locally
#    Open dist/index.html in any browser — no server needed

# 5. Deploy
#    Upload dist/index.html to GitHub as index.html
```

### Switching API provider

Open `assets/js/app.js` and change one line:

```javascript
window.ApiClient.init('claude');   // Anthropic claude-haiku-4-5
window.ApiClient.init('openai');   // OpenAI gpt-4o-mini
```

Run `node build.js` after any change.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| UI | Vanilla HTML · CSS · JavaScript (no framework) |
| Icons | Tabler Icons |
| LLM (Claude mode) | Anthropic claude-haiku-4-5 (`claude-haiku-4-5-20251001`) |
| LLM (OpenAI mode) | OpenAI gpt-4o-mini |
| Hosting | GitHub Pages (static, zero cost) |
| Build | Node.js build script (no bundler dependencies) |

---


## Author

**Daniel Mazzini** — Principal Solutions Architect & Senior Technical Program Manager

20+ years across cloud infrastructure, networking, security, and telecommunications. Background includes Broadcom/VMware, Dell EMC, Juniper Networks, and Nokia/Ericsson engagements with AT&T, T-Mobile, and Verizon.

- LinkedIn: [linkedin.com/in/daniel-mazzini-22059734](https://www.linkedin.com/in/daniel-mazzini-22059734/)
- GitHub: [github.com/danvzla](https://github.com/danvzla)
- Location: Coppell, TX · Bilingual: English & Spanish
