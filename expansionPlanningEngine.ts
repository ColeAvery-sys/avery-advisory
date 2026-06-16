import { createHqGate, detectHqRisks, hqBeforeEmpireStatus } from "./physicalHqSafety";

const expansionPlans: any[] = [];

export function createExpansionPlan(plan: any) {
  const stored = { ...plan, id: plan.id || `expansion-${expansionPlans.length + 1}`, hqBeforeEmpire: hqBeforeEmpireStatus(plan), riskFlags: detectHqRisks(plan) };
  expansionPlans.push(stored);
  return stored;
}

export function evaluateExpansionReadiness(plan: any) {
  const gate = hqBeforeEmpireStatus(plan);
  return {
    planName: plan.planName,
    ready: !gate.blockedFromExpansion && !gate.revenueRequired && !gate.teamRequired && !gate.capacityNeedRequired,
    hqBeforeEmpire: gate,
    recommendation: gate.blockedFromExpansion ? "Do not expand. Revenue, team, and capacity evidence must come first." : "Prepare staged expansion plan for Cole review.",
    ...createHqGate("Expansion readiness", detectHqRisks(plan).concat(["Expansion requires Cole approval."])),
  };
}

export function generateExpansionRecommendations() {
  return expansionPlans.map(evaluateExpansionReadiness);
}

export function generateCapacityReport(data: any) {
  return {
    staffCapacity: data.staffCapacity || "Unknown",
    equipmentCapacity: data.equipmentCapacity || "Unknown",
    revenueCapacity: data.revenueCapacity || "Unknown",
    spaceCapacity: data.spaceCapacity || "Unknown",
    recommendation: Number(data.currentCapacityUse || 0) >= 80 ? "Capacity pressure exists; verify revenue and team readiness before expansion." : "Keep optimizing current space.",
  };
}
