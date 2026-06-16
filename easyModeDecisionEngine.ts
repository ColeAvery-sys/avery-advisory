export type EasyModeOption = { label: string; description: string; riskLevel?: string; createsApprovalItem?: boolean };
export type EasyModeDecisionCard = {
  id: string;
  problemTitle: string;
  problemSummary: string;
  department: string;
  urgency: number;
  riskLevel: string;
  optionA: EasyModeOption;
  optionB: EasyModeOption;
  optionC: EasyModeOption;
  optionD: EasyModeOption;
  atlasRecommendation: "A" | "B" | "C" | "D";
  recommendationReason: string;
  infoBoxA?: string;
  infoBoxB?: string;
  infoBoxC?: string;
  infoBoxD?: string;
  yesNoFollowUps?: string[];
  selectedOption?: "A" | "B" | "C" | "D" | "Skipped" | "Archived";
  decisionLog?: Record<string, any>;
  resultingAction?: Record<string, any>;
  createdAt?: string;
};

const cards: EasyModeDecisionCard[] = [];
const logs: Array<Record<string, any>> = [];

export function createEasyModeDecisionCard(card: EasyModeDecisionCard): EasyModeDecisionCard {
  const stored = { ...card, createdAt: card.createdAt || new Date().toISOString(), infoBoxA: card.infoBoxA || card.optionA.description, infoBoxB: card.infoBoxB || card.optionB.description, infoBoxC: card.infoBoxC || card.optionC.description, infoBoxD: card.infoBoxD || card.optionD.description };
  cards.push(stored);
  return stored;
}

export function chooseEasyModeOption(cardId: string, option: "A" | "B" | "C" | "D") {
  const card = findCard(cardId);
  card.selectedOption = option;
  const selected = optionFor(card, option);
  const approvalRequired = card.riskLevel === "High" || !!selected.createsApprovalItem || /money|legal|client|public|contractor|payment/i.test(`${card.department} ${selected.label}`);
  card.resultingAction = { title: selected.label, approvalRequired, actionCenterRequired: approvalRequired };
  card.decisionLog = logEasyModeDecision(card, option);
  return card;
}

export function skipEasyModeDecision(cardId: string, reason: string) {
  const card = findCard(cardId);
  card.selectedOption = "Skipped";
  card.decisionLog = logEasyModeDecision(card, "Skipped", reason);
  return card;
}

export function archiveEasyModeDecision(cardId: string, reason: string) {
  const card = findCard(cardId);
  card.selectedOption = "Archived";
  card.decisionLog = logEasyModeDecision(card, "Archived", reason);
  return card;
}

export function getEasyModeDecisionLog() {
  return logs.slice();
}

export function generateYesNoFollowUps(card: EasyModeDecisionCard): string[] {
  return card.yesNoFollowUps && card.yesNoFollowUps.length ? card.yesNoFollowUps : ["Is this urgent today?", "Does this involve money, clients, public content, or contractor work?", "Should this go to Cole approval?"];
}

function logEasyModeDecision(card: EasyModeDecisionCard, selectedOption: string, note?: string) {
  const log = { id: `easy-log-${logs.length + 1}`, cardId: card.id, problemTitle: card.problemTitle, selectedOption, riskLevel: card.riskLevel, note, timestamp: new Date().toISOString() };
  logs.push(log);
  return log;
}

function optionFor(card: EasyModeDecisionCard, option: "A" | "B" | "C" | "D"): EasyModeOption {
  if (option === "A") return card.optionA;
  if (option === "B") return card.optionB;
  if (option === "C") return card.optionC;
  return card.optionD;
}

function findCard(cardId: string): EasyModeDecisionCard {
  const card = cards.find((entry) => entry.id === cardId);
  if (!card) throw new Error(`Easy Mode card ${cardId} not found.`);
  return card;
}
