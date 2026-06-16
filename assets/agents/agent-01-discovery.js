/**
 * agent-01-discovery.js
 * Discovery Agent — Problem framing, stakeholder mapping, pain quantification.
 * First agent in the pipeline. Receives no prior results.
 * Output feeds into Agent 02 (Outcome) and Agent 04 (Architecture).
 */
window.Agent01Discovery = {
  id:      'discovery',
  name:    'Discovery Agent',
  icon:    'ti-search',
  color:   'var(--indigo)',
  mission: 'Problem framing · stakeholder mapping · pain quantification',
  tokens:  1800,

  buildPrompt(answers) {
    return `You are a Senior AI Consulting Discovery Analyst.
Analyze this enterprise discovery intake and produce a structured problem framing.
Return ONLY raw JSON — no markdown, no backticks. Start with { end with }. All string values ONE LINE, max 20 words.

INTAKE:
Industry: ${answers.industry}
Business function: ${answers.businessFunction}
Company size: ${answers.companySize}
AI maturity: Level ${answers.currentAiState} of 6
Urgency: ${answers.urgency}
Problems identified: ${(answers.primaryProblem || []).join(', ')}
Pain level: ${answers.painLevel}
Problem description: ${answers.problemDetails}
Key stakeholders: ${(answers.stakeholders || []).join(', ')}
Current cost drivers: ${(answers.currentCosts || []).join(', ')}

Return:
{
  "problemStatement": "one crisp sentence defining the core business problem",
  "rootCauses": ["root cause 1", "root cause 2", "root cause 3"],
  "stakeholderMap": [
    { "role": "CIO", "interest": "what they care about", "influence": "High" }
  ],
  "painQuantification": "sentence quantifying the cost or impact of the problem",
  "currentStateSummary": "2 sentences describing the as-is situation",
  "urgencyRating": "Critical or High or Medium or Low",
  "discoveryInsight": "the single most important insight from this discovery"
}

Include 3 root causes and 3-4 stakeholders. Be specific to ${answers.industry} / ${answers.businessFunction}.`;
  },

  async run(apiKey, answers, _prior) {
    const raw = await window.ApiClient.call(apiKey, this.buildPrompt(answers), this.tokens);
    return window.ApiClient.parseJSON(raw);
  },
};
