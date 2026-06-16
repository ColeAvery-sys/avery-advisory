import { getDepartmentByName, seedAveryDepartments } from "./averyDepartmentRegistry";
import { createAveryApprovalGate } from "./averyOpsSafety";

export type AveryAgentStatus = "Active" | "Idle" | "Working" | "Blocked" | "Needs Approval" | "Paused";

const agents: any[] = [];
const tasks: any[] = [];

export function createAveryAgent(agent: any) {
  seedAveryDepartments();
  getDepartmentByName(agent.department);
  const stored = {
    id: agent.id || `avery-agent-${agents.length + 1}`,
    name: agent.name,
    department: agent.department,
    role: agent.role,
    status: agent.status || "Idle" as AveryAgentStatus,
    currentTask: agent.currentTask || "",
    lastReport: agent.lastReport || "",
    manager: agent.manager || "ATLAS Prime",
  };
  agents.push(stored);
  return stored;
}

export function seedFoundationAgents() {
  if (agents.length) return agents;
  return [
    createAveryAgent({ id: "agent-atlas-prime", name: "ATLAS Prime", department: "Executive", role: "CEO Agent", manager: "Cole" }),
    createAveryAgent({ id: "agent-orion", name: "ORION", department: "Sales", role: "Revenue Analyst" }),
    createAveryAgent({ id: "agent-muse", name: "MUSE", department: "Marketing", role: "Content Strategist" }),
    createAveryAgent({ id: "agent-forge", name: "FORGE", department: "ATLAS Systems", role: "Software Developer" }),
    createAveryAgent({ id: "agent-circuit", name: "CIRCUIT", department: "AveryTech", role: "Accessibility Engineer" }),
    createAveryAgent({ id: "agent-archive", name: "ARCHIVE", department: "Academy", role: "Knowledge Curator" }),
    createAveryAgent({ id: "agent-sentinel", name: "SENTINEL", department: "Executive", role: "Risk Manager" }),
  ];
}

export function getAveryAgents() {
  seedFoundationAgents();
  return agents.slice();
}

export function assignAveryTask(task: any) {
  const gate = createAveryApprovalGate("Task assignment", task);
  const stored = {
    id: task.id || `avery-task-${tasks.length + 1}`,
    title: task.title,
    department: task.department,
    assignedAgent: task.assignedAgent || "",
    status: task.status || "Task Created",
    priority: task.priority || "Normal",
    approvalStatus: gate.approvalStatus,
    riskFlags: gate.riskFlags,
  };
  tasks.push(stored);
  if (stored.assignedAgent) {
    const agent = agents.find((item) => item.name === stored.assignedAgent || item.id === stored.assignedAgent);
    if (agent) {
      agent.currentTask = stored.title;
      agent.status = stored.approvalStatus === "Needs Cole Approval" ? "Needs Approval" : "Working";
    }
  }
  return stored;
}

export function updateAveryTaskStatus(taskId: string, status: string) {
  const task = findTask(taskId);
  task.status = status;
  return task;
}

export function getAveryTasks() {
  return tasks.slice();
}

function findTask(taskId: string) {
  const task = tasks.find((item) => item.id === taskId);
  if (!task) throw new Error(`Task ${taskId} not found.`);
  return task;
}
