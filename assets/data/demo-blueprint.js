/**
 * demo-blueprint.js
 * Pre-built comprehensive Telco NOC blueprint used in Demo Mode.
 * All 8 agent outputs are included — no API calls needed.
 * Displayed for any selected scenario in Demo Mode.
 */
window.DEMO_BLUEPRINT = {
  prior: {
    discovery: {
      problemStatement: "NOC teams cannot efficiently triage network incidents at scale due to fragmented tooling and manual knowledge access across disparate systems.",
      rootCauses: [
        "Alert data, runbooks, and historical incidents are siloed across SolarWinds, Nokia NetAct, ServiceNow, and Confluence",
        "Engineers must context-switch across 6+ tools during active incidents, extending mean time to diagnose",
        "No AI-assisted correlation between alarm patterns and known resolution procedures"
      ],
      stakeholderMap: [
        { role: "CTO", interest: "Platform modernization and 5G readiness", influence: "High" },
        { role: "VP Network Operations", interest: "MTTR reduction and SLA compliance", influence: "High" },
        { role: "CISO", interest: "Zero trust enforcement and audit trails", influence: "High" },
        { role: "NOC Manager", interest: "Engineer productivity and alert fatigue reduction", influence: "Medium" }
      ],
      painQuantification: "4.2-hour average MTTR affecting 2M subscribers costs approximately $18K per critical incident hour in SLA penalties and churn risk.",
      currentStateSummary: "NOC operates reactively with manual alarm correlation across 6 tools and paper-based runbooks. Engineers average 12 context switches per major incident.",
      urgencyRating: "High",
      discoveryInsight: "The highest-value intervention is AI-assisted alarm correlation with retrieval-augmented runbook access — reducing the 35-minute diagnosis phase to under 5 minutes."
    },
    outcome: {
      primaryOutcome: "Reduce mean time to resolution from 4.2 hours to under 90 minutes within 90 days of production deployment.",
      outcomeHierarchy: [
        { outcome: "MTTR Reduction", metric: "Average minutes from alarm to resolution", target: "Below 90 minutes", timeframe: "90 days" },
        { outcome: "Alert Fatigue Reduction", metric: "False positive rate in AI-triaged alerts", target: "Below 15%", timeframe: "60 days" },
        { outcome: "Engineer Productivity", metric: "Manual steps per incident", target: "Reduced by 40%", timeframe: "90 days" },
        { outcome: "Knowledge Coverage", metric: "% of top-50 incident types with AI runbook coverage", target: "100%", timeframe: "45 days" }
      ],
      successCriteria: [
        "90-day pilot: 3 incident types fully automated with human approval gate",
        "MTTR below 90 minutes for AI-assisted incidents measured over 30-day window",
        "Engineer satisfaction score above 7/10 in post-deployment survey"
      ],
      adoptionMilestones: [
        "Day 30: NOC dashboard live, top-10 incident runbooks indexed and retrievable",
        "Day 90: 3 incident types in production with governance gate, MTTR baseline measured"
      ],
      executiveValueStatement: "AI-assisted NOC operations will reduce critical incident MTTR by 64%, protecting $12M in annual SLA exposure and reducing L2 escalation volume by 35%.",
      riskOfInaction: "Without AI assistance, MTTR will continue degrading as network complexity grows with 5G rollout — SLA exposure increases $3M annually."
    },
    capability: {
      recommendedPattern: "RAG + Agentic AI with Human-in-the-Loop Validation and Zero Trust Enterprise Integration",
      patternRationale: "Telco NOC requires grounded AI responses from authoritative runbooks (RAG), autonomous investigation steps (Agentic), and mandatory human approval before remediation actions (HITL) in a regulated environment.",
      capabilityMap: [
        { capability: "Knowledge retrieval", pattern: "RAG", priority: "Core", rationale: "NOC engineers need instant runbook and incident history retrieval during active alerts", implementation: "Vector RAG on ServiceNow + Confluence + runbook PDFs via pgvector" },
        { capability: "Anomaly explanation", pattern: "RAG", priority: "Core", rationale: "Explain alarm patterns in plain language to reduce diagnosis time", implementation: "LLM with retrieved context from Nokia NetAct alarm history" },
        { capability: "Decision support", pattern: "Agentic", priority: "Core", rationale: "Recommend remediation steps with confidence scoring", implementation: "LangGraph agent with tool access to alarm correlation API" },
        { capability: "Tool integration", pattern: "API", priority: "Core", rationale: "Bidirectional ServiceNow ticket updates and alarm acknowledgement", implementation: "REST API connectors with OAuth2 + webhook triggers" },
        { capability: "Document summarization", pattern: "RAG", priority: "Supporting", rationale: "Summarize post-incident reports for pattern learning", implementation: "Claude with structured output against incident report schema" }
      ],
      agentDesign: {
        multiAgent: true,
        agentRoles: ["Alarm Correlation Agent", "Runbook Retrieval Agent", "Remediation Recommendation Agent", "Ticket Update Agent"],
        orchestrationPattern: "Sequential with parallel retrieval",
        humanInLoop: "Required before any network remediation action is dispatched"
      },
      uxRecommendation: {
        interface: "NOC dashboard control tower with AI assistant panel",
        keyInteractions: ["One-click AI triage on active alarm", "Guided remediation workflow with approval gate", "Runbook retrieval sidebar during incident"],
        accessControl: "RBAC by NOC tier — L1 view only, L2 approve, L3 override"
      },
      capabilityGaps: ["Network topology graph database for blast radius analysis — must be built", "Real-time telemetry streaming pipeline from OSS/BSS — integration required"]
    },
    architecture: {
      architecturePattern: "RAG + Agentic AI with Human-in-the-Loop and Zero Trust Enterprise Integration",
      targetArchitectureLayers: [
        {
          layer: "Experience & Control Layer",
          purpose: "NOC engineer interface and AI assistant interaction surface",
          components: [
            { name: "NOC AI Dashboard", tech: "React + TypeScript", purpose: "Unified NOC control tower with AI assistant panel" },
            { name: "AI Chat Interface", tech: "WebSocket streaming", purpose: "Real-time conversational AI for incident triage" },
            { name: "Approval Workflow UI", tech: "ServiceNow Portal", purpose: "Human-in-the-loop remediation approval gate" }
          ]
        },
        {
          layer: "API Gateway & Security Layer",
          purpose: "Zero trust enforcement, authentication, and request routing",
          components: [
            { name: "API Gateway", tech: "Azure API Management", purpose: "Rate limiting, auth enforcement, request logging" },
            { name: "Identity Provider", tech: "Azure AD + RBAC", purpose: "Engineer authentication with tier-based permissions" },
            { name: "Audit Log Service", tech: "Azure Monitor + Log Analytics", purpose: "Full audit trail of all AI queries and actions" }
          ]
        },
        {
          layer: "AI Orchestration Layer",
          purpose: "Multi-agent coordination and LLM orchestration",
          components: [
            { name: "Agent Orchestrator", tech: "LangGraph", purpose: "Sequential agent pipeline with conditional branching" },
            { name: "LLM Gateway", tech: "Azure OpenAI (gpt-4o)", purpose: "Primary inference with fallback to Claude claude-haiku-4-5" },
            { name: "Prompt Registry", tech: "Custom service + Redis", purpose: "Versioned prompt templates per agent and incident type" }
          ]
        },
        {
          layer: "RAG & Knowledge Layer",
          purpose: "Enterprise knowledge retrieval and context injection",
          components: [
            { name: "Vector Store", tech: "pgvector on Azure PostgreSQL", purpose: "Runbook and incident history embeddings" },
            { name: "Embedding Service", tech: "Azure OpenAI text-embedding-3-large", purpose: "Document and query embedding" },
            { name: "Knowledge Ingestion", tech: "Apache Airflow", purpose: "Automated pipeline for new runbook and incident indexing" }
          ]
        },
        {
          layer: "Integration & Data Layer",
          purpose: "Enterprise system connectivity and real-time data access",
          components: [
            { name: "ServiceNow Connector", tech: "REST API + Webhooks", purpose: "Bidirectional ticket and CMDB integration" },
            { name: "Nokia NetAct Adapter", tech: "Custom REST wrapper", purpose: "Real-time alarm ingestion and acknowledgement" },
            { name: "OSS/BSS Integration", tech: "Apache Kafka", purpose: "Event streaming for network telemetry and alarm correlation" }
          ]
        },
        {
          layer: "Infrastructure & Platform Layer",
          purpose: "Cloud infrastructure, monitoring, and MLOps",
          components: [
            { name: "Container Platform", tech: "Azure Kubernetes Service", purpose: "Microservices hosting and auto-scaling" },
            { name: "Observability Stack", tech: "Datadog + LangSmith", purpose: "AI system monitoring, LLM tracing, and cost management" },
            { name: "CI/CD Pipeline", tech: "Azure DevOps + GitHub Actions", purpose: "Automated deployment with prompt regression testing" }
          ]
        }
      ],
      integrationPatterns: [
        { pattern: "Alarm-Triggered RAG Pipeline", type: "Event-Driven", description: "Network alarm triggers automatic knowledge retrieval and AI triage before engineer notification", dataFlow: "Nokia NetAct Alarm → Kafka → Orchestrator → Vector Retrieval → LLM → NOC Dashboard" },
        { pattern: "ServiceNow Bidirectional Sync", type: "API", description: "AI creates and updates tickets with triage findings and recommended actions", dataFlow: "LLM Output → Ticket Update API → ServiceNow → Engineer Approval → Action Dispatch" },
        { pattern: "Runbook RAG with Hybrid Search", type: "RAG", description: "Dense + sparse retrieval over runbooks and past incidents for maximum recall", dataFlow: "Engineer Query → Embed → pgvector Hybrid Search → Rerank → Context Injection → LLM Response" },
        { pattern: "Agent-to-Tool MCP Integration", type: "MCP", description: "LangGraph agents call network tools via Model Context Protocol for structured action execution", dataFlow: "Agent Decision → MCP Tool Call → Network API → Result → Agent Memory → Next Step" }
      ],
      adrs: [
        { id: "ADR-001", title: "LLM Provider: Azure OpenAI with Anthropic Fallback", status: "Proposed", context: "Regulated telco environment requires data residency in Azure. Single LLM provider creates availability risk for NOC operations.", decision: "Primary: Azure OpenAI gpt-4o. Fallback: Anthropic Claude claude-haiku-4-5 via Azure Marketplace for resilience.", rationale: "Azure OpenAI meets data residency requirements. Dual-provider fallback ensures 99.9% AI availability for critical NOC operations.", pros: ["Data sovereignty compliance", "High availability via fallback", "Azure native billing and audit"], cons: ["Higher complexity in prompt compatibility", "Cost monitoring across two providers"], alternatives: ["OpenAI direct API: rejected — data leaves Azure boundary", "Single provider: rejected — unacceptable availability risk for NOC"] },
        { id: "ADR-002", title: "Vector Store: pgvector on Azure PostgreSQL", status: "Proposed", context: "Need vector search capability with enterprise-grade security, backup, and audit. Dedicated vector databases require additional infrastructure management.", decision: "Use pgvector extension on existing Azure PostgreSQL Flexible Server rather than standalone vector DB.", rationale: "Reduces operational complexity, leverages existing PostgreSQL security and backup, meets compliance audit requirements within known infrastructure.", pros: ["No additional infrastructure", "SQL joins across relational and vector data", "Existing DBA team familiarity"], cons: ["Lower throughput than dedicated vector DB at >10M vectors", "Less advanced ANN algorithms"], alternatives: ["Pinecone: rejected — data residency uncertainty", "Azure AI Search: considered, higher cost for vector workload size"] },
        { id: "ADR-003", title: "Agent Orchestration: LangGraph over LangChain Agents", status: "Proposed", context: "NOC workflows require deterministic step sequences with conditional branching and human approval gates. LangChain's default agent loop is non-deterministic.", decision: "Use LangGraph for explicit state machine orchestration of all multi-agent workflows.", rationale: "LangGraph's directed graph model guarantees step sequencing, enables conditional branching at the approval gate, and provides full execution tracing for audit.", pros: ["Deterministic execution", "Built-in human-in-the-loop support", "Full execution trace for compliance"], cons: ["Higher implementation complexity vs LangChain", "Smaller ecosystem than LangChain"], alternatives: ["LangChain ReAct: rejected — non-deterministic for regulated actions", "Custom orchestration: rejected — maintenance burden"] },
        { id: "ADR-004", title: "Retrieval Strategy: Hybrid Dense + Sparse Search", status: "Proposed", context: "NOC runbooks contain both semantic content and exact technical terms (alarm codes, equipment IDs) that pure dense retrieval misses.", decision: "Implement hybrid retrieval combining dense vector search (cosine similarity) with BM25 sparse search, reranked by Cohere Rerank.", rationale: "Hybrid retrieval improves recall for both natural language queries and exact technical term matching, critical for accurate runbook retrieval during incidents.", pros: ["Higher recall for technical terminology", "Better handling of rare alarm codes", "Reranking improves precision"], cons: ["Higher retrieval latency (+80ms)", "Additional reranking cost"], alternatives: ["Dense-only: rejected — misses exact alarm codes in runbooks", "Sparse-only BM25: rejected — misses semantic similarity for paraphrased queries"] },
        { id: "ADR-005", title: "Deployment Model: Hybrid (Azure + On-Prem Nokia NetAct)", status: "Proposed", context: "Nokia NetAct is on-premises with strict API access controls. Pushing all data to cloud creates latency and security concerns for real-time alarm correlation.", decision: "AI inference and RAG run in Azure. Nokia NetAct integration via secure on-prem adapter with encrypted event streaming to Azure Kafka.", rationale: "Keeps inference costs in cloud while maintaining on-prem connectivity for low-latency alarm ingestion. Adapter pattern isolates NetAct from direct cloud exposure.", pros: ["Low latency alarm ingestion", "Nokia system isolation", "Cost-effective inference in cloud"], cons: ["On-prem adapter is additional component to maintain", "Hybrid networking complexity"], alternatives: ["Full cloud: rejected — Nokia NetAct access constraints", "Full on-prem: rejected — GPU infrastructure cost and management overhead"] }
      ]
    },
    data: {
      dataReadinessAssessment: {
        overall: "Partially Ready",
        score: 52,
        gaps: ["ServiceNow historical incident data not deduplicated — 23% duplicate tickets estimated", "Nokia NetAct alarm data has inconsistent severity coding across 3 firmware versions", "Confluence runbooks last reviewed 18+ months ago — currency unknown"],
        remediationRequired: ["ServiceNow data cleanse sprint — 2 weeks before RAG indexing", "NetAct alarm normalization script — standardize severity codes across firmware versions", "Runbook audit and refresh — NOC team validates top-50 incident types before indexing"]
      },
      ragPipelineDesign: {
        ingestionStrategy: "Scheduled batch ingestion from ServiceNow and Confluence (nightly), real-time streaming from Nokia NetAct alarm history",
        chunkingStrategy: "Semantic chunking by runbook section headers, 512 tokens with 64-token overlap for context preservation",
        embeddingModel: "Azure OpenAI text-embedding-3-large (3072 dimensions) for maximum retrieval quality",
        vectorStore: "pgvector on Azure PostgreSQL — chosen for data residency compliance and SQL join capability with incident metadata",
        retrievalStrategy: "Hybrid dense + sparse (BM25) with score fusion, reranked by Cohere Rerank v3 for final top-5 context selection",
        rerankingStrategy: "Cohere Rerank v3 applied to top-20 retrieved chunks, final 5 passed to LLM context window",
        contextWindowManagement: "Dynamic context assembly — alarm details (600 tokens) + retrieved runbook (1800 tokens) + incident history (600 tokens) = 3000 token context budget"
      },
      platformArchitecture: {
        inferenceLayer: "Azure OpenAI gpt-4o in East US 2 region for data residency — provisioned throughput 100K TPM",
        orchestrationLayer: "LangGraph 0.2 on AKS — chosen for deterministic state machine execution required by NOC approval workflows",
        observabilityStack: ["LangSmith — LLM trace logging, latency tracking, and prompt regression testing", "Datadog — infrastructure monitoring, cost dashboards, and SLA alerting", "Azure Monitor — audit log aggregation and compliance reporting"],
        cachingStrategy: "Redis semantic cache for repeated alarm type queries — estimated 35% cache hit rate reduces inference cost and latency"
      },
      integrationDesign: [
        { system: "ServiceNow ITSM", integrationMethod: "REST API + Webhooks", dataFlow: "Bidirectional — AI reads ticket context, writes triage findings, triggers approval workflow", authMethod: "OAuth2 with service account" },
        { system: "Nokia NetAct (OSS)", integrationMethod: "Custom REST wrapper + Kafka", dataFlow: "One-directional inbound — alarm events streamed to AI pipeline for correlation", authMethod: "mTLS with certificate rotation" },
        { system: "Azure AD", integrationMethod: "OIDC + RBAC", dataFlow: "Authentication and authorization for all AI system access", authMethod: "OAuth2 + SAML federation" }
      ],
      dataGovernanceRequirements: ["All AI queries and responses logged to Azure Monitor with 90-day retention for regulatory audit", "PII fields in ServiceNow tickets masked before LLM context injection", "Data residency enforced — no customer data leaves Azure East US 2 region"]
    },
    governance: {
      riskRegister: [
        { risk: "LLM Hallucination in Remediation Recommendations", category: "Technical", severity: "Critical", likelihood: "Medium", description: "LLM recommends incorrect remediation step that worsens network incident, causing wider outage", mitigation: "Human approval gate mandatory before any network action. Confidence threshold — AI flags uncertainty when below 80%. Output grounded in retrieved runbooks only.", owner: "AI Platform Architect", residualRisk: "Low" },
        { risk: "Customer Data Exposure via LLM Context", category: "Security", severity: "Critical", likelihood: "Low", description: "Customer PII from ServiceNow tickets inadvertently included in LLM prompts and logged", mitigation: "PII masking applied to all ticket data before context injection. Prompt audit in LangSmith. Data residency enforced in Azure East US 2.", owner: "CISO", residualRisk: "Low" },
        { risk: "Nokia NetAct Integration Instability", category: "Technical", severity: "High", likelihood: "Medium", description: "On-prem adapter fails during active incident, removing AI assistance at critical moment", mitigation: "Circuit breaker pattern — graceful degradation to manual mode. NOC UI shows AI unavailable state. Redundant adapter instances.", owner: "Platform Engineering", residualRisk: "Medium" },
        { risk: "Regulatory Non-Compliance (Audit Trail)", category: "Compliance", severity: "High", likelihood: "Low", description: "Telecom regulator requires full audit of AI-assisted network decisions. Incomplete logging creates compliance exposure.", mitigation: "All AI queries, retrieved context, LLM responses, and human approval decisions logged to immutable audit store. 90-day retention.", owner: "Compliance", residualRisk: "Low" },
        { risk: "Engineer Over-Reliance on AI Recommendations", category: "Operational", severity: "High", likelihood: "High", description: "NOC engineers stop validating AI recommendations, creating automation bias and missing edge cases", mitigation: "Training program on AI limitations. Dashboard shows AI confidence scores. Quarterly calibration exercises where engineers diagnose without AI.", owner: "NOC Manager", residualRisk: "Medium" },
        { risk: "RAG Knowledge Base Staleness", category: "Technical", severity: "Medium", likelihood: "High", description: "Runbooks and incident history become outdated as network evolves, degrading AI retrieval quality", mitigation: "Automated freshness scoring on indexed documents. Alert when runbook not reviewed in 90 days. Nightly re-indexing pipeline.", owner: "Knowledge Management", residualRisk: "Low" }
      ],
      governanceControls: [
        { control: "Human Approval Gate", category: "Access", description: "Mandatory human approval before any AI-recommended network action is dispatched", implementation: "LangGraph conditional node — agent halts at approval step, ServiceNow workflow dispatched to L2 engineer" },
        { control: "PII Data Masking", category: "Data", description: "Customer PII fields masked before any data reaches LLM context", implementation: "Pre-processing middleware strips PII fields from ServiceNow payloads using regex + NER model" },
        { control: "AI Output Audit Log", category: "Audit", description: "Immutable log of all AI queries, context, responses, and human decisions", implementation: "Azure Monitor + Log Analytics with 90-day retention, exported to compliance data lake monthly" },
        { control: "Confidence Threshold Guardrail", category: "Model", description: "AI flags low-confidence responses and escalates to human without recommendation", implementation: "Confidence scoring in prompt output schema — responses below 0.80 routed to human-only queue" },
        { control: "Prompt Version Control", category: "Model", description: "All production prompts versioned, tested, and approved before deployment", implementation: "Prompt registry with semantic versioning, regression test suite, change approval workflow" }
      ],
      complianceRequirements: [
        { framework: "NIST AI-RMF", relevantControls: ["Govern 1.1 — AI risk policies", "Measure 2.1 — AI system testing", "Manage 3.1 — Incident response"], priority: "Required" },
        { framework: "OWASP LLM", relevantControls: ["LLM01 Prompt Injection prevention", "LLM06 Excessive Agency controls", "LLM09 Misinformation mitigation"], priority: "Required" },
        { framework: "ISO 42001", relevantControls: ["Clause 8.2 AI risk assessment", "Clause 9.1 Monitoring and measurement"], priority: "Recommended" }
      ],
      aiGovernanceModel: {
        approvalProcess: "L2 engineer approves AI-recommended actions via ServiceNow workflow before dispatch",
        modelLifecyclePolicy: "Prompt versions tagged and released via change management. Model updates require regression test pass and CISO sign-off.",
        incidentResponsePlan: "AI system failure triggers automatic fallback to manual NOC mode. Incident logged, root cause analysis within 48 hours.",
        humanOversightLevel: "Human approval required"
      },
      governanceMaturityRoadmap: "Formalize AI policy and risk framework in Q1, implement model monitoring and drift detection in Q2, achieve ISO 42001 alignment by Q4."
    },
    roadmap: {
      roadmap: [
        {
          phase: "Phase 1 — Foundation",
          duration: "Days 1–30",
          theme: "Foundation",
          objectives: ["Data remediation and RAG infrastructure deployment", "ServiceNow and Nokia NetAct integration connectors live", "Top-10 incident type runbooks indexed and validated"],
          deliverables: ["RAG pipeline deployed in Azure (pgvector, embedding, ingestion)", "ServiceNow bidirectional connector tested and approved", "NOC AI dashboard MVP — retrieval only, no actions"],
          milestone: "Day 30: Engineers can query runbooks in natural language from NOC dashboard. Zero network actions automated.",
          dependencies: ["ServiceNow API access granted by IT Security", "Nokia NetAct adapter firewall rules approved by CISO"],
          resources: ["AI Platform Engineer x2", "NOC Subject Matter Expert x1", "ServiceNow Admin x1"],
          risks: ["Nokia NetAct adapter complexity may extend timeline by 1-2 weeks"]
        },
        {
          phase: "Phase 2 — Pilot",
          duration: "Days 31–60",
          theme: "Build",
          objectives: ["3 incident types with full AI triage and recommendation live in pilot", "Human approval gate implemented and tested with NOC team", "Confidence scoring and audit logging operational"],
          deliverables: ["LangGraph agent pipeline for top-3 incident types", "Human approval workflow in ServiceNow", "LangSmith observability dashboard for AI ops team"],
          milestone: "Day 60: 3 incident types in pilot with 5 engineers. MTTR baseline measurement begins.",
          dependencies: ["Phase 1 RAG pipeline stable for 2 weeks", "L2 engineer training on approval workflow complete"],
          resources: ["AI Platform Engineer x2", "NOC Lead x1 (50% time)", "Security Architect x1 (review)"],
          risks: ["Engineer adoption may require additional training cycles", "Confidence threshold calibration may take 2 weeks of tuning"]
        },
        {
          phase: "Phase 3 — Production",
          duration: "Days 61–90",
          theme: "Launch",
          objectives: ["Full NOC team onboarded — all 3 shifts", "MTTR target of 90 minutes measured and reported", "Governance controls validated and compliance audit ready"],
          deliverables: ["Production deployment with HA configuration", "MTTR dashboard and weekly AI operations report", "Compliance audit package — audit logs, governance documentation, risk register"],
          milestone: "Day 90: MTTR below 90 minutes for AI-assisted incident types. Executive briefing delivered.",
          dependencies: ["Phase 2 pilot success with > 80% engineer satisfaction", "CISO sign-off on production security review"],
          resources: ["AI Platform Engineer x1 (ongoing)", "NOC Manager x1 (change management)", "TPM x1"],
          risks: ["Regulatory review may require documentation iteration before production sign-off"]
        }
      ],
      criticalPath: ["Nokia NetAct adapter approval (CISO)", "ServiceNow data cleanse sprint", "L2 engineer approval workflow training", "Production security review (CISO sign-off)"],
      keyDependencies: [
        { dependency: "Nokia NetAct API access and adapter firewall rules", owner: "CISO + Network Engineering", blocksPhase: "Phase 1" },
        { dependency: "ServiceNow historical data cleanse", owner: "IT Operations", blocksPhase: "Phase 1" },
        { dependency: "L2 engineer training completion", owner: "NOC Manager", blocksPhase: "Phase 2" }
      ],
      teamStructure: {
        coreTeam: ["AI Platform Engineer (Lead)", "AI Platform Engineer (Integration)", "NOC Subject Matter Expert", "Security Architect (part-time)"],
        extended: ["CISO (governance approvals)", "NOC Manager (change management)", "ServiceNow Admin"],
        tpmRequired: true,
        recommendation: "Embed a Senior TPM from Day 1 to coordinate CISO approvals, Nokia NetAct adapter track, and NOC engineer onboarding in parallel."
      },
      goLiveCriteria: [
        "Human approval gate tested and validated by CISO",
        "MTTR baseline measured over 14-day pilot window",
        "Audit log compliance verified by Compliance team",
        "NOC engineer satisfaction score above 7/10 in pilot survey",
        "Nokia NetAct adapter tested through 3 simulated major incident scenarios"
      ]
    },
    value: {
      executiveSummary: "This $250K investment deploys a RAG + Agentic AI platform that will reduce Telco NOC MTTR from 4.2 hours to under 90 minutes, protecting $12M in annual SLA exposure. The 3-year ROI is 87% with payback in 14 months, and the cost of inaction is $2.6M over 3 years in avoidable SLA penalties and engineer overhead.",
      cfoNarrative: "The Telco NOC AI platform targets $845K in annual gross benefit — $630K from engineer productivity gains, $135K from error and rework reduction, and $80K from delay and escalation avoidance. Against a $250K implementation and $90K annual operating cost, the 3-year net cumulative benefit is $1.87M with a 14-month payback. The cost of inaction — maintaining current MTTR and SLA exposure — is $2.61M over the same period.",
      investmentJustification: {
        primaryArgument: "Every 30-minute reduction in average MTTR for critical incidents saves approximately $9K in SLA penalties and churn risk — making ROI directly measurable within 90 days of deployment.",
        urgencyDriver: "5G network expansion will add 40% more network elements by Q4, making the manual MTTR problem significantly worse without AI assistance.",
        competitiveContext: "Tier 1 carriers including AT&T and T-Mobile have deployed AI-assisted NOC operations in 2023-2024. Remaining on manual workflows creates a competitive service quality disadvantage."
      },
      sensitivityAnalysis: {
        conservative: "At 65% of projected benefits ($549K annual gross benefit), ROI is 42% and payback extends to 22 months — still positive.",
        expected: "At 100% ($845K annual gross benefit), ROI is 87% with 14-month payback.",
        optimistic: "At 125% ($1.06M annual gross benefit), ROI is 132% with 11-month payback."
      },
      recommendedDecision: "Proceed",
      recommendedDecisionRationale: "Positive ROI in all sensitivity scenarios, measurable 90-day milestone, and escalating cost of inaction from 5G expansion make this a high-confidence investment.",
      advisoryPath: [
        "1. AI Readiness Assessment — validate data quality and integration feasibility before build commitment (2 weeks, $25K)",
        "2. Embedded Senior TPM — drive CISO approvals, Nokia NetAct adapter, and NOC onboarding tracks in parallel from Day 1",
        "3. Private AI Platform Design — architect the reusable platform that extends beyond NOC to other Telco AI use cases"
      ]
    }
  },
  maturityScores: { overall: 57, business: 50, data: 35, governance: 35, delivery: 60, security: 80, platform: 70 },
  warnings: [
    "Data quality is not ready for production RAG without remediation — ServiceNow data cleanse sprint required before indexing.",
    "AI governance is immature — define policy, risk controls, and approval workflows before production deployment.",
    "Nokia NetAct adapter is a critical path dependency requiring CISO approval — initiate immediately."
  ],
};
