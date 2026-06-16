import { scoreAgentTrust } from "./agentCivilizationSafety";

const reputations: any[] = [];

export function createAgentReputation(agentId: string, metrics: any) {
  const stored = { agentId, metrics, trustScore: scoreAgentTrust(metrics), responsibilityLevel: classifyResponsibility(scoreAgentTrust(metrics)) };
  reputations.push(stored);
  return stored;
}

export function updateAgentReputation(agentId: string, metrics: any) {
  const reputation = reputations.find((item) => item.agentId === agentId);
  if (!reputation) return createAgentReputation(agentId, metrics);
  reputation.metrics = { ...reputation.metrics, ...metrics };
  reputation.trustScore = scoreAgentTrust(reputation.metrics);
  reputation.responsibilityLevel = classifyResponsibility(reputation.trustScore);
  return reputation;
}

export function classifyResponsibility(score: number) {
  if (score >= 85) return "More Responsibility";
  if (score >= 60) return "Normal Oversight";
  return "More Oversight";
}

export function rankAgentReputations() {
  return reputations.slice().sort((a, b) => b.trustScore - a.trustScore);
}
