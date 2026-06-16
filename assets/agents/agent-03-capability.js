/**
 * agent-03-capability.js
 * Capability Agent — Maps outcomes to AI capabilities and selects architecture patterns.
 * Receives: Agent 01 (discovery) + Agent 02 (outcome) results.
 * Output feeds directly into Agent 04 (Architecture).
 */
window.Agent03Capability = {
  id:      'capability',
  name:    'Capability Agent',
  icon:    'ti-cpu',
  color:   'var(--violet)',
  mission: 'AI capability mapping · pattern selection · UX design',
  tokens:  2000,

  buildPrompt(answers, prior) {
    const discovery = prior['discovery'] || {};
    const outcome   = prior['outcome']   || {};
    return `You are a Principal AI Capability Architect.
Map the required AI capabilities to architecture patterns, select the best-fit design, and define UX requirements.
Return ONLY raw JSON — no markdown, no backticks. Start with { end with }. All string values ONE LINE, max 20 words.

CONTEXT:
Industry: ${answers.industry} · Function: ${answers.businessFunction}
Problem: ${discovery.problemStatement || ''}
Primary outcome: ${outcome.primaryOutcome || ''}
Required capabilities: ${(answers.capabilities || []).join(', ')}
AI action autonomy: ${answers.actionAutonomy}
Multi-agent need: ${answers.multiAgentNeed}
Traceability: ${answers.traceabilityNeed}
Preferred UX: ${answers.userExperience}
Deployment: ${answers.deploymentModel}

Return:
{
  "recommendedPattern": "pattern name e.g. RAG + Agentic AI with Human-in-the-Loop",
  "patternRationale": "why this pattern fits this specific scenario",
  "capabilityMap": [
    {
      "capability": "capability name",
      "pattern": "RAG or Agentic or API or Streaming or Classification",
      "priority": "Core or Supporting or Future",
      "rationale": "why this capability is needed",
      "implementation": "specific technology or approach"
    }
  ],
  "agentDesign": {
    "multiAgent": true,
    "agentRoles": ["Agent role 1", "Agent role 2"],
    "orchestrationPattern": "sequential or parallel or hierarchical",
    "humanInLoop": "where human oversight is required"
  },
  "uxRecommendation": {
    "interface": "recommended interface type",
    "keyInteractions": ["interaction 1", "interaction 2"],
    "accessControl": "how access is managed"
  },
  "capabilityGaps": ["gap 1 — what needs to be built or acquired"]
}

Include 4-6 capabilities in the map. Be specific to the ${answers.industry} use case.`;
  },

  async run(apiKey, answers, prior) {
    const raw = await window.ApiClient.call(apiKey, this.buildPrompt(answers, prior), this.tokens);
    return window.ApiClient.parseJSON(raw);
  },
};
