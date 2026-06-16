import { createNetworkGate, detectNetworkRisks } from "./atlasNetworkSafety";

const managers: any[] = [];

export function createDepartmentManager(manager: any) {
  const stored = { ...manager, id: manager.id || `manager-${managers.length + 1}`, status: manager.status || "Active" };
  managers.push(stored);
  return stored;
}

export function generateManagerReport(managerId: string, data: any = {}) {
  const manager = findManager(managerId);
  return {
    managerName: manager.managerName,
    department: manager.department,
    recommendations: generateManagerRecommendations(manager.department, data),
    warnings: generateManagerWarnings(data),
    report: data.summary || `${manager.department} report drafted.`,
    ...createNetworkGate("Department manager report", detectNetworkRisks(data)),
  };
}

export function generateManagerRecommendations(department: string, data: any) {
  if (/revenue/i.test(department)) return ["Prioritize Creator Logistics cash and client follow-up."];
  if (/content/i.test(department)) return ["Package approved content into reusable publishing assets."];
  if (/research/i.test(department)) return ["Move pilots toward measured outcomes and grant readiness."];
  if (/workforce/i.test(department)) return ["Rebalance overloaded people before adding work."];
  if (/facility/i.test(department)) return ["Protect cash and document capacity needs before expansion."];
  return [data.recommendation || "Review priorities and route blockers to ATLAS Core."];
}

export function generateManagerWarnings(data: any) {
  const warnings: string[] = [];
  if ((data.blockers || []).length) warnings.push("Blockers need attention.");
  if ((data.approvals || []).length) warnings.push("Approvals waiting.");
  if (detectNetworkRisks(data).length) warnings.push("High-risk action requires approval.");
  return warnings;
}

function findManager(managerId: string) {
  const manager = managers.find((entry) => entry.id === managerId);
  if (!manager) throw new Error(`Manager ${managerId} not found.`);
  return manager;
}
