const godotProjects: any[] = [];
export const godotDefaultTemplates = ["third-person controller", "first-person controller", "dialogue system", "collectible system", "scene transition", "main menu", "pause menu", "simple enemy AI", "interaction prompt", "Windows export preset"];

export function createGodotProject(project: Record<string, any>) {
  const stored = { ...project, engine: "Godot 4", targetStyle: project.targetStyle || "low-poly N64/PS2-style prototype", buildStatus: project.buildStatus || "Prototype" };
  godotProjects.push(stored);
  return stored;
}

export function generateGameDesignBrief(project: Record<string, any>) {
  return { title: project.gameTitle, concept: project.concept, mainMechanic: project.mainMechanic, scopeRule: "Small playable prototype beats massive game.", approvalRequired: false };
}

export function generateSceneChecklist(project: Record<string, any>) {
  return ["player spawn", "camera", "lighting", "collision", "interaction prompt", "pause menu", "win/exit condition"].concat(project.assetNeeds || []);
}

export function generateGodotCursorPrompt(project: Record<string, any>): string {
  return `Create Godot 4 scene for ${project.gameTitle}. Use a small playable prototype scope, ${project.targetStyle || "low-poly style"}, and include ${project.mainMechanic}.`;
}

export function generateGodotCodexPrompt(project: Record<string, any>): string {
  return `Write or debug Godot scripts for ${project.gameTitle}: ${project.scriptNeeds || "controller, interaction, export checks"}. No auto-publishing builds.`;
}

export function generateGodotExportChecklist(project: Record<string, any>): string[] {
  return ["Windows export preset", "no debug secrets", "controls tested", "main menu works", "quit works", "prototype notes included"];
}

export function createGodotBug(projectId: string, bug: Record<string, any>) {
  return { id: `godot-bug-${projectId}-${Date.now()}`, projectId, ...bug, approvalRequired: false };
}

export function calculatePrototypeReadiness(project: Record<string, any>) {
  let score = 100;
  if (!project.currentScene) score -= 20;
  if (!project.mainMechanic) score -= 25;
  if ((project.bugs || []).length) score -= (project.bugs || []).length * 10;
  if (!project.exportTarget) score -= 10;
  return { readinessScore: Math.max(0, score), demoReady: score >= 70, warning: "Prototype demo-ready does not mean public release-ready." };
}
