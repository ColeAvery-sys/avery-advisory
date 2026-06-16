import { createNetworkGate } from "./atlasNetworkSafety";

export function calculateNetworkMetrics(data: any) {
  return {
    revenue: sum(data.revenue, "amount"),
    projectCompletionRate: ratio(data.completedProjects || 0, data.totalProjects || 0),
    communityGrowth: Number(data.communityGrowth || 0),
    researchProgress: ratio(data.completedResearchMilestones || 0, data.totalResearchMilestones || 0),
    clientSatisfaction: Number(data.clientSatisfaction || 0),
    teamUtilization: Number(data.teamUtilization || 0),
    automationImpact: Number(data.automationImpact || 0),
    ...createNetworkGate("Network analytics"),
  };
}

export function generateNetworkAnalyticsReport(data: any) {
  const metrics = calculateNetworkMetrics(data);
  return {
    metrics,
    insights: generateInsights(metrics),
    recommendation: metrics.revenue > 0 && metrics.projectCompletionRate >= 0.7 ? "Scale carefully from proven revenue and delivery capacity." : "Improve revenue and completion consistency before scaling.",
  };
}

export function identifyNetworkBottlenecks(data: any) {
  const bottlenecks: string[] = [];
  if ((data.pendingApprovals || 0) > 5) bottlenecks.push("Approval backlog");
  if ((data.overdueProjects || 0) > 3) bottlenecks.push("Project delivery");
  if ((data.teamUtilization || 0) > 90) bottlenecks.push("Team overload");
  if ((data.cashRisk || 0) > 70) bottlenecks.push("Cash risk");
  return bottlenecks;
}

function generateInsights(metrics: any) {
  const insights: string[] = [];
  if (metrics.revenue > 0) insights.push("Revenue is being tracked at network level.");
  if (metrics.researchProgress < 0.5) insights.push("Research progress needs attention.");
  if (metrics.teamUtilization > 85) insights.push("Team utilization may be too high.");
  return insights;
}

function ratio(done: number, total: number) {
  return total > 0 ? Math.round((done / total) * 100) / 100 : 0;
}

function sum(items: any[] = [], field: string) {
  return items.reduce((total, item) => total + Number(item[field] || 0), 0);
}
