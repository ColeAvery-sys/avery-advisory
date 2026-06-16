import { createStudioGate, rightsClear } from "./contentStudioSafety";

const shotLists: any[] = [];

export function createShotList(project: any) {
  const stored = { ...project, ...createStudioGate("Shot list"), shots: project.shots || [] };
  shotLists.push(stored);
  return stored;
}

export function generateShotListFromScript(script: any) {
  const sections = script.outline || ["hook", "problem", "solution", "CTA"];
  return sections.map((section: string, index: number) => ({ shotId: `${script.scriptTitle || "script"}-${index + 1}`, scriptSection: section, shotDescription: `Visual support for ${section}`, status: "Needed", rightsStatus: "Needs Review", priority: index === 0 ? "High" : "Medium" }));
}

export function generateBrollIdeas(script: any) {
  return ["screen recording", "product demo", "founder desk shot", "abstract motion graphic", "public-domain or owned support visual"].map((idea) => ({ idea, rightsStatus: "Needs Review" }));
}

export function flagMissingAssets(shotList: any) {
  return (shotList.shots || shotList).filter((shot: any) => /needed|missing/i.test(shot.status || "") || !rightsClear(shot.rightsStatus));
}

export function routeAssetRequests(shotList: any) {
  return flagMissingAssets(shotList).map((shot: any) => ({ requestTitle: shot.assetNeeded || shot.shotDescription, assetType: "b-roll", purpose: shot.scriptSection, rightsStatus: shot.rightsStatus, approvalRequired: true }));
}

export function sendShotListToEditPlanner(shotListId: string) {
  const shotList = findShotList(shotListId);
  return { projectTitle: shotList.projectTitle, bRollList: shotList.shots || [], approvalRequired: true };
}

function findShotList(shotListId: string) {
  const shotList = shotLists.find((entry) => entry.id === shotListId || entry.shotListId === shotListId);
  if (!shotList) throw new Error(`Shot list ${shotListId} not found.`);
  return shotList;
}

