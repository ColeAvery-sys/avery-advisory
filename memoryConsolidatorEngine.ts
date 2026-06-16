export type MemoryItem = {
  id: string;
  title: string;
  category: string;
  summary: string;
  sourceRecords: string[];
  importance: number;
  confidence: number;
  status: "Active" | "Low Confidence" | "Deprecated";
  lastUpdated: string;
  shouldUseInRecommendations: boolean;
};

export function consolidateMemory(sources: Record<string, any[]>): MemoryItem[] {
  return Object.entries(sources).map(([category, records], index) => {
    const sourceRecords = records.map((record) => record.id || record.title || record.name || `${category}-${index}`);
    const confidence = records.length >= 3 ? 0.75 : 0.45;
    return {
      id: `memory-${category}`,
      title: `${category} memory`,
      category,
      summary: `${records.length} source records consolidated for ${category}.`,
      sourceRecords,
      importance: Math.min(100, records.length * 20),
      confidence,
      status: confidence >= 0.6 ? "Active" : "Low Confidence",
      lastUpdated: new Date().toISOString(),
      shouldUseInRecommendations: confidence >= 0.6,
    };
  });
}

export function mergeDuplicateMemoryItems(items: MemoryItem[]): MemoryItem[] {
  const byTitle = new Map<string, MemoryItem>();
  for (const item of items) {
    const key = item.title.toLowerCase();
    const existing = byTitle.get(key);
    if (!existing) {
      byTitle.set(key, { ...item });
    } else {
      existing.sourceRecords = Array.from(new Set([...existing.sourceRecords, ...item.sourceRecords]));
      existing.importance = Math.max(existing.importance, item.importance);
      existing.confidence = Math.max(existing.confidence, item.confidence);
    }
  }
  return Array.from(byTitle.values());
}

export function scoreMemoryImportance(item: MemoryItem): number {
  return Math.round((item.importance * 0.7 + item.confidence * 100 * 0.3) * 10) / 10;
}

export function markMemoryDeprecated(memoryId: string, items: MemoryItem[]): MemoryItem {
  const item = items.find((memory) => memory.id === memoryId);
  if (!item) throw new Error(`Memory ${memoryId} not found.`);
  item.status = "Deprecated";
  item.shouldUseInRecommendations = false;
  return item;
}

export function exportMemorySummary(items: MemoryItem[]): string {
  return items.filter((item) => item.status !== "Deprecated").map((item) => `- ${item.title}: ${item.summary} Confidence: ${item.confidence}`).join("\n");
}

export function saveMemoryToKnowledgeBase(memoryItem: MemoryItem) {
  return {
    id: memoryItem.id,
    title: memoryItem.title,
    category: memoryItem.category,
    summary: memoryItem.summary,
    confidence: memoryItem.confidence,
    status: memoryItem.status,
  };
}
