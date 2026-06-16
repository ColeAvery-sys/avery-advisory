import { createResearchGate } from "./researchInstituteSafety";

const outcomeRecords: any[] = [];

export function createOutcomeRecord(record: any) {
  const stored = { ...record, id: record.id || `outcome-${outcomeRecords.length + 1}`, claimBoundary: "Observed outcome only; no medical efficacy claim." };
  outcomeRecords.push(stored);
  return stored;
}

export function calculateOutcomeSummary(programId: string) {
  const records = outcomeRecords.filter((record) => record.programId === programId);
  return {
    programId,
    recordCount: records.length,
    taskCompletionAverage: average(records.map((record) => Number(record.taskCompletion || 0))),
    satisfactionAverage: average(records.map((record) => Number(record.userSatisfaction || 0))),
    retentionAverage: average(records.map((record) => Number(record.retention || 0))),
    observedOnly: true,
    ...createResearchGate("Outcome summary", ["Outcome reports cannot make medical efficacy claims."]),
  };
}

export function generateOutcomeReport(programId: string) {
  const summary = calculateOutcomeSummary(programId);
  return {
    ...summary,
    sections: ["Context", "Observed measures", "Participant feedback", "Limitations", "Next research steps"],
    prohibitedClaims: ["medical efficacy", "diagnosis", "treatment", "guaranteed improvement"],
  };
}

function average(values: number[]) {
  const filtered = values.filter((value) => value > 0);
  return filtered.length ? Math.round((filtered.reduce((sum, value) => sum + value, 0) / filtered.length) * 10) / 10 : 0;
}
