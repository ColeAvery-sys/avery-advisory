export type LeadInput = {
  leadName: string;
  organization?: string;
  source?: string;
  interestType: string;
  budgetRange?: string;
  urgency: number;
  painLevel: number;
  fitScore: number;
  abilityToPay: number;
  decisionMakerStatus?: string;
  timeline?: string;
  relationshipWarmth: number;
  strategicValue: number;
  riskFlags?: string[];
};

export function scoreLead(lead: LeadInput) {
  const budgetScore = scoreBudget(lead.budgetRange);
  const authorityScore = /owner|founder|decision|buyer|director/i.test(lead.decisionMakerStatus || "") ? 10 : 5;
  const timelineScore = /today|urgent|week|soon|now|7/i.test(lead.timeline || "") ? 10 : /month|30/i.test(lead.timeline || "") ? 7 : 4;
  const complexityPenalty = (lead.riskFlags || []).filter((flag) => /legal|medical|financial|unclear|scope/i.test(flag)).length * 6;
  const score = clamp(
    budgetScore * 0.16 +
      lead.urgency * 8 * 0.13 +
      lead.painLevel * 8 * 0.15 +
      lead.fitScore * 8 * 0.16 +
      lead.abilityToPay * 8 * 0.13 +
      authorityScore * 8 * 0.08 +
      timelineScore * 8 * 0.08 +
      lead.relationshipWarmth * 8 * 0.06 +
      lead.strategicValue * 8 * 0.05 -
      complexityPenalty,
  );
  const reviewFlags = (lead.riskFlags || []).filter((flag) => /legal|medical|financial/i.test(flag));

  return {
    score,
    leadQuality: qualityForScore(score, lead),
    recommendedOffer: recommendOffer(lead),
    nextBestAction: reviewFlags.length ? "Escalate for review before any client-facing message." : "Draft a discovery message for Cole approval.",
    suggestedMessage: `Draft only: ask ${lead.leadName} about budget, timeline, decision maker, and success criteria. Cole approval required before sending.`,
    riskFlags: reviewFlags.length ? reviewFlags.concat(["Requires Cole review"]) : lead.riskFlags || [],
    reasoning: [
      "Budget, urgency, pain, fit, warmth, authority, and timeline drive the score.",
      "Creator Logistics cash leads rank higher when budget, pain, and urgency are strong.",
      "No automatic contact is allowed.",
    ],
  };
}

function scoreBudget(budgetRange?: string): number {
  if (!budgetRange) return 40;
  const text = budgetRange.toLowerCase();
  if (/3000|3500|5000|\$2,000|2000/.test(text)) return 100;
  if (/1500|1000|750|\$750/.test(text)) return 80;
  if (/500|250/.test(text)) return 55;
  if (/unclear|unknown|not sure/.test(text)) return 35;
  return 50;
}

function recommendOffer(lead: LeadInput): string {
  const text = `${lead.interestType} ${lead.budgetRange || ""}`.toLowerCase();
  if (/atlas assist|clinic|partner|pilot/.test(text)) return lead.strategicValue >= 8 ? "Partner Potential" : "ATLAS Assist pilot conversation";
  if (/creator|clips|content/.test(text)) {
    if (/2000|3500|operator|monthly/.test(text)) return "Creator Logistics Operator";
    if (/750|1500|growth|20|40/.test(text)) return "Creator Logistics Growth";
    return "Creator Logistics Starter";
  }
  if (/consult|system|automation/.test(text)) return "Consulting / Systems Setup";
  return "Discovery call";
}

function qualityForScore(score: number, lead: LeadInput): string {
  if ((lead.riskFlags || []).some((flag) => /do not contact|bad fit/i.test(flag))) return "Do Not Pursue";
  if (score >= 70) return "Hot";
  if (score >= 65) return "Warm";
  if (score >= 45) return lead.strategicValue >= 8 ? "Partner Potential" : "Maybe";
  if (score >= 25) return "Low Fit";
  return "Do Not Pursue";
}

function clamp(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}
