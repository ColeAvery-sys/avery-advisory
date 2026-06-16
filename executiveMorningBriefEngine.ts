import { priorityWeight } from "./averyOpsSafety";

export function generateExecutiveMorningBrief(data: any) {
  const approvals = data.approvals || [];
  const risks = data.risks || [];
  const opportunities = data.opportunities || [];
  return {
    title: "Executive Morning Brief",
    revenue: summarizeList(data.revenue || []),
    clients: summarizeList(data.clients || []),
    leads: summarizeList(data.leads || []),
    projects: summarizeList(data.projects || []),
    agentHealth: summarizeAgentHealth(data.agents || []),
    approvalsNeeded: approvals.slice().sort((a: any, b: any) => priorityWeight(b.priority) - priorityWeight(a.priority)).slice(0, 5),
    topOpportunities: opportunities.slice().sort((a: any, b: any) => priorityWeight(b.priority) - priorityWeight(a.priority)).slice(0, 3),
    topRisks: risks.slice().sort((a: any, b: any) => priorityWeight(b.priority) - priorityWeight(a.priority)).slice(0, 3),
    onePageConstraint: true,
    noScrolling: true,
    recommendedFocus: determineRecommendedFocus(data),
  };
}

export function determineRecommendedFocus(data: any) {
  if ((data.approvals || []).some((item: any) => /critical|high/i.test(item.priority || ""))) return "Clear high-priority approvals.";
  if ((data.leads || []).length) return "Move one Creator Logistics lead forward.";
  if ((data.clients || []).some((client: any) => /blocked|waiting/i.test(client.status || ""))) return "Unblock client delivery.";
  return "Take one revenue action before adding new work.";
}

function summarizeList(items: any[]) {
  return {
    count: items.length,
    top: items.slice(0, 3).map((item) => item.title || item.name || item.clientName || item.projectName || item.id || "Untitled"),
  };
}

function summarizeAgentHealth(agents: any[]) {
  return {
    totalAgents: agents.length,
    blocked: agents.filter((agent) => /blocked|needs approval/i.test(agent.status || "")).length,
    active: agents.filter((agent) => /active|working/i.test(agent.status || "")).length,
  };
}
