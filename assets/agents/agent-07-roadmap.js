/**
 * agent-07-roadmap.js
 * Roadmap Agent — 30/60/90 day delivery roadmap, milestones, dependencies, resource requirements.
 * Receives: All prior agent results (01-06).
 * Output is the Roadmap tab content.
 */
window.Agent07Roadmap = {
  id:      'roadmap',
  name:    'Roadmap Agent',
  icon:    'ti-map',
  color:   'var(--gold)',
  mission: '30/60/90 day roadmap · milestones · dependencies',
  tokens:  2500,

  buildPrompt(answers, prior) {
    const discovery    = prior['discovery']    || {};
    const outcome      = prior['outcome']      || {};
    const capability   = prior['capability']   || {};
    const architecture = prior['architecture'] || {};
    const governance   = prior['governance']   || {};
    const data         = prior['data']         || {};

    return `You are a Senior Technical Program Manager with 20+ years of enterprise AI delivery experience.
Design a realistic 30/60/90 day delivery roadmap. Account for data remediation, governance setup, and team capability gaps.
Return ONLY raw JSON — no markdown, no backticks. Start with { end with }. All string values ONE LINE, max 25 words.

CONTEXT:
Industry: ${answers.industry} · Urgency: ${answers.urgency}
Internal capability: ${answers.internalCapability}
Program complexity: ${answers.programComplexity}
Need TPM: ${answers.needTpm}
Operating model owner: ${answers.operatingOwner}
Architecture pattern: ${architecture.architecturePattern || ''}
Data readiness: ${data.dataReadinessAssessment?.overall || 'Unknown'}
Data gaps: ${(data.dataReadinessAssessment?.gaps || []).join(', ')}
Governance maturity: ${answers.governanceMaturity}
Top risks: ${(governance.riskRegister || []).slice(0,3).map(r=>r.risk).join(', ')}
Expected outcome: ${outcome.primaryOutcome || ''}

Return:
{
  "roadmap": [
    {
      "phase": "Phase 1 — Foundation",
      "duration": "Days 1–30",
      "theme": "one-word theme e.g. Foundation or Build or Scale",
      "objectives": ["objective 1", "objective 2", "objective 3"],
      "deliverables": ["deliverable 1", "deliverable 2"],
      "milestone": "milestone statement — what is demonstrable at phase end",
      "dependencies": ["dependency 1", "dependency 2"],
      "resources": ["resource or role needed"],
      "risks": ["risk specific to this phase"]
    }
  ],
  "criticalPath": ["critical path item 1", "critical path item 2", "critical path item 3"],
  "keyDependencies": [
    { "dependency": "dependency name", "owner": "who resolves it", "blocksPhase": "Phase 1 or 2 or 3" }
  ],
  "teamStructure": {
    "coreTeam": ["role 1", "role 2", "role 3"],
    "extended": ["stakeholder role 1"],
    "tpmRequired": ${answers.needTpm === 'Yes' ? 'true' : 'false'},
    "recommendation": "one sentence team composition recommendation"
  },
  "goLiveCriteria": ["criterion 1 required for production", "criterion 2", "criterion 3"]
}

Include exactly 3 phases. Make milestones specific and demonstrable. 
Be realistic about the ${answers.programComplexity} complexity and ${answers.internalCapability} internal capability.`;
  },

  async run(apiKey, answers, prior) {
    const raw = await window.ApiClient.call(apiKey, this.buildPrompt(answers, prior), this.tokens);
    return window.ApiClient.parseJSON(raw);
  },
};
