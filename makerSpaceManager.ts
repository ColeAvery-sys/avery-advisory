import { createHqGate, detectHqRisks } from "./physicalHqSafety";

const labProjects: any[] = [];

export function createLabProject(project: any) {
  const stored = { ...project, id: project.id || `lab-${labProjects.length + 1}`, status: project.status || "Concept", riskFlags: detectHqRisks(project) };
  labProjects.push(stored);
  return stored;
}

export function updateLabProjectStage(projectId: string, status: string, approval?: any) {
  const project = findProject(projectId);
  if (/approved|production|testing/i.test(status) && approval?.approvedBy !== "Cole") {
    project.status = "Needs Cole Approval";
    return project;
  }
  project.status = status;
  return project;
}

export function generateLabSafetyChecklist(projectId: string) {
  const project = findProject(projectId);
  return {
    projectName: project.projectName,
    checklist: ["Tool safety", "Material safety", "Ventilation", "Fire risk", "Protective equipment", "Prototype log", "Disposal plan"],
    ...createHqGate("Maker space safety checklist", detectHqRisks(project).concat(["Lab safety requires review."])),
  };
}

export function summarizeLabPipeline() {
  return {
    totalProjects: labProjects.length,
    concept: labProjects.filter((project) => project.status === "Concept").length,
    prototype: labProjects.filter((project) => project.status === "Prototype").length,
    testing: labProjects.filter((project) => project.status === "Testing").length,
    approved: labProjects.filter((project) => project.status === "Approved").length,
  };
}

function findProject(projectId: string) {
  const project = labProjects.find((entry) => entry.id === projectId);
  if (!project) throw new Error(`Lab project ${projectId} not found.`);
  return project;
}
