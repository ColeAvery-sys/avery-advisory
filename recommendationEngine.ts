import { createIntelligenceGate, detectStrategicRisk } from "./companyIntelligenceSafety";

export function generateCompanyRecommendations(data: any) {
  const recommendations = [
    ...recommendDoMore(data),
    ...recommendDoLess(data),
    ...recommendStop(data),
    ...recommendAutomate(data),
    ...recommendDelegate(data),
    ...recommendBuildNext(data),
  ];
  return { recommendations, ...createIntelligenceGate("Central recommendation", 0.65) };
}

export function recommendDoMore(data: any) {
  return (data.wins || []).slice(0, 3).map((win: any) => recommendation("Do More", `Repeat ${win.channel || win.offer || win.title}`, win));
}

export function recommendDoLess(data: any) {
  return (data.lowYield || []).slice(0, 3).map((item: any) => recommendation("Do Less", `Reduce ${item.title || item.channel}`, item));
}

export function recommendStop(data: any) {
  return (data.failures || []).filter((item: any) => (item.repeats || 0) >= 2).map((item: any) => recommendation("Stop", `Stop repeating ${item.title || item.pattern}`, item));
}

export function recommendAutomate(data: any) {
  return (data.repeatedTasks || []).filter((task: any) => (task.frequency || 0) >= 3).map((task: any) => recommendation("Automate", `Automate ${task.title}`, task));
}

export function recommendDelegate(data: any) {
  return (data.overloadTasks || []).map((task: any) => recommendation("Delegate", `Delegate ${task.title}`, task));
}

export function recommendBuildNext(data: any) {
  return (data.opportunities || []).slice(0, 3).map((item: any) => recommendation("Build Next", `Build ${item.recommendation || item.title}`, item));
}

export function markRecommendationApproved(recommendationId: string, approval: any) {
  return {
    recommendationId,
    approvalStatus: approval?.approvedBy === "Cole" && approval?.approvalStatus === "Approved" ? "Approved" : "Needs Cole Approval",
    approvedBy: approval?.approvedBy,
    recommendationOnly: true,
    cannotAutoChangeCompany: true,
  };
}

function recommendation(type: string, title: string, evidence: any) {
  const riskFlags = detectStrategicRisk(`${type} ${title} ${JSON.stringify(evidence)}`);
  return { type, title, evidence, approvalRequired: true, riskFlags, recommendationOnly: true };
}
