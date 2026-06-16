const davinciProjects: any[] = [];

export function createDavinciProject(project: Record<string, any>) {
  const stored = { ...project, timelineStatus: project.timelineStatus || "Planned", approvalStatus: project.approvalStatus || "Needs Cole Approval" };
  davinciProjects.push(stored);
  return stored;
}

export function generateDavinciProjectPlan(project: Record<string, any>) {
  return { videoTitle: project.videoTitle, steps: ["Import frames/clips", "Create timeline", "Arrange media", "Add motion/zoom", "Add music/SFX", "Add captions if needed", "Export draft", "QC review", "Cole approval", "Manual publish/delivery"], approvalRequired: true };
}

export function generateResolveScriptPrompt(project: Record<string, any>): string {
  return `Generate DaVinci Resolve automation plan for ${project.videoTitle}: import assets, build timeline, captions if needed, export preset. No auto-publishing.`;
}

export function generateShotList(project: Record<string, any>): string[] {
  return project.sourceAssets || ["opening shot", "main demo shot", "detail shot", "CTA/end card"];
}

export function generateAssetList(project: Record<string, any>): string[] {
  return (project.sourceAssets || []).concat(project.audioAssets || []).concat(["captions if needed", "export preset"]);
}

export function generateExportPreset(project: Record<string, any>) {
  return { platform: project.targetPlatform, aspectRatio: project.aspectRatio || "16:9", format: "MP4 H.264", approvalRequired: /client|public/i.test(project.videoType || "") };
}

export function generateVideoQcChecklist(project: Record<string, any>): string[] {
  return ["no private/internal info", "audio clear", "captions checked", "aspect ratio correct", "export plays", "client/public approval before delivery or publishing"];
}

export function routeToEditingFulfillment(projectId: string) {
  const project = davinciProjects.find((entry) => entry.id === projectId);
  if (!project) throw new Error(`DaVinci project ${projectId} not found.`);
  return { projectId, routedTo: "Editing Fulfillment", approvalRequired: /client/i.test(project.videoType || ""), warning: "Client videos require approval before delivery." };
}
