import { createIntelligenceGate, detectStrategicRisk, estimateProbability } from "./companyIntelligenceSafety";

export function predictClientClose(input: any) {
  return prediction("Client close", [score(input.budgetFit), score(input.urgency), score(input.warmth), score(input.decisionMaker)]);
}

export function predictProductSales(input: any) {
  return prediction("Product sales", [score(input.audienceFit), score(input.priceFit), score(input.proof), score(input.channelDemand)]);
}

export function predictGrantApproval(input: any) {
  return prediction("Grant approval", [score(input.eligibility), score(input.deadlineReadiness), score(input.evidence), score(input.budgetCompleteness)]);
}

export function predictVideoPerformance(input: any) {
  return prediction("Video performance", [score(input.topicDemand), score(input.hookStrength), score(input.channelFit), score(input.productionReadiness)]);
}

export function predictDeadlineRisk(input: any) {
  const probability = estimateProbability([1 - score(input.timeAvailable), score(input.complexity), score(input.blockers), score(input.overwhelm)]);
  return { predictionType: "Deadline miss risk", probability, label: probability >= 0.7 ? "High Risk" : probability >= 0.4 ? "Medium Risk" : "Low Risk", approvalRequired: false, note: "Estimate only, not a guarantee." };
}

function prediction(type: string, parts: number[]) {
  const probability = estimateProbability(parts);
  return { predictionType: type, probability, label: probability >= 0.7 ? "Likely" : probability >= 0.4 ? "Uncertain" : "Unlikely", note: "Estimate only, never a guarantee.", risks: detectStrategicRisk(type), ...createIntelligenceGate(`${type} prediction`, 0.6) };
}

function score(value: any): number {
  if (typeof value === "number") return Math.max(0, Math.min(1, value));
  if (/high|yes|strong|ready|complete/i.test(value || "")) return 0.85;
  if (/medium|partial|some/i.test(value || "")) return 0.55;
  if (/low|no|weak|missing/i.test(value || "")) return 0.2;
  return 0.5;
}

