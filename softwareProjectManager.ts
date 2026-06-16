import { createRdGate, detectRdRisks, prototypeFirstStatus, rdLabel } from "./rdSafety";

const softwareProjects: any[] = [];

export function createSoftwareProject(project: any) {
  const stored = { ...project, id: project.id || `software-${softwareProjects.length + 1}`, status: project.status || "Planning", prototypeFirst: prototypeFirstStatus(project), riskFlags: detectRdRisks(project) };
  softwareProjects.push(stored);
  return stored;
}

export function generateSoftwareProjectPlan(project: any) {
  return {
    projectName: rdLabel(project),
    requirements: project.requirements || ["Define user flow", "Define data model", "Define approval gates"],
    features: project.features || [],
    dependencies: project.dependencies || [],
    risks: detectRdRisks(project),
    prototypeFirst: prototypeFirstStatus(project),
    recommendedOwner: project.owner || "Codex/Cursor depending on scope",
    ...createRdGate("Software project plan", detectRdRisks(project)),
  };
}

export function identifySoftwareRisks(project: any) {
  return [...detectRdRisks(project), ...(project.dependencies || []).length > 3 ? ["Dependency complexity risk."] : [], prototypeFirstStatus(project).blockedFromFullDevelopment ? "Prototype First Rule not satisfied." : ""].filter(Boolean);
}

export function estimateSoftwareEffort(project: any) {
  const featureCount = (project.features || []).length;
  const dependencyCount = (project.dependencies || []).length;
  return {
    projectName: rdLabel(project),
    effortPoints: Math.max(3, featureCount * 3 + dependencyCount * 2 + (detectRdRisks(project).length * 2)),
    estimateLabel: featureCount > 8 ? "Large" : featureCount > 3 ? "Medium" : "Small",
  };
}

export function updateSoftwareProjectStatus(projectId: string, status: string) {
  const project = findProject(projectId);
  project.status = status;
  project.prototypeFirst = prototypeFirstStatus(project);
  return project;
}

function findProject(projectId: string) {
  const project = softwareProjects.find((item) => item.id === projectId);
  if (!project) throw new Error(`Software project ${projectId} not found.`);
  return project;
}
