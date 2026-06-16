/**
 * financial.js
 * TCO / ROI / NPV / Payback / COI financial model.
 * Pure functions — no API calls, no DOM.
 * Called before Agent 08 so the numbers are passed into the CFO narrative prompt.
 */
window.FinancialModel = {

  /**
   * Calculate full financial model from wizard answers.
   * @param {object} answers - wizard answers (valueEngineering step)
   * @returns {object} all financial metrics
   */
  calculate(answers) {
    const volume   = Number(answers.annualVolume          || 0);
    const effHours = Number(answers.manualEffortMinutes   || 0) / 60;
    const labor    = Number(answers.laborRate             || 0);
    const errRate  = Number(answers.errorRate             || 0) / 100;
    const costErr  = Number(answers.costPerError          || 0);
    const delay    = Number(answers.delayCostAnnual       || 0);
    const prod     = Number(answers.productivityImprovement || 0) / 100;
    const risk     = Number(answers.riskReduction         || 0) / 100;
    const impl     = Number(answers.implementationCost    || 0);
    const opex     = Number(answers.annualOperatingCost   || 0);
    const yrs      = Number(answers.evaluationYears       || 3);
    const disc     = Number(answers.discountRate          || 8) / 100;

    // Current-state costs
    const laborCost   = volume * effHours * labor;
    const reworkCost  = volume * errRate  * costErr;
    const currentState = laborCost + reworkCost + delay;

    // Benefits
    const laborSave  = laborCost  * prod;
    const reworkSave = reworkCost * risk;
    const delaySave  = delay      * Math.min(0.45, prod * 0.65 + risk * 0.35);
    const grossBenefit = laborSave + reworkSave + delaySave;
    const netBenefit   = grossBenefit - opex;

    // Investment metrics
    const tco          = impl + opex * yrs;
    const cumNet       = netBenefit * yrs - impl;
    const roi          = tco > 0 ? (cumNet / tco) * 100 : 0;
    const payback      = netBenefit > 0 ? (impl / netBenefit) * 12 : Infinity;

    // NPV
    let npv = -impl;
    for (let y = 1; y <= yrs; y++) npv += netBenefit / Math.pow(1 + disc, y);

    // Cost of inaction
    const coi = currentState * yrs;

    // Sensitivity
    const sensitivity = {
      low:  grossBenefit * 0.65,
      mid:  grossBenefit,
      high: grossBenefit * 1.25,
    };

    return {
      // Inputs (for display)
      volume, effHours, labor, errRate, costErr, delay,
      prod, risk, impl, opex, yrs, disc,
      // Current state
      laborCost, reworkCost, currentState,
      // Benefits
      laborSave, reworkSave, delaySave, grossBenefit, netBenefit,
      // Investment
      tco, cumNet, roi, payback, npv, coi,
      // Sensitivity
      sensitivity,
    };
  },

  /** Format as USD with no decimals */
  currency(n) {
    if (n == null || !isFinite(n)) return '$0';
    return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  },

  /** Format as percentage */
  percent(n) { return `${Math.round(n || 0)}%`; },

  /** Format as months */
  months(n) { return isFinite(n) ? `${Math.round(n)} mo` : 'N/A'; },
};
