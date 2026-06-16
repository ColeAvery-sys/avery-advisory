import { createAveryApprovalGate } from "./averyOpsSafety";

const memory: any[] = [];
const allowedTypes = ["Decision", "Meeting", "SOP", "Project", "Idea", "Prompt"];

export function createSharedMemoryRecord(record: any) {
  if (allowedTypes.indexOf(record.type) < 0) throw new Error(`Unsupported memory type ${record.type}.`);
  const gate = createAveryApprovalGate("Shared memory record", record);
  const stored = {
    id: record.id || `memory-${memory.length + 1}`,
    type: record.type,
    title: record.title,
    body: record.body || record.description || "",
    department: record.department || "Executive",
    relatedAgents: record.relatedAgents || [],
    relatedProjects: record.relatedProjects || [],
    tags: record.tags || [],
    createdAt: record.createdAt || new Date(0).toISOString(),
    approvalStatus: gate.approvalStatus,
    riskFlags: gate.riskFlags,
  };
  memory.push(stored);
  return stored;
}

export function searchSharedMemory(query: string) {
  const needle = query.toLowerCase();
  return memory.filter((record) => JSON.stringify(record).toLowerCase().indexOf(needle) >= 0);
}

export function getSharedMemoryByType(type: string) {
  return memory.filter((record) => record.type === type);
}

export function getAllSharedMemory() {
  return memory.slice();
}

export function generateMemorySummary() {
  return {
    totalRecords: memory.length,
    decisions: getSharedMemoryByType("Decision").length,
    meetings: getSharedMemoryByType("Meeting").length,
    sops: getSharedMemoryByType("SOP").length,
    projects: getSharedMemoryByType("Project").length,
    ideas: getSharedMemoryByType("Idea").length,
    prompts: getSharedMemoryByType("Prompt").length,
  };
}
