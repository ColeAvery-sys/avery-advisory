import { getAveryAgents } from "./averyAgentArmyEngine";
import { getDepartments } from "./averyDepartmentRegistry";
import { getAveryTasks } from "./averyAgentArmyEngine";
import { getDailyReports } from "./averyDailyReportEngine";
import { getAveryApprovals } from "./averyApprovalQueueEngine";
import { getAllSharedMemory } from "./averySharedMemoryEngine";

export const AVERY_AGENT_DASHBOARD_ENDPOINTS = ["/agents", "/departments", "/tasks", "/reports", "/approvals", "/memory"];

export function handleAgentDashboardRequest(path: string) {
  if (path === "/agents") return { status: 200, data: getAveryAgents() };
  if (path === "/departments") return { status: 200, data: getDepartments() };
  if (path === "/tasks") return { status: 200, data: getAveryTasks() };
  if (path === "/reports") return { status: 200, data: getDailyReports() };
  if (path === "/approvals") return { status: 200, data: getAveryApprovals() };
  if (path === "/memory") return { status: 200, data: getAllSharedMemory() };
  return { status: 404, data: { error: "Unknown Avery Industries dashboard endpoint." } };
}

export function generateAgentDashboardApiSpec() {
  return AVERY_AGENT_DASHBOARD_ENDPOINTS.map((endpoint) => ({
    endpoint,
    method: "GET",
    mode: "local in-memory contract",
    note: "This repo has no HTTP server yet. Use handleAgentDashboardRequest() until a real app router exists.",
  }));
}
