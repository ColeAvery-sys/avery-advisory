import { createStudioGate, rightsClear } from "./contentStudioSafety";

const plans: any[] = [];

export function createEditPlan(plan: any) {
  const stored = { ...plan, ...createStudioGate("DaVinci edit plan"), QCStatus: plan.QCStatus || "Not Started" };
  plans.push(stored);
  return stored;
}

export function generateTimelineStructure(plan: any): string[] {
  return ["cold open", "title/brand beat", "main sections", "b-roll/supporting visuals", "caption pass", "CTA/end card"];
}

export function generateResolveScriptPrompt(plan: any) {
  return `Create a DaVinci Resolve edit plan for ${plan.projectTitle}. Use ${plan.aspectRatio || "16:9"} for ${plan.targetPlatform || "YouTube"}. Do not publish or deliver.`;
}

export function generateAssetChecklist(plan: any): string[] {
  return ["script", "voiceover", "footage", "images", "b-roll", "music", "SFX", "captions", "thumbnail"].filter((item) => item !== "voiceover" || !!plan.voiceoverFile);
}

export function generateMotionNotes(plan: any) {
  return { motionStyle: plan.motionStyle || "clean founder demo", notes: ["keep text readable", "avoid excessive motion", "use simple punch-ins for emphasis"] };
}

export function generateExportPreset(plan: any) {
  return { platform: plan.targetPlatform || "YouTube", aspectRatio: plan.aspectRatio || "16:9", format: "MP4 H.264", captions: plan.captionNeeds || "Separate captions if possible" };
}

export function routeEditToFulfillment(planId: string) {
  const plan = findPlan(planId);
  return { planId, destination: /client/i.test(plan.videoType || "") ? "Service Order Fulfillment" : "Content QC Theater", approvalRequired: true };
}

export function validateEditPlan(plan: any) {
  const errors: string[] = [];
  if (!rightsClear(plan.assetRightsStatus || plan.rightsStatus)) errors.push("asset rights must be checked");
  if (/client/i.test(plan.videoType || "") && plan.approvalStatus !== "Approved") errors.push("client delivery requires approval");
  if (/youtube|public|short|ad/i.test(plan.videoType || plan.targetPlatform || "") && plan.approvalStatus !== "Approved") errors.push("public upload requires approval");
  return { valid: errors.length === 0, errors, approvalRequired: true };
}

function findPlan(planId: string) {
  const plan = plans.find((entry) => entry.id === planId || entry.planId === planId);
  if (!plan) throw new Error(`Edit plan ${planId} not found.`);
  return plan;
}

