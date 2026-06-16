export type ObjectionRecord = {
  id: string;
  objection: string;
  category: string;
  recommendedResponse?: string;
  shortResponse?: string;
  confidentResponse?: string;
  softResponse?: string;
  proofToUse?: string[];
  offerAdjustment?: string;
  riskWarning?: string;
  approvalStatus: "Draft" | "Needs Cole Approval" | "Approved";
};

const objections: ObjectionRecord[] = [];

export function createObjectionRecord(objection: ObjectionRecord): ObjectionRecord {
  const stored = { ...objection, riskWarning: objection.riskWarning || flagRiskyObjection(objection).join("; "), approvalStatus: "Needs Cole Approval" as const };
  objections.push(stored);
  return stored;
}

export function generateObjectionResponse(objection: ObjectionRecord, context: Record<string, any>) {
  const response = `That makes sense. ${context.offer || "This offer"} should only move forward if the scope, budget, and expected value are clear. We do not guarantee growth, but we can define a practical next step for review.`;
  return {
    recommendedResponse: response,
    shortResponse: "Totally fair. We can scope a smaller next step and review from there.",
    confidentResponse: response,
    softResponse: "No pressure. I can send a simple summary if that helps.",
    approvalRequired: true,
    riskWarnings: flagRiskyObjection(objection),
  };
}

export function getObjectionsByCategory(category: string): ObjectionRecord[] {
  return objections.filter((objection) => objection.category === category);
}

export function attachProofToObjection(objectionId: string, proofId: string): ObjectionRecord {
  const objection = findObjection(objectionId);
  objection.proofToUse = (objection.proofToUse || []).concat(proofId);
  return objection;
}

export function saveWinningResponse(objectionId: string, response: string): ObjectionRecord {
  const objection = findObjection(objectionId);
  objection.recommendedResponse = response;
  objection.approvalStatus = "Needs Cole Approval";
  return objection;
}

export function flagRiskyObjection(objection: ObjectionRecord): string[] {
  const text = `${objection.objection} ${objection.category} ${objection.offerAdjustment || ""}`.toLowerCase();
  const flags: string[] = [];
  if (/guarantee|results|growth/.test(text)) flags.push("Do not guarantee growth.");
  if (/discount|price|cheap|budget/.test(text)) flags.push("Pricing changes require Cole approval.");
  return flags;
}

export function clearObjectionsForDemo(): void {
  objections.length = 0;
}

function findObjection(objectionId: string): ObjectionRecord {
  const objection = objections.find((entry) => entry.id === objectionId);
  if (!objection) throw new Error(`Objection ${objectionId} not found.`);
  return objection;
}
