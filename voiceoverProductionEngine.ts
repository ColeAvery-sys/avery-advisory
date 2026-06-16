import { approved, createStudioGate, ensureApproval, estimateWords } from "./contentStudioSafety";

const plans: any[] = [];

export function createVoiceoverPlan(plan: any) {
  const stored = { ...plan, ...createStudioGate("Voiceover production"), generatedAudioStatus: plan.generatedAudioStatus || "Not Generated" };
  plans.push(stored);
  return stored;
}

export function estimateVoiceoverLength(script: string) {
  const words = estimateWords(script);
  const minutes = Math.max(1, Math.ceil(words / 140));
  return { words, estimatedMinutes: minutes, estimatedSeconds: minutes * 60 };
}

export function estimateCreditUsage(script: string) {
  return { estimatedCharacters: script.length, estimatedCredits: script.length, note: "Estimate only. Check ElevenLabs plan before generation." };
}

export function generateVoiceDirection(plan: any) {
  return { voiceType: plan.voiceType || "polished founder", tone: plan.tone || "clear, calm, confident", pacing: "medium, with pauses around key claims", approvalRequired: true };
}

export function generateRecordingNotes(plan: any) {
  return ["confirm script approval", "record one clean take first", "avoid repeated rerolls", "tag public/client/commercial use", "log rights and credits"];
}

export function markAudioGeneratedManually(planId: string, fileLink: string, approval?: { approvedByCole?: boolean }) {
  const plan = findPlan(planId);
  if (!approved(plan.scriptApprovalStatus || plan.approvalStatus)) throw new Error("Script must be approved before paid generation.");
  ensureApproval(approval, "Cole approval required before spending voice generation credits.");
  plan.generatedAudioStatus = "Generated Manually";
  plan.fileLink = fileLink;
  return plan;
}

export function attachAudioToProject(planId: string, projectId: string) {
  const plan = findPlan(planId);
  plan.attachedProjectId = projectId;
  return { planId, projectId, fileLink: plan.fileLink, approvalRequired: /public|client|commercial/i.test(`${plan.platform} ${plan.usageRights}`) };
}

export function logVoiceoverRights(planId: string) {
  const plan = findPlan(planId);
  return { planId, brand: plan.brand, platform: plan.platform, usageRights: plan.usageRights || "Needs Review", publicOrCommercial: /public|client|commercial/i.test(`${plan.platform} ${plan.usageRights}`), approvalRequired: true };
}

function findPlan(planId: string) {
  const plan = plans.find((entry) => entry.id === planId || entry.planId === planId);
  if (!plan) throw new Error(`Voiceover plan ${planId} not found.`);
  return plan;
}

