import { createPlatformAction, ensureApproved } from "./mediaBaronSafety";

const ideas: any[] = [];
const posts: any[] = [];

export function createSourceIdea(idea: any) {
  const stored = { ...idea, status: "Draft" };
  ideas.push(stored);
  return stored;
}

export function generatePlatformVariations(idea: any, platforms: string[]) {
  return platforms.map((platform) => createPostDraft({ sourceIdea: idea.sourceIdea || idea.title, brand: idea.brand, campaign: idea.campaign, targetPlatform: platform, postType: platform === "Blog" ? "Article" : "Post", caption: rewriteForPlatform(idea.content || idea.sourceIdea || idea.title, platform), hook: idea.hook || idea.title, hashtags: generateHashtags(idea.content || idea.title, platform), CTA: generateCTA(idea, idea.goal || "lead"), link: idea.link }));
}

export function rewriteForPlatform(content: string, platform: string): string {
  if (/reddit/i.test(platform)) return `${content}\n\nCommunity-specific note: share context, ask for feedback, and avoid sales pressure.`;
  if (/instagram|tiktok|shorts/i.test(platform)) return `${content}\n\nShort, visual, and CTA-light.`;
  return content;
}

export function generateHashtags(content: any, platform: string): string[] {
  if (/reddit|newsletter|blog/i.test(platform)) return [];
  const text = typeof content === "string" ? content : JSON.stringify(content);
  const tags = ["#AveryTech", "#CreatorLogistics"];
  if (/accessibility/i.test(text)) tags.push("#Accessibility");
  if (/editing|creator|content/i.test(text)) tags.push("#ContentCreator");
  return tags.slice(0, /instagram/i.test(platform) ? 8 : 4);
}

export function generateCTA(content: any, goal: string): string {
  if (/service|lead|client/i.test(goal)) return "Start with the Creator Logistics intake form.";
  if (/demo|pilot/i.test(goal)) return "Request a demo.";
  return "Learn more from AveryTech.";
}

export function createPostDraft(post: any) {
  const risk = /reddit/i.test(post.targetPlatform) ? ["Reddit posts must be community-specific and non-spammy."] : [];
  const stored = { ...post, postStatus: "Draft", performance: {}, ...createPlatformAction("Public post", risk) };
  posts.push(stored);
  return stored;
}

export function markPostedManually(postId: string) {
  const post = posts.find((entry) => entry.id === postId);
  if (!post) throw new Error(`Post ${postId} not found.`);
  ensureApproved(post.approvalStatus);
  post.postStatus = "Posted Manually";
  return post;
}
