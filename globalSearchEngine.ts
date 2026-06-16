import { searchCoreRecords } from "./atlasCoreEngine";
import { createNetworkGate } from "./atlasNetworkSafety";

const indexes: any[] = [];

export function addSearchIndexRecord(record: any) {
  const stored = { ...record, id: record.id || `search-${indexes.length + 1}` };
  indexes.push(stored);
  return stored;
}

export function globalSearch(query: string) {
  const needle = query.toLowerCase();
  const local = indexes.filter((record) => JSON.stringify(record).toLowerCase().indexOf(needle) >= 0);
  const core = searchCoreRecords(query);
  return {
    query,
    results: [...core, ...local].map((record) => ({ id: record.id, type: record.type || record.sourceSystem || "Record", title: record.title || record.name || record.projectName || record.productName || record.id })),
    ...createNetworkGate("Global search"),
  };
}

export function generateSearchSummary(query: string) {
  const result = globalSearch(query);
  return { query, resultCount: result.results.length, topResults: result.results.slice(0, 5) };
}
