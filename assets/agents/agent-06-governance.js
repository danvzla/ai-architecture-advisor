/**
 * agent-06-governance.js
 * Governance & Risk Agent — AI risk register, governance controls, compliance requirements.
 * Receives: Agents 01-05 results.
 * Output feeds into Agent 07 (Roadmap) for governance milestones.
 */
window.Agent06Governance = {
  id:      'governance',
  name:    'Governance Agent',
  icon:    'ti-shield-check',
  color:   'var(--green)',
  mission: 'Risk controls · compliance framework · AI governance model',
  tokens:  2500,

  buildPrompt(answers, prior) {
    const discovery    = prior['discovery']    || {};
    const architecture = prior['architecture'] || {};
    const data         = prior['data']         || {};
    return `You are a Senior AI Governance Architect and Risk Manager.
Design the AI risk register, governance controls, and compliance framework for this deployment.
Return ONLY raw JSON — no markdown, no backticks. Start with { end with }. All string values ONE LINE, max 25 words.

CONTEXT:
Industry: ${answers.industry} · Risk level: ${answers.industryRisk}
Governance maturity: ${answers.governanceMaturity}
Auditability required: ${answers.auditability}
Top risks identified: ${(answers.topRisks || []).join(', ')}
Sensitive data: ${answers.sensitiveData}
Access control: ${answers.accessControl}
AI autonomy: ${answers.actionAutonomy}
Traceability: ${answers.traceabilityNeed}
Architecture pattern: ${architecture.architecturePattern || ''}
Data gaps: ${(data.dataReadinessAssessment?.gaps || []).join(', ')}

Return:
{
  "riskRegister": [
    {
      "risk": "risk title",
      "category": "Security or Compliance or Technical or Operational or Ethical",
      "severity": "Critical or High or Medium or Low",
      "likelihood": "High or Medium or Low",
      "description": "what could go wrong and why in this specific context",
      "mitigation": "specific mitigation control for this scenario",
      "owner": "role responsible e.g. Security Architect",
      "residualRisk": "Low or Medium or High after mitigation"
    }
  ],
  "governanceControls": [
    {
      "control": "control name",
      "category": "Data or Model or Access or Audit or Ethics",
      "description": "what the control enforces",
      "implementation": "how to implement it technically"
    }
  ],
  "complianceRequirements": [
    {
      "framework": "NIST AI-RMF or OWASP LLM or EU AI Act or ISO 42001 or SOC2",
      "relevantControls": ["control 1", "control 2"],
      "priority": "Required or Recommended"
    }
  ],
  "aiGovernanceModel": {
    "approvalProcess": "how AI outputs are reviewed before use",
    "modelLifecyclePolicy": "how models are versioned, evaluated, and retired",
    "incidentResponsePlan": "what happens when the AI system fails or produces harmful output",
    "humanOversightLevel": "${answers.actionAutonomy}"
  },
  "governanceMaturityRoadmap": "what governance improvements are needed over the next 12 months"
}

Include 5-7 risks in the register and 4-5 governance controls.
Sort risks by severity (Critical first). Be specific to ${answers.industry} regulatory context.`;
  },

  async run(apiKey, answers, prior) {
    const raw = await window.ApiClient.call(apiKey, this.buildPrompt(answers, prior), this.tokens);
    return window.ApiClient.parseJSON(raw);
  },
};
