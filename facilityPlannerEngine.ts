import { createHqGate, detectHqRisks, hqLabel, score10 } from "./physicalHqSafety";

const facilityAreas: any[] = [];

export function createFacilityArea(area: any) {
  const stored = { ...area, id: area.id || `area-${facilityAreas.length + 1}`, priorityScore: calculateAreaPriority(area) };
  facilityAreas.push(stored);
  return stored;
}

export function calculateAreaPriority(area: any) {
  const revenue = score10(area.revenueSupport);
  const mission = score10(area.missionSupport);
  const usage = score10(area.expectedUsage);
  const costPenalty = score10(area.buildCost);
  return Math.max(0, Math.min(100, Math.round((revenue * 2 + mission * 1.5 + usage * 1.5 - costPenalty) * 8)));
}

export function generateFacilityPlan() {
  return facilityAreas.slice().sort((a, b) => b.priorityScore - a.priorityScore).map((area) => ({
    areaName: hqLabel(area),
    capacity: area.capacity || "TBD",
    equipmentNeeded: area.equipmentNeeded || [],
    buildCost: area.buildCost || "TBD",
    priorityScore: area.priorityScore,
    approvalRequiredBeforeBuildout: true,
  }));
}

export function generateAreaChecklist(areaId: string) {
  const area = findArea(areaId);
  return {
    areaName: hqLabel(area),
    checklist: ["Purpose", "Capacity", "Equipment", "Power/internet", "Accessibility", "Safety", "Budget", "Maintenance"],
    ...createHqGate("Facility area checklist", detectHqRisks(area)),
  };
}

function findArea(areaId: string) {
  const area = facilityAreas.find((entry) => entry.id === areaId);
  if (!area) throw new Error(`Facility area ${areaId} not found.`);
  return area;
}
