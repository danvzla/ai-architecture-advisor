/**
 * agent-02-outcome.js
 * Outcome Agent — Translates pain into measurable business outcomes and KPIs.
 * Receives: Agent 01 (discovery) results.
 * Output feeds into Agent 07 (Roadmap) and Agent 08 (Value Engineering).
 */
window.Agent02Outcome = {
  id:      'outcome',
  name:    'Outcome Agent',
  icon:    'ti-target',
  color:   'var(--teal)',
  mission: 'Business outcomes · KPI definition · success criteria',
  tokens:  1800,

  buildPrompt(answers, prior) {
    const discovery = prior['discovery'] || {};
    return `You are a Senior AI Business Outcomes Architect.
Using the discovery framing below, define measurable business outcomes, KPIs, and adoption targets.
Return ONLY raw JSON — no markdown, no backticks. Start with { end with }. All string values ONE LINE, max 20 words.

DISCOVERY OUTPUT:
Problem: ${discovery.problemStatement || answers.problemDetails}
Root causes: ${(discovery.rootCauses || []).join(', ')}
Urgency: ${discovery.urgencyRating || answers.urgency}

DESIRED OUTCOMES:
${(answers.primaryOutcome || []).join(', ')}

SUCCESS METRICS:
${(answers.successMetric || []).join(', ')}

Impact timeframe: ${answers.impactTimeframe}
Adoption target: ${answers.adoptionTarget}
Executive priorities: ${(answers.executivePriority || []).join(', ')}

Return:
{
  "primaryOutcome": "the single most important business outcome in one sentence",
  "outcomeHierarchy": [
    { "outcome": "outcome name", "metric": "how it is measured", "target": "specific target value", "timeframe": "when" }
  ],
  "successCriteria": ["criterion 1", "criterion 2", "criterion 3"],
  "adoptionMilestones": ["milestone 1 at 30 days", "milestone 2 at 90 days"],
  "executiveValueStatement": "one sentence CFO/CEO-ready statement of expected value",
  "riskOfInaction": "what happens if nothing is done — specific business consequence"
}

Include 3-4 outcomes in hierarchy. Make targets specific and measurable. Be specific to ${answers.industry}.`;
  },

  async run(apiKey, answers, prior) {
    const raw = await window.ApiClient.call(apiKey, this.buildPrompt(answers, prior), this.tokens);
    return window.ApiClient.parseJSON(raw);
  },
};
