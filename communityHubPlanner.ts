import { createAudienceGate } from "./audienceSafety";

const hubs: any[] = [];

export function createCommunityHubPlan(plan: any) {
  const stored = { ...plan, ...createAudienceGate("Community hub"), status: plan.status || "Planning" };
  hubs.push(stored);
  return stored;
}

export function generateCommunityChannels(plan: any): string[] {
  const base = ["announcements", "introductions", "questions", "wins", "feedback", "resources"];
  if (/atlas assist/i.test(plan.communityName || "")) return base.concat(["accessibility-feedback", "pilot-notes"]);
  if (/creator/i.test(plan.communityName || "")) return base.concat(["clip-lab", "workflow-help"]);
  if (/prometheus/i.test(plan.communityName || "")) return base.concat(["philosophy-club", "essay-discussion"]);
  return base;
}

export function generateCommunityRules(plan: any): string[] {
  return ["No harassment", "No spam or fake engagement", "Respect privacy", "No medical/legal/financial advice claims", "Keep feedback specific and kind"];
}

export function generateModerationPlan(plan: any) {
  return { roles: ["Owner", "Moderator", "Member"], escalationRules: ["threats or harassment -> Cole", "refund/client issues -> Cole", "medical/legal/financial claims -> review"], approvalRequired: true };
}

export function generateCommunityEventIdeas(plan: any): string[] {
  return ["monthly office hours", "feedback sprint", "build-in-public review", "creator workflow teardown", "accessibility tool discussion"];
}

