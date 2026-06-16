import { createStudioGate, detectContentRisks, readinessScore } from "./contentStudioSafety";

const projects: any[] = [];

export function createContentProject(project: any) {
  const risks = detectContentRisks(`${project.projectTitle} ${project.contentType || ""} ${project.notes || ""}`);
  const stored = { ...project, ...createStudioGate("Content project", risks), status: project.status || "Idea", riskLevel: risks.length ? "High" : project.riskLevel || "Low" };
  projects.push(stored);
  return stored;
}

export function generateProductionPlan(project: any) {
  return {
    projectTitle: project.projectTitle,
    steps: ["script", "asset list", "voiceover if needed", "edit plan", "thumbnail", "captions", "QC", "approval", "manual publish/export"],
    requiredApprovals: ["public/client-facing content", "rights-sensitive assets", "paid generation", "claims review"],
    approvalRequired: true,
  };
}

export function identifyContentWaitingOnCole(data: any) {
  return (data.projects || projects).filter((project: any) => /needs cole|needs approval/i.test(project.approvalStatus || ""));
}

export function identifyMissingAssets(project: any): string[] {
  const missing: string[] = [];
  if (!project.scriptStatus || /needed|missing/i.test(project.scriptStatus)) missing.push("script");
  if (/needed|missing/i.test(project.voiceoverStatus || "")) missing.push("voiceover");
  if (/needed|missing/i.test(project.thumbnailStatus || "")) missing.push("thumbnail");
  if (/needed|missing/i.test(project.captionStatus || "")) missing.push("captions");
  return missing;
}

export function generateStudioRecommendation(data: any) {
  const items = data.projects || projects;
  const priorities = items
    .map((project: any) => ({ projectTitle: project.projectTitle, score: scoreProject(project), nextStage: routeContentToNextStage(project.id || project.projectId, true).nextStage }))
    .sort((a: any, b: any) => b.score - a.score);
  return { topProject: priorities[0], waitingOnCole: identifyContentWaitingOnCole({ projects: items }).length, recommendation: priorities[0] ? `Move ${priorities[0].projectTitle} to ${priorities[0].nextStage}.` : "Create a Creator Logistics or AveryTech content project." };
}

export function routeContentToNextStage(projectId: string, previewOnly = false) {
  const project = previewOnly ? projects.find((entry) => entry.id === projectId || entry.projectId === projectId) || {} : findProject(projectId);
  const missing = identifyMissingAssets(project);
  const nextStage = missing[0] || (/ready|passed/i.test(project.QCStatus || "") ? "approval" : "content QC");
  if (!previewOnly && project) project.status = `Route to ${nextStage}`;
  return { projectId, nextStage, approvalRequired: /approval|QC|voiceover/i.test(nextStage) };
}

function scoreProject(project: any): number {
  const text = `${project.brand} ${project.contentType} ${project.campaign}`.toLowerCase();
  const strategic = /creator logistics|averytech|atlas assist|new prometheus/.test(text) ? 50 : 25;
  const readiness = readinessScore([!!project.projectTitle, !!project.targetAudience, !!project.relatedLandingPage, !identifyMissingAssets(project).length]);
  return strategic + Math.round(readiness / 2);
}

function findProject(projectId: string) {
  const project = projects.find((entry) => entry.id === projectId || entry.projectId === projectId);
  if (!project) throw new Error(`Content project ${projectId} not found.`);
  return project;
}

