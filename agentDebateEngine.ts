export type AgentPosition = {
  agentName: string;
  departmentPerspective: string;
  recommendation: string;
  opportunities: string[];
  risks: string[];
  confidence: number;
  reasoning: string;
};

export type AgentDebate = {
  id: string;
  decisionQuestion: string;
  context: string;
  participatingAgents: string[];
  agentPositions: AgentPosition[];
  risksRaised: string[];
  opportunitiesRaised: string[];
  consensusRecommendation?: string;
  dissentingViews: string[];
  confidence: number;
  finalDecisionNeeded: boolean;
  approvalRequired: boolean;
  status: "Draft" | "In Review" | "Consensus Generated" | "Sent to Cole" | "Archived";
};

const debates: AgentDebate[] = [];

export function createDebate(decisionQuestion: string, context: string, participatingAgents: string[]): AgentDebate {
  const debate = { id: `debate-${debates.length + 1}`, decisionQuestion, context, participatingAgents, agentPositions: [], risksRaised: [], opportunitiesRaised: [], dissentingViews: [], confidence: 0, finalDecisionNeeded: true, approvalRequired: /hire|contract|money|legal|client|grant|public|pay/i.test(decisionQuestion), status: "Draft" as const };
  debates.push(debate);
  return debate;
}

export function addAgentPosition(debateId: string, agentName: string, position: Omit<AgentPosition, "agentName">): AgentDebate {
  const debate = findDebate(debateId);
  debate.agentPositions.push({ agentName, ...position });
  debate.risksRaised = debate.agentPositions.reduce<string[]>((all, item) => all.concat(item.risks), []);
  debate.opportunitiesRaised = debate.agentPositions.reduce<string[]>((all, item) => all.concat(item.opportunities), []);
  debate.status = "In Review";
  return debate;
}

export function generateConsensusRecommendation(debateId: string): AgentDebate {
  const debate = findDebate(debateId);
  const averageConfidence = debate.agentPositions.reduce((sum, item) => sum + item.confidence, 0) / Math.max(1, debate.agentPositions.length);
  debate.confidence = Math.round(averageConfidence * 100) / 100;
  debate.dissentingViews = debate.agentPositions.filter((item) => item.confidence < 0.55 || item.risks.length > 0).map((item) => `${item.agentName}: ${item.reasoning}`);
  debate.consensusRecommendation = `Consensus: ${debate.agentPositions[0]?.recommendation || "Need more review"}. Risks: ${debate.risksRaised.join(", ") || "none logged"}.`;
  debate.status = "Consensus Generated";
  return debate;
}

export function saveDebateToDecisionHistory(debateId: string) {
  const debate = findDebate(debateId);
  return { decisionTitle: debate.decisionQuestion, context: debate.context, recommendationGiven: debate.consensusRecommendation, approvalRequired: debate.approvalRequired };
}

export function createActionItemsFromDebate(debateId: string) {
  const debate = findDebate(debateId);
  return debate.agentPositions.map((position) => ({ title: `${position.agentName}: ${position.recommendation}`, requiresColeApproval: debate.approvalRequired }));
}

export function clearDebatesForDemo(): void {
  debates.length = 0;
}

function findDebate(debateId: string): AgentDebate {
  const debate = debates.find((item) => item.id === debateId);
  if (!debate) throw new Error(`Debate ${debateId} not found.`);
  return debate;
}
