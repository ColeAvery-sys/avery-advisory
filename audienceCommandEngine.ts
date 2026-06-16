import { countBy, sentimentScore } from "./audienceSafety";

const audienceSnapshots: any[] = [];

export function createAudienceSnapshot(snapshot: any) {
  const stored = { ...snapshot, createdAt: snapshot.createdAt || new Date(0).toISOString() };
  audienceSnapshots.push(stored);
  return stored;
}

export function generateAudienceDashboard(data: any) {
  const contacts = data.contacts || [];
  const comments = data.comments || [];
  return {
    audienceSize: sumPlatforms(data.platforms || []),
    growth: data.growth || 0,
    engagement: data.engagement || 0,
    topFans: contacts.filter((contact: any) => /superfan|supporter/i.test(contact.relationshipType || contact.communityStatus || "")),
    clientLeads: contacts.filter((contact: any) => /client|customer|partner|investor/i.test(contact.relationshipType || "")),
    audienceSentiment: calculateAudienceSentiment(comments),
    communityRisks: comments.filter((comment: any) => sentimentScore(comment.text || comment.commentText || "") < 0),
    platformBreakdown: countBy(data.platforms || [], (platform: any) => platform.platformName || platform.platform),
  };
}

export function identifyTopAudienceSegments(data: any) {
  const contacts = data.contacts || [];
  return Object.entries(countBy(contacts, (contact: any) => contact.relationshipType)).map(([segment, count]) => ({ segment, count })).sort((a: any, b: any) => b.count - a.count);
}

export function identifyCommunityRisks(data: any) {
  return (data.comments || []).filter((comment: any) => /refund|angry|scam|harass|threat|dox|spam/i.test(comment.text || comment.commentText || ""));
}

export function generateAudienceRecommendation(data: any) {
  const dashboard = generateAudienceDashboard(data);
  if (dashboard.clientLeads.length) return { priority: "Follow up with warm client/partner leads", approvalRequired: true };
  if (dashboard.communityRisks.length) return { priority: "Review community risks before posting more", approvalRequired: true };
  if ((data.newsletterSubscribers || 0) < 100) return { priority: "Push newsletter capture with a useful lead magnet", approvalRequired: false };
  return { priority: "Create content for most engaged segment", approvalRequired: false };
}

function sumPlatforms(platforms: any[]): number {
  return platforms.reduce((sum, platform) => sum + (Number(platform.followers) || Number(platform.subscribers) || 0), 0);
}

function calculateAudienceSentiment(comments: any[]) {
  const total = comments.reduce((sum, comment) => sum + sentimentScore(comment.text || comment.commentText || ""), 0);
  return total > 0 ? "Positive" : total < 0 ? "Negative" : "Mixed/Neutral";
}

