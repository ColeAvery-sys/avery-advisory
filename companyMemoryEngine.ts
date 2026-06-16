import { createIntelligenceGate, label } from "./companyIntelligenceSafety";

const memories: any[] = [];

export function createCompanyMemory(memory: any) {
  const stored = { ...memory, ...createIntelligenceGate("Company memory", memory.confidence || 0.6), importanceScore: memory.importanceScore || calculateMemoryImportance(memory), date: memory.date || new Date(0).toISOString() };
  memories.push(stored);
  return stored;
}

export function updateCompanyMemory(memoryId: string, updates: any) {
  const memory = findMemory(memoryId);
  Object.assign(memory, updates, { lastUpdated: updates.lastUpdated || new Date(0).toISOString() });
  memory.importanceScore = updates.importanceScore || calculateMemoryImportance(memory);
  return memory;
}

export function getCompanyMemoriesByCategory(category: string) {
  return memories.filter((memory) => String(memory.category).toLowerCase() === category.toLowerCase());
}

export function attachLessonToMemory(memoryId: string, lessonId: string) {
  const memory = findMemory(memoryId);
  memory.lessonsAttached = Array.from(new Set([...(memory.lessonsAttached || []), lessonId]));
  memory.importanceScore = calculateMemoryImportance(memory);
  return memory;
}

export function summarizeCompanyMemory(data: any = {}) {
  const source = data.memories || memories;
  const top = source.slice().sort((a: any, b: any) => (b.importanceScore || 0) - (a.importanceScore || 0)).slice(0, 5);
  return { totalMemories: source.length, topMemories: top.map(label), categories: Array.from(new Set(source.map((memory: any) => memory.category))), approvalRequiredForStrategyChange: true };
}

export function calculateMemoryImportance(memory: any): number {
  const relationshipBoost = (memory.relatedProjects || []).length * 5 + (memory.relatedBrands || []).length * 3 + (memory.lessonsAttached || []).length * 10;
  const outcomeBoost = /won|success|failed|lost|blocked|profitable/i.test(memory.outcome || "") ? 20 : 0;
  return Math.min(100, 30 + relationshipBoost + outcomeBoost + (Number(memory.importanceScore) || 0));
}

function findMemory(memoryId: string) {
  const memory = memories.find((entry) => entry.memoryId === memoryId || entry.id === memoryId);
  if (!memory) throw new Error(`Company memory ${memoryId} not found.`);
  return memory;
}

