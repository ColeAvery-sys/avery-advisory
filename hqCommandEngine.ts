import { createHqGate, detectHqRisks, hqBeforeEmpireStatus, hqLabel } from "./physicalHqSafety";

const hqRecords: any[] = [];

export function createHqRecord(record: any) {
  const stored = { ...record, id: record.id || `hq-${hqRecords.length + 1}`, riskFlags: detectHqRisks(record) };
  hqRecords.push(stored);
  return stored;
}

export function generateHqCommandCenter(data: any = {}) {
  const records = data.records || hqRecords;
  return {
    currentHqStatus: data.currentHqStatus || "Planning",
    occupancy: data.occupancy || "Not established",
    equipmentHealth: summarizeHealth(data.equipment || []),
    upcomingEvents: (data.events || []).map(hqLabel),
    studioUsage: summarizeUsage(data.studios || []),
    makerSpaceUsage: summarizeUsage(data.makerSpaces || []),
    expansionNeeds: (data.expansionPlans || []).filter((plan: any) => hqBeforeEmpireStatus(plan).blockedFromExpansion).map(hqLabel),
    riskAlerts: records.filter((record: any) => detectHqRisks(record).length).map((record: any) => ({ item: hqLabel(record), risks: detectHqRisks(record) })),
    recommendation: generateHqRecommendation(data),
    ...createHqGate("HQ command recommendation", ["Real-world property, spend, and construction actions require approval."]),
  };
}

export function generateHqRecommendation(data: any) {
  const expansionPlans = data.expansionPlans || [];
  if (expansionPlans.some((plan: any) => hqBeforeEmpireStatus(plan).blockedFromExpansion)) return "Do not expand yet. Build revenue, team readiness, and capacity evidence first.";
  if ((data.equipment || []).some((item: any) => /poor|broken|needs repair/i.test(item.condition || ""))) return "Repair or replace critical equipment before expanding space.";
  return "Operate lean: document needs, protect cash, and prepare a staged facility plan.";
}

function summarizeHealth(items: any[]) {
  if (!items.length) return "No equipment records";
  const poor = items.filter((item) => /poor|broken|needs repair/i.test(item.condition || "")).length;
  return poor ? `${poor} equipment item(s) need attention` : "Equipment healthy";
}

function summarizeUsage(items: any[]) {
  if (!items.length) return "No usage records";
  const booked = items.filter((item) => Number(item.bookedHours || item.usageHours || 0) > 0).length;
  return `${booked}/${items.length} active`;
}
