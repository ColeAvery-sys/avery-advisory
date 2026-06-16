import { createPlatformAction, detectRightsRisks, ensureApproved } from "./mediaBaronSafety";

const pages: any[] = [];
const posts: any[] = [];

export function createFacebookPageRecord(page: any) {
  const stored = { ...page, approvalStatus: "Needs Cole Approval" };
  pages.push(stored);
  return stored;
}

export function generateFacebookPost(input: any) {
  const post = { id: input.id || `fb-post-${posts.length + 1}`, pageName: input.pageName, caption: input.caption || `${input.campaign || "AveryTech"} update: ${input.message || "new draft"}`, CTA: input.CTA || "Learn more", postStatus: "Draft", ...createPlatformAction("Facebook post", detectRightsRisks(input.caption || input.message || "")) };
  posts.push(post);
  return post;
}

export function generatePageBio(page: any): string {
  return `${page.pageName} shares practical updates, services, and product progress from Avery Industries LLC. Page changes require Cole approval.`;
}

export function generateAdDraft(campaign: any) {
  return { campaignName: campaign.campaignName, copy: `${campaign.offer || "AveryTech"} for ${campaign.targetAudience || "the right audience"}.`, approvalRequired: true, budgetApprovalRequired: true };
}

export function generateLeadFormCopy(campaign: any) {
  return { headline: `Request ${campaign.offer || "more info"}`, questions: ["Name", "Email", "What do you need?", "Budget range", "Timeline"], approvalRequired: true };
}

export function markPostedManually(postId: string) {
  const post = posts.find((entry) => entry.id === postId);
  if (!post) throw new Error(`Facebook post ${postId} not found.`);
  ensureApproved(post.approvalStatus);
  post.postStatus = "Posted Manually";
  return post;
}

export function recordFacebookPerformance(postId: string, metrics: any) {
  const post = posts.find((entry) => entry.id === postId);
  if (!post) throw new Error(`Facebook post ${postId} not found.`);
  post.performance = metrics;
  return post;
}
