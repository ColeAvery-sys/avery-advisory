import { createAgentGate } from "./agentCivilizationSafety";

const trainings: any[] = [];

export function createAgentTrainingRecord(record: any) {
  const stored = { ...record, id: record.id || `agent-training-${trainings.length + 1}`, status: record.status || "Assigned", knowledgeLevel: record.knowledgeLevel || 1, certifications: record.certifications || [] };
  trainings.push(stored);
  return stored;
}

export function awardAgentCertification(agentId: string, certification: string) {
  const record = findTraining(agentId);
  record.certifications = Array.from(new Set([...(record.certifications || []), certification]));
  record.knowledgeLevel = Math.min(10, Number(record.knowledgeLevel || 1) + 1);
  return record;
}

export function generateAgentTrainingPack(topic: string) {
  return {
    topic,
    modules: ["Context", "SOPs", "Approval gates", "Examples", "Practice task", "Review"],
    quiz: [`What can the agent do in ${topic}?`, "What must be escalated to Cole?", "How should recommendations be explained?"],
    ...createAgentGate("Agent training pack"),
  };
}

export function getAgentTrainingStatus(agentId: string) {
  return findTraining(agentId);
}

function findTraining(agentId: string) {
  const record = trainings.find((item) => item.agentId === agentId || item.id === agentId);
  if (!record) throw new Error(`Agent training ${agentId} not found.`);
  return record;
}
