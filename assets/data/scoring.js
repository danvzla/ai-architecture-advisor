/**
 * scoring.js
 * AI Readiness Scoring Engine.
 * Pure functions — no API calls, no DOM. Only depends on wizard answers.
 */
window.ScoringEngine = {

  SCORE_MAP: {
    currentAiState: { '1': 10, '2': 25, '3': 40, '4': 50, '5': 70, '6': 85 },
    dataQuality:    { 'Unknown': 15, 'Fragmented': 35, 'Partially governed': 65, 'Well governed': 90 },
    governanceMaturity: { 'None': 15, 'Informal': 35, 'Defined': 70, 'Mature': 90 },
    internalCapability: { 'Low': 30, 'Medium': 60, 'High': 85 },
    accessControl:  { 'Open': 35, 'Role-based': 60, 'Strict RBAC/ABAC': 80, 'Regulated evidence required': 85 },
  },

  PLATFORM_READY: ['Hybrid', 'Private AI', 'Azure OpenAI', 'AWS Bedrock', 'Google Vertex AI'],

  /**
   * Calculate all six dimension scores + overall.
   * @param {object} answers - wizard answers
   * @returns {{ business, data, governance, delivery, security, platform, overall }}
   */
  calculate(answers) {
    const sm = this.SCORE_MAP;
    const business    = sm.currentAiState[answers.currentAiState]    || 40;
    const data        = sm.dataQuality[answers.dataQuality]          || 35;
    const governance  = sm.governanceMaturity[answers.governanceMaturity] || 35;
    const delivery    = sm.internalCapability[answers.internalCapability] || 50;
    const security    = sm.accessControl[answers.accessControl]      || 50;
    const platform    = this.PLATFORM_READY.includes(answers.deploymentModel) ? 70 : 45;
    const overall     = Math.round((business + data + governance + delivery + security + platform) / 6);
    return { business, data, governance, delivery, security, platform, overall };
  },

  /**
   * Run a validation pass and return warnings for the overview tab.
   * @param {object} answers
   * @returns {string[]} array of warning messages
   */
  validate(answers) {
    const warnings = [];
    if ((answers.capabilities || []).length < 3)
      warnings.push('Capability scope is light — confirm target use cases before architecture.');
    if (!['Partially governed', 'Well governed'].includes(answers.dataQuality))
      warnings.push('Data quality is not ready for production RAG without remediation.');
    if (!['Defined', 'Mature'].includes(answers.governanceMaturity))
      warnings.push('AI governance is immature — define policy, risk, and approval controls before production.');
    if (!['Strict RBAC/ABAC', 'Regulated evidence required'].includes(answers.accessControl))
      warnings.push('Access-control model requires further definition for this deployment.');
    if (answers.actionAutonomy === 'Autonomous high-risk actions')
      warnings.push('High-risk autonomous actions should be blocked until controls are validated.');
    return warnings;
  },

  /**
   * Return the readiness band label and recommended next step.
   * @param {number} score
   * @returns {{ label, band, nextStep }}
   */
  interpret(score) {
    if (score <= 35) return { label: 'Not ready',      band: 'red',    nextStep: 'AI Readiness Assessment' };
    if (score <= 55) return { label: 'Emerging',       band: 'amber',  nextStep: 'AI Strategy & Roadmap' };
    if (score <= 70) return { label: 'Moderate',       band: 'indigo', nextStep: 'Governance Framework + Embedded TPM' };
    if (score <= 85) return { label: 'Ready to scale', band: 'green',  nextStep: 'Platform Design + Deployment' };
    return              { label: 'Mature',             band: 'teal',   nextStep: 'Technical Advisory Retainer' };
  },
};
