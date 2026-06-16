import { createRdGate, detectRdRisks, prototypeFirstStatus } from "./rdSafety";

const godotProjects: any[] = [];

export function createGodotStudioProject(project: any) {
  const stored = { ...project, id: project.id || `godot-${godotProjects.length + 1}`, engine: project.engine || "Godot 4", prototypeFirst: prototypeFirstStatus(project) };
  godotProjects.push(stored);
  return stored;
}

export function generateGameDesignDoc(project: any) {
  return {
    gameTitle: project.gameTitle || project.projectName,
    concept: project.concept,
    prototypeGoal: project.prototypeGoal || "Playable core loop before full production.",
    coreLoop: project.coreLoop || ["Move", "Interact", "Reward", "Reset"],
    artNeeded: project.artNeeded || [],
    audioNeeded: project.audioNeeded || [],
    programmingTasks: project.programmingTasks || ["Controller", "Interaction", "Win/lose condition"],
    prototypeFirst: prototypeFirstStatus(project),
    ...createRdGate("Godot game design doc", detectRdRisks(project)),
  };
}

export function generateGodotBuildPlan(project: any) {
  return ["Create minimal scene", "Implement core mechanic", "Add placeholder assets", "Playtest", "Record issues", "Validate before scope expansion"];
}

export function validateGodotPrototype(project: any) {
  const hasCoreLoop = Boolean(project.coreLoopValidated || project.prototypeValidated);
  return { gameTitle: project.gameTitle || project.projectName, prototypeValidated: hasCoreLoop, canEnterFullProduction: hasCoreLoop && project.approvalStatus === "Approved", approvalRequired: true };
}

export function blockScopeCreep(project: any) {
  return { gameTitle: project.gameTitle || project.projectName, recommendation: "Prototype first. Archive extra features until the playable loop is validated.", blockedFeatures: project.extraFeatures || [] };
}
