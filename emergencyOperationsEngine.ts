import { createHqGate, detectHqRisks } from "./physicalHqSafety";

const emergencyPlans: any[] = [];

export function createEmergencyPlan(plan: any) {
  const stored = { ...plan, id: plan.id || `emergency-${emergencyPlans.length + 1}`, status: plan.status || "Draft", riskFlags: detectHqRisks(plan) };
  emergencyPlans.push(stored);
  return stored;
}

export function generateResponsePlan(emergencyType: string) {
  return createEmergencyPlan({
    emergencyType,
    steps: ["Stabilize people", "Protect data/equipment", "Notify Cole", "Use manual workaround", "Log incident", "Review recovery"],
    contacts: ["Cole", "building contact", "utility/service provider"],
    ...createHqGate("Emergency response plan", ["Emergency plan requires review."]),
  });
}

export function generateRecoveryPlan(planId: string) {
  const plan = findPlan(planId);
  return {
    emergencyType: plan.emergencyType,
    recoverySteps: ["Confirm safety", "Restore critical systems", "Check backups", "Repair/replace equipment", "Resume highest-priority work"],
    approvalRequiredForSpending: true,
  };
}

export function listEmergencyContacts(planId: string) {
  return findPlan(planId).contacts || [];
}

function findPlan(planId: string) {
  const plan = emergencyPlans.find((entry) => entry.id === planId);
  if (!plan) throw new Error(`Emergency plan ${planId} not found.`);
  return plan;
}
