import { createAgentGate } from "./agentCivilizationSafety";

export function generateAgentCivilizationDashboard(data: any) {
  const agents = data.agents || [];
  const tasks = data.tasks || [];
  const reputations = data.reputations || [];
  const costs = data.costs || [];
  const alerts = data.alerts || [];
  return {
    totalAgents: agents.length,
    departments: Array.from(new Set(agents.map((agent: any) => agent.department || "Unknown"))),
    tasks: {
      available: tasks.filter((task: any) => task.status === "Available").length,
      inProgress: tasks.filter((task: any) => task.status === "In Progress").length,
      waiting: tasks.filter((task: any) => task.status === "Waiting").length,
      complete: tasks.filter((task: any) => task.status === "Complete").length,
    },
    averageTrust: average(reputations.map((rep: any) => Number(rep.trustScore || 0))),
    totalEstimatedCost: costs.reduce((sum: number, cost: any) => sum + Number(cost.estimatedCost || cost.actualCost || 0), 0),
    projects: data.projects || [],
    recommendations: data.recommendations || ["Keep agents advisory until trust and approvals mature."],
    alerts,
    ...createAgentGate("Agent civilization dashboard", alerts.length ? ["Agent alerts require oversight."] : []),
  };
}

function average(values: number[]) {
  const filtered = values.filter((value) => value > 0);
  return filtered.length ? Math.round((filtered.reduce((sum, value) => sum + value, 0) / filtered.length) * 10) / 10 : 0;
}
