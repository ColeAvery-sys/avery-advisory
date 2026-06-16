import { label } from "./executiveSafety";

export function decideDelegation(task: any) {
  const text = `${task.title || task.name || ""} ${task.description || ""}`.toLowerCase();
  let owner = "Cole";
  if (/code|bug|test|backend|script/.test(text)) owner = "Codex";
  else if (/ui|layout|page|frontend|polish/.test(text)) owner = "Cursor";
  else if (/edit|clip|thumbnail|footage/.test(text)) owner = "Editor";
  else if (/research|organize|draft|score|route|summarize/.test(text)) owner = "ATLAS";
  else if (/specialist|contractor|outsource/.test(text)) owner = "Contractor";
  const approvalRequired = /money|client|legal|public|payment|hire|contractor/.test(text);
  return {
    taskTitle: label(task),
    owner,
    deadline: task.deadline || "Next reasonable work block",
    reason: `${owner} is best matched to this task type.`,
    expectedOutcome: task.expectedOutcome || `Move ${label(task)} forward without expanding scope.`,
    approvalRequired,
  };
}

export function createDelegationPlan(tasks: any[]) {
  return tasks.map(decideDelegation);
}

