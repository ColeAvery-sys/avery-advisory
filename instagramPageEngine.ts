import { createPlatformAction, detectRightsRisks, ensureApproved } from "./mediaBaronSafety";

const accounts: any[] = [];
const posts: any[] = [];

export function createInstagramAccountRecord(account: any) {
  const stored = { ...account, approvalStatus: "Needs Cole Approval" };
  accounts.push(stored);
  return stored;
}

export function generateReelScript(input: any) {
  return { hook: input.hook || "Here is the system behind the chaos.", beats: ["show problem", "show process", "show result", "CTA"], approvalRequired: true, riskWarnings: detectRightsRisks(input.topic || "") };
}

export function generateCaption(input: any) {
  return `${input.topic || "AveryTech update"}\n\n${input.CTA || "Learn more after approval."}`;
}

export function generateHashtags(input: any): string[] {
  const tags = ["#AveryTech", "#CreatorLogistics"];
  if (/accessibility/i.test(input.topic || "")) tags.push("#Accessibility");
  if (/editing|creator/i.test(input.topic || "")) tags.push("#ContentCreator");
  return tags.slice(0, 8);
}

export function generateCarouselOutline(input: any): string[] {
  return ["Slide 1: Hook", "Slide 2: Problem", "Slide 3: Framework", "Slide 4: Example", "Slide 5: CTA"].map((slide) => `${slide} for ${input.topic || "AveryTech"}`);
}

export function generateBio(account: any): string {
  return `${account.accountName}: practical systems, media, and AveryTech updates.`;
}

export function generateStorySequence(input: any): string[] {
  return [`Question: ${input.topic || "What are you building?"}`, "Behind the scenes", "CTA sticker draft"];
}

export function markPostedManually(postId: string) {
  const post = posts.find((entry) => entry.id === postId);
  if (!post) throw new Error(`Instagram post ${postId} not found.`);
  ensureApproved(post.approvalStatus);
  post.postStatus = "Posted Manually";
  return post;
}

export function createInstagramPostDraft(input: any) {
  const post = { ...input, id: input.id || `ig-post-${posts.length + 1}`, postStatus: "Draft", ...createPlatformAction("Instagram post") };
  posts.push(post);
  return post;
}
