export type DecisionOutcomeStatus = "Pending" | "Worked" | "Partially Worked" | "Failed" | "Reversed" | "Still Unknown";
export type DecisionRecord = {
  id: string;
  decisionTitle: string;
  decisionType: string;
  department: string;
  context: string;
  optionsConsidered: string[];
  recommendationGiven: string;
  decisionMade: string;
  decidedBy: string;
  dateDecided: string;
  confidenceAtTime: number;
  expectedOutcome: string;
  actualOutcome?: string;
  outcomeStatus: DecisionOutcomeStatus;
  lessonsLearned: string[];
  relatedTasks: string[];
  relatedMoneyItems: string[];
  relatedGrants: string[];
  relatedClients: string[];
  relatedProducts: string[];
  tags: string[];
  approvalRequired?: boolean;
  approvalReason?: string;
  linkedOutcomeIds?: string[];
};

const decisions: DecisionRecord[] = [];

export function createDecisionRecord(decision: Omit<DecisionRecord, "outcomeStatus" | "lessonsLearned" | "approvalRequired" | "approvalReason" | "linkedOutcomeIds"> & Partial<Pick<DecisionRecord, "outcomeStatus" | "lessonsLearned">>): DecisionRecord {
  const approvalRequired = /money|legal|finance|funding|grant|hiring|contractor/i.test(`${decision.decisionType} ${decision.department}`);
  const record: DecisionRecord = {
    ...decision,
    outcomeStatus: decision.outcomeStatus || "Pending",
    lessonsLearned: decision.lessonsLearned || [],
    approvalRequired,
    approvalReason: approvalRequired ? "Decision involves money, legal, funding, or hiring risk." : undefined,
    linkedOutcomeIds: [],
  };
  decisions.push(record);
  return record;
}

export function linkOutcomeToDecision(decisionId: string, outcomeId: string): DecisionRecord {
  const decision = findDecision(decisionId);
  decision.linkedOutcomeIds = Array.from(new Set([...(decision.linkedOutcomeIds || []), outcomeId]));
  return decision;
}

export function updateDecisionOutcome(decisionId: string, outcomeStatus: DecisionOutcomeStatus, actualOutcome: string): DecisionRecord {
  const decision = findDecision(decisionId);
  decision.outcomeStatus = outcomeStatus;
  decision.actualOutcome = actualOutcome;
  decision.lessonsLearned.push(generateDecisionLesson(decisionId));
  return decision;
}

export function getDecisionsByType(type: string): DecisionRecord[] {
  return decisions.filter((decision) => decision.decisionType === type);
}

export function getPendingDecisions(): DecisionRecord[] {
  return decisions.filter((decision) => decision.outcomeStatus === "Pending" || decision.outcomeStatus === "Still Unknown");
}

export function generateDecisionLesson(decisionId: string): string {
  const decision = findDecision(decisionId);
  const actual = decision.actualOutcome || "Actual outcome is still unknown.";
  return `Expected: ${decision.expectedOutcome}. Actual: ${actual}. Lesson: ${decision.outcomeStatus === "Worked" ? "repeat this pattern with similar evidence" : decision.outcomeStatus === "Failed" ? "avoid repeating without changing the conditions" : "keep tracking before changing strategy"}.`;
}

export function clearDecisionsForDemo(): void {
  decisions.length = 0;
}

function findDecision(decisionId: string): DecisionRecord {
  const decision = decisions.find((item) => item.id === decisionId);
  if (!decision) throw new Error(`Decision ${decisionId} not found.`);
  return decision;
}
