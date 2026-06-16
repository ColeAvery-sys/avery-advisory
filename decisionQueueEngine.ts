const decisions: any[] = [];

export function createDecisionCard(input: any) {
  const card = {
    id: input.id,
    problemTitle: input.problemTitle,
    problemSummary: input.problemSummary,
    urgency: input.urgency || "Medium",
    riskLevel: input.riskLevel || "Low",
    optionA: input.optionA,
    optionB: input.optionB,
    optionC: input.optionC,
    optionD: input.optionD,
    atlasRecommendation: input.atlasRecommendation || "C",
    recommendationReason: input.recommendationReason || "Ask for clarity before committing.",
    yesNoFollowUps: input.yesNoFollowUps || ["Is this urgent today?", "Does this involve money, clients, public action, legal, or hiring?"],
    status: "Queued",
  };
  decisions.push(card);
  return card;
}

export function getNextDecision() {
  return decisions.slice().sort((a, b) => urgencyValue(b.urgency) - urgencyValue(a.urgency))[0];
}

export function answerDecision(cardId: string, selectedOption: string) {
  const card = findDecision(cardId);
  card.selectedOption = selectedOption;
  card.status = "Answered";
  card.approvalRequired = card.riskLevel === "High" || /money|client|legal|public|hiring|payment/i.test(JSON.stringify(card));
  return card;
}

export function generateEasyModeQueue(items: any[]) {
  return items.slice(0, 5).map((item, index) => createDecisionCard({
    id: item.id || `decision-${index + 1}`,
    problemTitle: item.title || item.name,
    problemSummary: item.description || "Decision needed.",
    optionA: "Do now",
    optionB: "Schedule this week",
    optionC: "Ask for more info",
    optionD: "Archive",
    atlasRecommendation: "C",
    riskLevel: item.riskLevel || "Low",
  }));
}

function urgencyValue(value: any): number {
  if (typeof value === "number") return value;
  if (/high|urgent/i.test(value || "")) return 3;
  if (/medium/i.test(value || "")) return 2;
  return 1;
}

function findDecision(cardId: string) {
  const card = decisions.find((entry) => entry.id === cardId);
  if (!card) throw new Error(`Decision card ${cardId} not found.`);
  return card;
}

