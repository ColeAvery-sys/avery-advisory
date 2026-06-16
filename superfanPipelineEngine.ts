import { engagementScore, requireApprovalDraft } from "./audienceSafety";

const pipeline: any[] = [];

const STAGES = ["Viewer", "Follower", "Subscriber", "Newsletter", "Community Member", "Supporter", "Superfan", "Advocate"];

export function createSuperfanRecord(record: any) {
  const score = engagementScore(record);
  const stored = { ...record, score, stage: record.stage || recommendSuperfanStage(score) };
  pipeline.push(stored);
  return stored;
}

export function recommendSuperfanStage(score: number): string {
  if (score >= 90) return "Advocate";
  if (score >= 75) return "Superfan";
  if (score >= 60) return "Supporter";
  if (score >= 45) return "Community Member";
  if (score >= 30) return "Newsletter";
  if (score >= 15) return "Subscriber";
  return "Viewer";
}

export function advanceSuperfanStage(recordId: string, approval?: { approvedByCole?: boolean }) {
  const record = findRecord(recordId);
  const index = STAGES.indexOf(record.stage);
  if (index < 0 || index === STAGES.length - 1) return record;
  if (index >= 4 && (!approval || !approval.approvedByCole)) throw new Error("Cole approval required before inviting high-value community members into supporter/superfan actions.");
  record.stage = STAGES[index + 1];
  return record;
}

export function generateSuperfanAction(recordId: string, actionType: string) {
  const record = findRecord(recordId);
  return { ...requireApprovalDraft(actionType, record.name || record.username), stage: record.stage, allowedActions: ["invite to survey", "invite to beta", "invite to community", "invite to event", "invite to launch"] };
}

export function identifyAdvocates(data: any) {
  return (data.records || pipeline).filter((record: any) => /advocate|superfan/i.test(record.stage || ""));
}

function findRecord(recordId: string) {
  const record = pipeline.find((entry) => entry.id === recordId || entry.recordId === recordId);
  if (!record) throw new Error(`Superfan record ${recordId} not found.`);
  return record;
}

