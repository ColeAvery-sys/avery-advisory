import { createNetworkGate, detectNetworkRisks, networkLabel, singleSourceStatus } from "./atlasNetworkSafety";

const coreRecords: any[] = [];

export function registerCoreRecord(record: any) {
  const stored = { ...record, id: record.id || `core-${coreRecords.length + 1}`, sourceOfTruth: "ATLAS Core", coreSynced: true, riskFlags: detectNetworkRisks(record), updatedAt: record.updatedAt || new Date(0).toISOString() };
  const existingIndex = coreRecords.findIndex((item) => item.id === stored.id);
  if (existingIndex >= 0) coreRecords[existingIndex] = { ...coreRecords[existingIndex], ...stored };
  else coreRecords.push(stored);
  return stored;
}

export function syncCriticalInfoToCore(sourceSystem: string, record: any) {
  return registerCoreRecord({ ...record, sourceSystem, syncedFrom: sourceSystem });
}

export function getCoreRecord(recordId: string) {
  const record = coreRecords.find((item) => item.id === recordId);
  if (!record) throw new Error(`Core record ${recordId} not found.`);
  return record;
}

export function searchCoreRecords(query: string) {
  const needle = query.toLowerCase();
  return coreRecords.filter((record) => JSON.stringify(record).toLowerCase().indexOf(needle) >= 0);
}

export function generateCoreSummary() {
  return {
    totalRecords: coreRecords.length,
    byType: countBy(coreRecords, (record: any) => record.type || "Unknown"),
    unsyncedCriticalRecords: coreRecords.filter((record) => !singleSourceStatus(record).coreSynced && record.critical).map(networkLabel),
    ...createNetworkGate("ATLAS Core summary"),
  };
}

export function validateSingleSourceOfTruth(record: any) {
  const status = singleSourceStatus(record);
  return { ...status, valid: status.coreSynced && status.sourceOfTruth === "ATLAS Core" };
}

function countBy(items: any[], getter: (item: any) => string) {
  const counts: Record<string, number> = {};
  items.forEach((item) => {
    const key = getter(item);
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}
