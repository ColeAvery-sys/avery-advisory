export function createAgentGate(actionType: string, riskFlags: string[] = []) {
  return {
    actionType,
    riskFlags,
    approvalStatus: riskFlags.length ? "Cole Approval Required" : "Draft",
    recommendationOnly: true,
    humanSovereigntyRequired: true,
  };
}

export function detectAgentRisks(item: any): string[] {
  const text = JSON.stringify(item || {}).toLowerCase();
  const risks: string[] = [];
  if (/spend|budget|payment|invoice|api cost|credits|compute/.test(text)) risks.push("Agents cannot spend money or consume expensive resources without approval.");
  if (/hire|fire|discipline|contract|compensation/.test(text)) risks.push("Agents cannot make HR or contract decisions.");
  if (/publish|post|upload|send|customer-facing|public/.test(text)) risks.push("Agents cannot publish or send customer-facing work without approval.");
  if (/critical action|legal|financial|grant submission|research claim/.test(text)) risks.push("Agents cannot approve critical actions.");
  if (/conceal|hide|override human|ignore cole/.test(text)) risks.push("Human Sovereignty violation.");
  return risks;
}

export function enforceHumanSovereignty(item: any) {
  const risks = detectAgentRisks(item);
  return {
    canProceedAutonomously: risks.length === 0 && !item.requiresHumanDecision,
    coleFinalAuthority: true,
    mustExplainRecommendation: true,
    cannotConcealInformation: true,
    riskFlags: risks,
    rule: "Agents assist humans. Agents cannot override human decisions. Cole remains final authority.",
  };
}

export function scoreAgentTrust(metrics: any): number {
  const accuracy = score10(metrics.accuracy);
  const reliability = score10(metrics.reliability);
  const usefulness = score10(metrics.usefulness);
  const approvalRate = score10(metrics.approvalRate);
  const successRate = score10(metrics.successRate);
  return Math.round((accuracy * 0.25 + reliability * 0.25 + usefulness * 0.2 + approvalRate * 0.15 + successRate * 0.15) * 10);
}

export function score10(value: any): number {
  if (typeof value === "number") return Math.max(0, Math.min(10, value));
  if (/high|strong|excellent|fast|approved/i.test(value || "")) return 8;
  if (/medium|some|ok|partial/i.test(value || "")) return 5;
  if (/low|weak|poor|failed/i.test(value || "")) return 2;
  return 5;
}

export function agentLabel(agent: any): string {
  return agent.agentName || agent.name || agent.roleNeeded || agent.id || "Unnamed Agent";
}
