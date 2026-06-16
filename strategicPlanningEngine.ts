import { label, pickTop } from "./executiveSafety";

export function generateStrategicPlan(data: any) {
  return {
    planType: data.planType || "90 day plan",
    focus: pickTop(data.priorities || [], 3).map(label),
    growthPlan: generateGrowthPlan(data),
    hiringPlan: generateHiringPlan(data),
    fundingPlan: generateFundingPlan(data),
    mediaPlan: generateMediaPlan(data),
    productPlan: generateProductPlan(data),
    recommendation: "Keep strategy constrained: one cash engine, one ATLAS system, one AveryTech funding/product move, one media lane.",
  };
}

export function generateGrowthPlan(data: any) {
  return ["Grow Creator Logistics revenue", "Convert warm leads", "Capture newsletter/community demand"].concat(data.growthMoves || []).slice(0, 5);
}

export function generateHiringPlan(data: any) {
  return (data.hiringNeeds || ["first editor"]).map((need: string) => ({ role: need, trigger: "Hire only when revenue or delivery bottleneck justifies it.", approvalRequired: true }));
}

export function generateFundingPlan(data: any) {
  return ["Prepare grant packet", "Collect pilot/user evidence", "Maintain funder follow-up queue"].concat(data.fundingMoves || []).slice(0, 5);
}

export function generateMediaPlan(data: any) {
  return ["New Prometheus authority content", "Creator Logistics sales clips", "AveryTech demo proof"].concat(data.mediaMoves || []).slice(0, 5);
}

export function generateProductPlan(data: any) {
  return ["Stabilize ATLAS HQ", "Advance ATLAS Assist MVP", "Keep product demos QA-ready"].concat(data.productMoves || []).slice(0, 5);
}

