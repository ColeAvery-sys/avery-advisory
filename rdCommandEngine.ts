import { classifyRdPriority, createRdGate, detectRdRisks, prototypeFirstStatus, rdLabel, scorePrototype } from "./rdSafety";

const rdProjects: any[] = [];

export function createRdProject(project: any) {
  const stored = { ...project, id: project.id || `rd-${rdProjects.length + 1}`, priorityTier: classifyRdPriority(project), prototypeFirst: prototypeFirstStatus(project), riskFlags: detectRdRisks(project) };
  rdProjects.push(stored);
  return stored;
}

export function generateRdCommandCenter(data: any = {}) {
  const projects = data.projects || rdProjects;
  const active = projects.filter((project: any) => /active|prototype|mvp|testing/i.test(project.status || project.stage || ""));
  const blocked = projects.filter((project: any) => prototypeFirstStatus(project).blockedFromFullDevelopment || detectRdRisks(project).length);
  return {
    totalProjects: projects.length,
    activeProjects: active.map(rdLabel),
    researchProjects: projects.filter((project: any) => /research/i.test(project.status || project.stage || "")).map(rdLabel),
    prototypeProjects: projects.filter((project: any) => /prototype/i.test(project.status || project.stage || "")).map(rdLabel),
    blockedProjects: blocked.map(rdLabel),
    topPriorities: projects.slice().sort((a: any, b: any) => scorePrototype(b) - scorePrototype(a)).slice(0, 3).map(rdLabel),
    recommendation: generateRdRecommendation(projects),
    ...createRdGate("R&D command recommendation", ["R&D strategy and release decisions require approval."]),
  };
}

export function generateRdRecommendation(projects: any[]) {
  if (!projects.length) return "Create R&D project records for ATLAS HQ, ATLAS Assist, EchoFrame, and Creator Logistics Tools.";
  if (projects.some((project) => prototypeFirstStatus(project).blockedFromFullDevelopment)) return "Move blocked projects back to research/prototype validation before full development.";
  return `Focus first on ${rdLabel(projects.slice().sort((a, b) => classifyRdPriority(a).tier - classifyRdPriority(b).tier)[0])}.`;
}

export function routeRdProject(projectId: string) {
  const project = findProject(projectId);
  const tier = classifyRdPriority(project);
  if (prototypeFirstStatus(project).blockedFromFullDevelopment) return { projectId, route: "Research Lab", reason: "Prototype First Rule is not satisfied." };
  if (/bug|software|app|api|website/i.test(project.projectType || project.category || "")) return { projectId, route: "Software Project Manager", reason: tier.label };
  if (/godot|game/i.test(JSON.stringify(project))) return { projectId, route: "Godot Studio Manager", reason: tier.label };
  if (/blender|asset|animation/i.test(JSON.stringify(project))) return { projectId, route: "Blender Asset Pipeline", reason: tier.label };
  if (/print|hardware/i.test(JSON.stringify(project))) return { projectId, route: "3D Printing Pipeline", reason: tier.label };
  return { projectId, route: "Experiment Tracker", reason: tier.label };
}

function findProject(projectId: string) {
  const project = rdProjects.find((item) => item.id === projectId);
  if (!project) throw new Error(`R&D project ${projectId} not found.`);
  return project;
}
