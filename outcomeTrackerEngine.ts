export type OutcomeResultType =
  | "Won Money"
  | "Lost Money"
  | "Saved Time"
  | "Wasted Time"
  | "Got Response"
  | "No Response"
  | "Grant Progress"
  | "Grant Rejected"
  | "Client Won"
  | "Client Lost"
  | "Product Progress"
  | "Product Blocked"
  | "Personal Stability Improved"
  | "Personal Stability Hurt";

export type OutcomeRecord = {
  id: string;
  relatedDecision?: string;
  relatedTask?: string;
  relatedCampaign?: string;
  relatedGrant?: string;
  relatedClient?: string;
  relatedProduct?: string;
  actionTaken: string;
  expectedOutcome: string;
  actualOutcome: string;
  resultType: OutcomeResultType;
  revenueImpact: number;
  timeCost: number;
  emotionalCost: number;
  strategicValue: number;
  whatWorked: string;
  whatFailed: string;
  whatToRepeat: string;
  whatToAvoid: string;
  dateMeasured: string;
};

const outcomes: OutcomeRecord[] = [];

export function createOutcomeRecord(outcome: OutcomeRecord): OutcomeRecord {
  outcomes.push(outcome);
  return outcome;
}

export function linkOutcomeToTask(outcomeId: string, taskId: string): OutcomeRecord {
  const outcome = findOutcome(outcomeId);
  outcome.relatedTask = taskId;
  return outcome;
}

export function linkOutcomeToCampaign(outcomeId: string, campaignId: string): OutcomeRecord {
  const outcome = findOutcome(outcomeId);
  outcome.relatedCampaign = campaignId;
  return outcome;
}

export function calculateOutcomeImpact(outcome: OutcomeRecord): { score: number; explanation: string } {
  const score = outcome.revenueImpact / 100 + outcome.strategicValue * 10 - outcome.timeCost * 2 - outcome.emotionalCost * 3;
  return {
    score: Math.round(score * 10) / 10,
    explanation: "Impact balances revenue, strategic value, time cost, and emotional cost without exaggerating positive results.",
  };
}

export function generateLessonFromOutcome(outcomeId: string): string {
  const outcome = findOutcome(outcomeId);
  return `Action: ${outcome.actionTaken}. Result: ${outcome.resultType}. Repeat: ${outcome.whatToRepeat || outcome.whatWorked}. Avoid: ${outcome.whatToAvoid || outcome.whatFailed}.`;
}

export function getOutcomesByResultType(resultType: OutcomeResultType): OutcomeRecord[] {
  return outcomes.filter((outcome) => outcome.resultType === resultType);
}

export function getRevenueImpactSummary(): { totalRevenueImpact: number; positiveOutcomes: number; negativeOutcomes: number } {
  return {
    totalRevenueImpact: outcomes.reduce((total, outcome) => total + outcome.revenueImpact, 0),
    positiveOutcomes: outcomes.filter((outcome) => outcome.revenueImpact > 0).length,
    negativeOutcomes: outcomes.filter((outcome) => outcome.revenueImpact < 0).length,
  };
}

export function clearOutcomesForDemo(): void {
  outcomes.length = 0;
}

function findOutcome(outcomeId: string): OutcomeRecord {
  const outcome = outcomes.find((item) => item.id === outcomeId);
  if (!outcome) throw new Error(`Outcome ${outcomeId} not found.`);
  return outcome;
}
