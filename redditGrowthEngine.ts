import { createPlatformAction, ensureApproved } from "./mediaBaronSafety";

const subreddits: any[] = [];
const posts: any[] = [];

export function createSubredditRecord(subreddit: any) {
  const stored = { ...subreddit, riskLevel: subreddit.riskLevel || "Medium" };
  subreddits.push(stored);
  return stored;
}

export function summarizeSubredditRules(subreddit: any): string {
  return subreddit.rulesSummary || "Read community rules, avoid spam, avoid self-promo unless clearly allowed, and participate honestly.";
}

export function generateCommunitySafePost(input: any) {
  const post = { id: input.id || `reddit-post-${posts.length + 1}`, subreddit: input.subreddit, draftPost: `${input.context || "I am building this"}\n\nQuestion for this community: ${input.question || "what would make this useful?"}`, postStatus: "Draft", platformRisk: flagRedditSpamRisk(input).riskLevel, ...createPlatformAction("Reddit post", ["Respect subreddit rules. No spam or fake engagement."]) };
  posts.push(post);
  return post;
}

export function generateCommentStrategy(input: any) {
  return { strategy: "Answer questions honestly, disclose relevant affiliation, avoid repetitive links, and do not fake engagement.", approvalRequired: true };
}

export function generateFeedbackRequest(input: any) {
  return { draft: `I am looking for feedback on ${input.topic}. What would make this more useful or less annoying?`, approvalRequired: true };
}

export function flagRedditSpamRisk(post: any) {
  const text = `${post.draftPost || ""} ${post.link || ""}`.toLowerCase();
  const high = /buy now|limited time|dm me|click here|sale|guarantee/.test(text);
  return { riskLevel: high ? "High" : "Medium", warning: high ? "Likely too promotional for Reddit." : "Review community rules before posting." };
}

export function markPostedManually(postId: string) {
  const post = posts.find((entry) => entry.id === postId);
  if (!post) throw new Error(`Reddit post ${postId} not found.`);
  ensureApproved(post.approvalStatus);
  post.postStatus = "Posted Manually";
  return post;
}
