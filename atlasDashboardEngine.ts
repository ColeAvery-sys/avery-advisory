import { createNetworkGate, detectNetworkRisks } from "./atlasNetworkSafety";

export function generateAtlasOsDashboard(data: any) {
  const approvals = data.approvals || [];
  const risks = data.risks || [];
  return {
    revenue: data.revenue || 0,
    projects: data.projects || [],
    priorities: (data.priorities || []).slice(0, 5),
    decisionsWaiting: data.decisionsWaiting || [],
    approvalsWaiting: approvals.filter((approval: any) => /pending|required/i.test(approval.status || approval.decision || "")),
    research: data.research || [],
    clients: data.clients || [],
    community: data.community || {},
    growth: data.growth || {},
    risks,
    opportunities: data.opportunities || [],
    recommendation: generateDashboardRecommendation(data),
    ...createNetworkGate("ATLAS OS dashboard", detectNetworkRisks(data)),
  };
}

export function generateDashboardRecommendation(data: any) {
  if ((data.approvals || []).length) return "Clear the approval queue before starting new risky work.";
  if ((data.risks || []).length) return "Address critical risks before expansion.";
  if ((data.opportunities || []).length) return "Choose the highest mission/revenue opportunity and route it through ATLAS Core.";
  return "Keep operating from the top priorities.";
}

export function generateHomeScreenCards(data: any) {
  const dashboard = generateAtlasOsDashboard(data);
  return [
    { title: "Revenue", value: dashboard.revenue },
    { title: "Projects", value: dashboard.projects.length },
    { title: "Approvals Waiting", value: dashboard.approvalsWaiting.length },
    { title: "Risks", value: dashboard.risks.length },
    { title: "Opportunities", value: dashboard.opportunities.length },
  ];
}
