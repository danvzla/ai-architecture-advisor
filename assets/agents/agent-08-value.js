/**
 * agent-08-value.js
 * Value Engineering Agent — CFO narrative, investment justification, executive summary.
 * The financial model numbers (TCO/ROI/NPV) are calculated by financial.js, not by AI.
 * This agent writes the narrative layer on top of those numbers.
 * Receives: All prior agent results (01-07) + pre-calculated financials.
 */
window.Agent08Value = {
  id:      'value',
  name:    'Value Engineering Agent',
  icon:    'ti-chart-bar',
  color:   'var(--red)',
  mission: 'CFO narrative · investment justification · executive summary',
  tokens:  2000,

  buildPrompt(answers, prior, financials) {
    const discovery    = prior['discovery']    || {};
    const outcome      = prior['outcome']      || {};
    const governance   = prior['governance']   || {};
    const roadmap      = prior['roadmap']      || {};
    const architecture = prior['architecture'] || {};

    const f = financials || {};
    const fmt = n => n != null && isFinite(n) ? '$' + Math.round(n).toLocaleString() : 'TBD';
    const pct = n => Math.round(n || 0) + '%';
    const mos = n => isFinite(n) ? Math.round(n) + ' months' : 'N/A';

    return `You are a CFO-level AI Value Engineering Advisor.
Write a compelling, honest, and specific CFO-ready business case narrative using the financial data and context below.
Return ONLY raw JSON — no markdown, no backticks. Start with { end with }. All string values ONE LINE, max 30 words.

FINANCIAL SUMMARY (pre-calculated):
Annual gross benefit:     ${fmt(f.grossBenefit)}
Annual net benefit:       ${fmt(f.netBenefit)}
Implementation cost:      ${fmt(f.impl)}
Total TCO (${f.yrs||3} yr):       ${fmt(f.tco)}
ROI:                      ${pct(f.roi)}
Payback period:           ${mos(f.payback)}
NPV:                      ${fmt(f.npv)}
Cost of inaction (${f.yrs||3} yr): ${fmt(f.coi)}

CONTEXT:
Industry: ${answers.industry} · Company size: ${answers.companySize}
Problem: ${discovery.problemStatement || ''}
Primary outcome: ${outcome.primaryOutcome || ''}
Risk of inaction: ${outcome.riskOfInaction || ''}
Architecture: ${architecture.architecturePattern || ''}
Top risks mitigated: ${(governance.riskRegister || []).filter(r => r.severity === 'Critical').map(r => r.risk).join(', ') || 'See risk register'}
Go-live criteria: ${(roadmap.goLiveCriteria || []).join(', ') || 'See roadmap'}

Return:
{
  "executiveSummary": "3 CFO-ready sentences — situation, recommended investment, expected return",
  "cfoNarrative": "4-5 sentences connecting the financial numbers to business outcomes and risk reduction",
  "investmentJustification": {
    "primaryArgument": "the strongest single reason to invest now",
    "urgencyDriver": "why delaying increases cost or risk — be specific",
    "competitiveContext": "what peers in ${answers.industry} are doing with AI"
  },
  "sensitivityAnalysis": {
    "conservative": "what ROI looks like at 65% of projected benefits",
    "expected": "what ROI looks like at 100% of projected benefits",
    "optimistic": "what ROI looks like at 125% of projected benefits"
  },
  "recommendedDecision": "Proceed or Proceed with conditions or Defer",
  "recommendedDecisionRationale": "one sentence explaining the recommendation",
  "advisoryPath": [
    "1. Service name — why it is the right first step",
    "2. Service name — what it enables",
    "3. Service name — how it scales the investment"
  ]
}`;
  },

  async run(apiKey, answers, prior, financials) {
    const raw = await window.ApiClient.call(apiKey, this.buildPrompt(answers, prior, financials), this.tokens);
    return window.ApiClient.parseJSON(raw);
  },
};
