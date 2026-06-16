import { createAgentGate, detectAgentRisks } from "./agentCivilizationSafety";

const tasks: any[] = [];

export function createMarketplaceTask(task: any) {
  const stored = { ...task, id: task.id || `agent-task-${tasks.length + 1}`, status: task.status || "Available", riskFlags: detectAgentRisks(task) };
  tasks.push(stored);
  return stored;
}

export function claimMarketplaceTask(taskId: string, agentId: string) {
  const task = findTask(taskId);
  if (task.riskFlags.length) {
    task.status = "Waiting";
    task.claimBlockedReason = "Risky tasks require approval before agent execution.";
    return task;
  }
  task.status = "Claimed";
  task.claimedBy = agentId;
  return task;
}

export function updateMarketplaceTaskStatus(taskId: string, status: string) {
  const task = findTask(taskId);
  task.status = status;
  return task;
}

export function listAvailableTasks() {
  return tasks.filter((task) => task.status === "Available");
}

export function generateMarketplaceSummary() {
  return {
    available: tasks.filter((task) => task.status === "Available").length,
    claimed: tasks.filter((task) => task.status === "Claimed").length,
    inProgress: tasks.filter((task) => task.status === "In Progress").length,
    waiting: tasks.filter((task) => task.status === "Waiting").length,
    complete: tasks.filter((task) => task.status === "Complete").length,
    ...createAgentGate("Agent task marketplace summary"),
  };
}

function findTask(taskId: string) {
  const task = tasks.find((item) => item.id === taskId);
  if (!task) throw new Error(`Marketplace task ${taskId} not found.`);
  return task;
}
