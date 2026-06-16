import { engagementScore, requireApprovalDraft } from "./audienceSafety";

const supporters: any[] = [];

export function createSupporterRecord(record: any) {
  const score = calculateSupporterScore(record);
  const stored = { ...record, supporterScore: score, supporterLevel: classifySupporter(score) };
  supporters.push(stored);
  return stored;
}

export function calculateSupporterScore(record: any): number {
  return engagementScore(record);
}

export function classifySupporter(score: number): string {
  if (score >= 85) return "Superfan";
  if (score >= 65) return "Supporter";
  if (score >= 45) return "Community Member";
  if (score >= 20) return "Regular";
  return "Casual Viewer";
}

export function identifySuperfans(data: any) {
  return (data.supporters || supporters).filter((supporter: any) => /superfan/i.test(supporter.supporterLevel || classifySupporter(calculateSupporterScore(supporter))));
}

export function generateSupporterActionDraft(supporterId: string, actionType: string) {
  const supporter = findSupporter(supporterId);
  return { ...requireApprovalDraft(actionType, supporter.name || supporter.username), supporterLevel: supporter.supporterLevel, note: "Do not mass-DM. Personalize and approve before sending." };
}

function findSupporter(supporterId: string) {
  const supporter = supporters.find((entry) => entry.id === supporterId || entry.supporterId === supporterId);
  if (!supporter) throw new Error(`Supporter ${supporterId} not found.`);
  return supporter;
}

