import { createStudioGate, detectContentRisks } from "./contentStudioSafety";

const scripts: any[] = [];

export function createScriptProject(script: any) {
  const riskFlags = detectContentRisks(`${script.scriptTitle} ${script.goal || ""} ${script.fullScript || ""} ${script.sourceNotes || ""}`);
  const stored = { ...script, ...createStudioGate("Script", riskFlags) };
  scripts.push(stored);
  return stored;
}

export function generateHookOptions(script: any): string[] {
  return [
    `${script.targetAudience || "People"} are drowning in ${script.goal || "the wrong problem"}.`,
    `What if ${script.brand || "ATLAS"} made this 10% easier?`,
    `The hard part is not effort. It is friction.`,
  ];
}

export function generateOutline(script: any): string[] {
  return ["Hook", "Problem", "Why it matters", "Core idea", "Example", "Safety/limits", `CTA: ${script.CTA || "learn more"}`];
}

export function generateFullScript(script: any) {
  const outline = generateOutline(script);
  return { scriptTitle: script.scriptTitle, fullScript: outline.map((part) => `${part}: ${script.goal || "explain the idea clearly"}.`).join("\n"), approvalRequired: true };
}

export function generateShorterVersion(script: any) {
  return { scriptTitle: script.scriptTitle, version: "Short", text: `${script.hook || generateHookOptions(script)[0]} ${script.CTA || "Learn more."}`, approvalRequired: true };
}

export function generatePunchierVersion(script: any) {
  return { scriptTitle: script.scriptTitle, version: "Punchy", text: `${script.hook || "Your system is the product."} ${script.CTA || "Start with one next step."}`, approvalRequired: true };
}

export function generateSaferClaimsVersion(script: any) {
  const text = String(script.fullScript || script.goal || "").replace(/guarantee[ds]?/gi, "may help").replace(/cure|diagnose|therapy/gi, "support");
  return { scriptTitle: script.scriptTitle, text, claimsReviewRequired: true, approvalRequired: true };
}

export function extractShorts(script: any) {
  return generateHookOptions(script).map((hook, index) => ({ clipTitle: `${script.scriptTitle} Short ${index + 1}`, hook, CTA: script.CTA || "Follow for more", approvalRequired: true }));
}

export function validateScriptClaims(script: any) {
  const risks = detectContentRisks(`${script.fullScript || ""} ${(script.claimsToVerify || []).join(" ")}`);
  return { valid: risks.length === 0, risks, reviewRequired: risks.length > 0 };
}

