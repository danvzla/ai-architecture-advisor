/**
 * agent-04-architecture.js
 * Architecture Agent — Designs the target-state architecture, layers, ADRs, and integration patterns.
 * The most complex agent. Receives all prior results (01-03).
 * Output is the core of the Architecture tab.
 */
window.Agent04Architecture = {
  id:      'architecture',
  name:    'Architecture Agent',
  icon:    'ti-topology-star',
  color:   'var(--orange)',
  mission: 'Target-state architecture · component design · ADRs',
  tokens:  4500,

  buildPrompt(answers, prior) {
    const discovery   = prior['discovery']   || {};
    const outcome     = prior['outcome']     || {};
    const capability  = prior['capability']  || {};
    return `You are a Principal Solutions Architect with 20+ years of experience in enterprise AI systems.
Design the target-state AI architecture. Be specific to the technology stack — no generic answers.
Return ONLY raw JSON — no markdown, no backticks. Start with { end with }. All string values ONE LINE, max 25 words.

CONTEXT:
Industry: ${answers.industry} · Function: ${answers.businessFunction} · Size: ${answers.companySize}
Problem: ${discovery.problemStatement || ''}
Pattern selected: ${capability.recommendedPattern || ''}
Capabilities required: ${(answers.capabilities || []).join(', ')}
Deployment model: ${answers.deploymentModel}
Cloud platform: ${answers.cloudPlatform}
Integrations: ${(answers.integrations || []).join(', ')}
Data sources: ${(answers.knowledgeSources || []).join(', ')}
Autonomy: ${answers.actionAutonomy}
Traceability: ${answers.traceabilityNeed}
Access control: ${answers.accessControl}

Return:
{
  "architecturePattern": "specific architecture pattern name",
  "targetArchitectureLayers": [
    {
      "layer": "layer name e.g. Client & Experience Layer",
      "purpose": "what this layer does",
      "components": [
        { "name": "component name", "tech": "specific technology or product", "purpose": "what it does" }
      ]
    }
  ],
  "integrationPatterns": [
    {
      "pattern": "pattern name",
      "type": "RAG or API or Event-Driven or MCP or Agentic or Streaming",
      "description": "what this pattern does in this specific context",
      "dataFlow": "ComponentA → ComponentB → ComponentC"
    }
  ],
  "adrs": [
    {
      "id": "ADR-001",
      "title": "decision title",
      "status": "Proposed",
      "context": "what situation drives this decision",
      "decision": "what was decided",
      "rationale": "specific technical and business reasons",
      "pros": ["benefit 1", "benefit 2"],
      "cons": ["tradeoff 1"],
      "alternatives": ["Alternative A: why rejected"]
    }
  ]
}

Include 5-6 architecture layers with 2-4 components each.
Include 3-4 integration patterns.
Include 4-5 ADRs covering LLM selection, deployment model, data architecture, security, and orchestration.
Name specific technologies: Azure OpenAI, LangGraph, FAISS, Pinecone, Qdrant, FastAPI, LangChain, etc.`;
  },

  async run(apiKey, answers, prior) {
    const raw = await window.ApiClient.call(apiKey, this.buildPrompt(answers, prior), this.tokens);
    return window.ApiClient.parseJSON(raw);
  },
};
