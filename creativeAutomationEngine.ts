import { scoreMissionAlignment } from "./missionGuardrailEngine";

const creativeProjects: any[] = [];

export function createCreativeProject(project: Record<string, any>) {
  const stored = { ...project, status: project.status || "Idea", missionAlignment: scoreCreativeMissionAlignment(project) };
  creativeProjects.push(stored);
  return stored;
}

export function scoreCreativeMissionAlignment(project: Record<string, any>) {
  return scoreMissionAlignment({
    title: project.projectName || project.title || "Creative project",
    description: project.description || "",
    category: project.projectType || "Creative Automation",
    fastCashPotential: project.fastCashPotential || 0,
    atlasHqValue: project.atlasHqValue || 0,
    atlasAssistValue: project.atlasAssistValue || 0,
    grantFundingValue: project.grantFundingValue || 0,
    salesMarketingValue: project.salesMarketingValue || 0,
    clientDeliveryValue: project.clientDeliveryValue || 0,
    creativeAssetValue: project.creativeAssetValue || 8,
    distractionRisk: project.distractionRisk || 7,
    timeCost: project.timeCost || 6,
    overwhelmCost: project.overwhelmCost || 5,
  });
}

export function generateCreativeBuildPlan(project: Record<string, any>) {
  return { projectName: project.projectName, steps: ["Define mission use", "List assets", "Create smallest usable output", "QC/review", "Route to approval if public/client-facing"], approvalRequired: /public|client|publish/i.test(project.targetUse || "") };
}

export function generateAssetList(project: Record<string, any>) {
  return project.assetNeeds || ["source files", "audio", "visual references", "export preset", "approval checklist"];
}

export function generateCreativeCursorPrompt(project: Record<string, any>): string {
  return `Build or wire the creative UI/workflow for ${project.projectName}. Keep scope small and confirm mission alignment.`;
}

export function generateCreativeCodexPrompt(project: Record<string, any>): string {
  return `Create backend/script support for ${project.projectName}. Include local-only outputs, no auto-publishing, and approval gates.`;
}

export function generateCreativeRecommendation(project: Record<string, any>): string {
  const score = scoreCreativeMissionAlignment(project);
  return score.shouldDoNow ? "Do now because it supports the main mission." : score.shouldScheduleLater ? "Schedule later after cash/client/grant work." : "Archive as a creative idea until it supports the mission.";
}
