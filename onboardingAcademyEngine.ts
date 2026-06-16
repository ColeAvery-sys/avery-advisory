import { createWorkforceGate } from "./workforceSafety";

const modules: any[] = [];

export function createTrainingModule(module: any) {
  const stored = { ...module, id: module.id || `training-${modules.length + 1}`, status: module.status || "Draft" };
  modules.push(stored);
  return stored;
}

export function generateTrainingPack(topic: string) {
  return createTrainingModule({
    moduleName: `${topic} Training Pack`,
    topic,
    sections: ["Purpose", "What good looks like", "Step-by-step workflow", "Common mistakes", "Approval gates", "Reference examples"],
    checklist: generateTrainingChecklist(topic),
    quiz: generateQuiz(topic),
    ...createWorkforceGate("Training pack"),
  });
}

export function generateTrainingChecklist(topic: string) {
  return [`Read ${topic} reference guide`, "Review quality checklist", "Complete practice task", "Ask one question", "Get Cole or lead approval before live work"];
}

export function generateQuiz(topic: string) {
  return [
    `What is the main purpose of ${topic}?`,
    "Which actions require Cole approval?",
    "What should you do if client/private data appears?",
  ];
}

export function assignTraining(personId: string, moduleId: string) {
  const module = findModule(moduleId);
  module.assignedPeople = Array.from(new Set([...(module.assignedPeople || []), personId]));
  return { personId, moduleId, assignmentStatus: "Assigned", completionStatus: "Not Started" };
}

function findModule(moduleId: string) {
  const module = modules.find((item) => item.id === moduleId);
  if (!module) throw new Error(`Training module ${moduleId} not found.`);
  return module;
}
