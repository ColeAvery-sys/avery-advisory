import { normalizeText, unique } from "./atlasUtils";

export type KnowledgeStatus = "Active" | "Deprecated";

export type KnowledgeItem = {
  id: string;
  title: string;
  category: string;
  summary: string;
  fullText: string;
  tags: string[];
  relatedDepartment: string;
  source: string;
  confidence: number;
  status: KnowledgeStatus;
  lastUpdated: string;
  attachedTaskIds?: string[];
};

const knowledgeItems: KnowledgeItem[] = [];

export function addKnowledgeItem(item: KnowledgeItem): KnowledgeItem {
  if (knowledgeItems.some((existing) => existing.id === item.id)) {
    throw new Error(`Knowledge item ${item.id} already exists.`);
  }

  const storedItem = {
    ...item,
    attachedTaskIds: item.attachedTaskIds || [],
  };

  knowledgeItems.push(storedItem);
  return storedItem;
}

export function searchKnowledge(query: string): KnowledgeItem[] {
  const terms = normalizeText(query).split(" ").filter(Boolean);

  return knowledgeItems
    .filter((item) => item.status !== "Deprecated")
    .map((item) => ({
      item,
      score: getSearchScore(item, terms),
    }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((result) => result.item);
}

export function getKnowledgeByCategory(category: string): KnowledgeItem[] {
  const normalizedCategory = normalizeText(category);
  return knowledgeItems.filter((item) => normalizeText(item.category) === normalizedCategory && item.status !== "Deprecated");
}

export function markDeprecated(id: string): KnowledgeItem {
  const item = findKnowledgeItem(id);
  item.status = "Deprecated";
  item.lastUpdated = new Date().toISOString();
  return item;
}

export function attachKnowledgeToTask(knowledgeId: string, taskId: string): KnowledgeItem {
  const item = findKnowledgeItem(knowledgeId);
  item.attachedTaskIds = unique([...(item.attachedTaskIds || []), taskId]);
  item.lastUpdated = new Date().toISOString();
  return item;
}

export function clearKnowledgeBaseForDemo(): void {
  knowledgeItems.length = 0;
}

function findKnowledgeItem(id: string): KnowledgeItem {
  const item = knowledgeItems.find((existing) => existing.id === id);
  if (!item) throw new Error(`Knowledge item ${id} not found.`);
  return item;
}

function getSearchScore(item: KnowledgeItem, terms: string[]): number {
  const searchableFields = [
    { value: item.title, weight: 5 },
    { value: item.summary, weight: 3 },
    { value: item.tags.join(" "), weight: 4 },
    { value: item.category, weight: 3 },
    { value: item.fullText, weight: 1 },
  ];

  return terms.reduce((score, term) => {
    return score + searchableFields.reduce((fieldScore, field) => {
      return normalizeText(field.value).includes(term) ? fieldScore + field.weight : fieldScore;
    }, 0);
  }, 0);
}
