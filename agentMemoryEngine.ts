export type AgentMemoryRecord = {
  id: string;
  agentName: string;
  department: string;
  memoryTitle: string;
  memoryType: string;
  summary: string;
  fullText: string;
  source: string;
  confidence: number;
  status: "Active" | "Low Confidence" | "Deprecated";
  lastUpdated: string;
  shouldUseInRecommendations: boolean;
};

const memories: AgentMemoryRecord[] = [];

export function addAgentMemory(memory: AgentMemoryRecord): AgentMemoryRecord {
  const stored = {
    ...memory,
    status: memory.confidence < 0.5 ? "Low Confidence" as const : memory.status,
    shouldUseInRecommendations: memory.status !== "Deprecated" && memory.confidence >= 0.5,
  };
  memories.push(stored);
  return stored;
}

export function searchAgentMemory(agentName: string, query: string): AgentMemoryRecord[] {
  const normalized = query.toLowerCase();
  return memories.filter((memory) => memory.agentName === agentName && memory.status !== "Deprecated" && `${memory.memoryTitle} ${memory.summary} ${memory.fullText}`.toLowerCase().includes(normalized));
}

export function getMemoryForAgent(agentName: string): AgentMemoryRecord[] {
  return memories.filter((memory) => memory.agentName === agentName && memory.status !== "Deprecated");
}

export function markAgentMemoryDeprecated(memoryId: string): AgentMemoryRecord {
  const memory = findMemory(memoryId);
  memory.status = "Deprecated";
  memory.shouldUseInRecommendations = false;
  return memory;
}

export function promoteToCompanyMemory(memoryId: string) {
  const memory = findMemory(memoryId);
  return { id: `company-${memory.id}`, title: memory.memoryTitle, category: memory.department, summary: memory.summary, source: memory.source, confidence: memory.confidence };
}

export function attachMemoryToAgent(memoryId: string, agentName: string): AgentMemoryRecord {
  const memory = findMemory(memoryId);
  memory.agentName = agentName;
  memory.lastUpdated = new Date().toISOString();
  return memory;
}

export function clearAgentMemoryForDemo(): void {
  memories.length = 0;
}

function findMemory(memoryId: string): AgentMemoryRecord {
  const memory = memories.find((item) => item.id === memoryId);
  if (!memory) throw new Error(`Memory ${memoryId} not found.`);
  return memory;
}
