import { createRdGate, detectRdRisks } from "./rdSafety";

const printProjects: any[] = [];

export function createPrintProject(project: any) {
  const stored = { ...project, id: project.id || `print-${printProjects.length + 1}`, status: project.status || "Concept", riskFlags: detectRdRisks(project) };
  printProjects.push(stored);
  return stored;
}

export function generatePrintabilityChecklist(project: any) {
  return {
    productName: project.productName || project.projectName,
    checks: ["Watertight mesh", "Wall thickness", "Overhang review", "Material selected", "Cost estimate", "Safety review", "Prototype test"],
    ...createRdGate("3D printability checklist", detectRdRisks(project)),
  };
}

export function estimatePrintCost(project: any) {
  const materialCost = Number(project.materialCost || 0);
  const hours = Number(project.printHours || 0);
  const failureBuffer = Math.max(1, Number(project.failureBuffer || 1.25));
  return { productName: project.productName || project.projectName, estimatedCost: Math.round((materialCost + hours * 1.5) * failureBuffer * 100) / 100, approvalRequiredBeforeOrdering: true };
}

export function validatePrintPrototype(project: any) {
  const ready = project.printabilityStatus === "Passed" && project.testingStatus === "Passed";
  return { productName: project.productName || project.projectName, prototypeReady: ready, productionStatus: ready && project.approvalStatus === "Approved" ? "Ready for approved production prep" : "Blocked from production", approvalRequired: true };
}
