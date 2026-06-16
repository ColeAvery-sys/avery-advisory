import { scoreMissionAlignment } from "./missionGuardrailEngine";

export function generateOperationsPlan(data: Record<string, any>) {
  const mainMissionTasks = identifyMainMissionTasks(data);
  const distractions = identifyDistractions(data);
  return {
    mainMissionTasks,
    distractions,
    delegationPlan: createDelegationPlan(data),
    easyModeQueue: generateTodayEasyModeQueue(data),
    recommendation: createOperationsRecommendation(data),
    dailyTaskLimit: data.overloadRisk === "High" ? 3 : 5,
    safetyNote: "Creative tasks are allowed only when they support cash, ATLAS, ATLAS Assist, grants, marketing, or delivery.",
  };
}

export function identifyMainMissionTasks(data: Record<string, any>) {
  return (data.tasks || [])
    .map((task: any) => ({ task, score: scoreMissionAlignment(normalizeTask(task)) }))
    .filter((entry: any) => entry.score.shouldDoNow || entry.score.shouldScheduleLater)
    .sort((a: any, b: any) => b.score.missionAlignmentScore - a.score.missionAlignmentScore);
}

export function identifyDistractions(data: Record<string, any>) {
  return (data.tasks || [])
    .map((task: any) => ({ task, score: scoreMissionAlignment(normalizeTask(task)) }))
    .filter((entry: any) => entry.score.shouldArchive || entry.score.distractionRisk === "High");
}

export function createDelegationPlan(data: Record<string, any>) {
  return (data.tasks || []).filter((task: any) => /editing|clip|qc|contractor|asset/i.test(task.title || task.category || "")).map((task: any, index: number) => ({
    id: `delegation-${index + 1}`,
    taskTitle: task.title,
    suggestedRole: /editing|clip/.test(task.title || "") ? "Editor" : "Contractor",
    approvalRequired: true,
    reason: "Outsourced work requires Cole approval before assignment or payment.",
  }));
}

export function generateTodayEasyModeQueue(data: Record<string, any>) {
  return (data.decisions || []).slice(0, data.overloadRisk === "High" ? 3 : 5).map((decision: any, index: number) => ({ id: decision.id || `easy-${index + 1}`, problemTitle: decision.title, riskLevel: decision.riskLevel || "Medium" }));
}

export function createOperationsRecommendation(data: Record<string, any>): string {
  if (data.overloadRisk === "High") return "Use Easy Mode and keep today to three decisions: cash, client delivery, and ATLAS infrastructure.";
  const main = identifyMainMissionTasks(data)[0];
  return main ? `Do first: ${main.task.title}.` : "Create one cash-flow task and one ATLAS infrastructure task before creative exploration.";
}

function normalizeTask(task: any) {
  return {
    title: task.title || "Untitled",
    description: task.description || "",
    category: task.category || "",
    fastCashPotential: task.fastCashPotential || 0,
    atlasHqValue: task.atlasHqValue || 0,
    atlasAssistValue: task.atlasAssistValue || 0,
    grantFundingValue: task.grantFundingValue || 0,
    salesMarketingValue: task.salesMarketingValue || 0,
    clientDeliveryValue: task.clientDeliveryValue || 0,
    creativeAssetValue: task.creativeAssetValue || 0,
    distractionRisk: task.distractionRisk || 0,
    timeCost: task.timeCost || 5,
    overwhelmCost: task.overwhelmCost || 5,
  };
}
