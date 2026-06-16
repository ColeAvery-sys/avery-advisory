import { countBy, detectAudienceRisks, sentimentScore } from "./audienceSafety";

const comments: any[] = [];

export function createCommentRecord(comment: any) {
  const stored = { ...comment, category: comment.category || classifyComment(comment), sentimentScore: sentimentScore(comment.text || comment.commentText || "") };
  comments.push(stored);
  return stored;
}

export function classifyComment(comment: any): string {
  const text = String(comment.text || comment.commentText || "").toLowerCase();
  if (/hire|price|service|editing|client|quote/.test(text)) return "Potential Lead";
  if (/partner|clinic|grant|fund|collab/.test(text)) return "Partnership Inquiry";
  if (/feature|could you|wish it|add/.test(text)) return "Feature Request";
  if (/broken|bad|complaint|refund|angry/.test(text)) return "Complaint";
  if (/how|what|why|when|\?/.test(text)) return "Question";
  if (/love|great|thanks|amazing/.test(text)) return "Praise";
  if (/troll|idiot|scam/.test(text)) return "Troll";
  return "Comment";
}

export function analyzeComments(input: any[]) {
  const records = input.map(createCommentRecord);
  return {
    commonQuestions: records.filter((comment) => comment.category === "Question"),
    mostRequestedTopics: Object.entries(countBy(records, (comment: any) => comment.topic || comment.relatedTopic)).sort((a: any, b: any) => b[1] - a[1]),
    potentialClients: records.filter((comment) => comment.category === "Potential Lead"),
    potentialPartners: records.filter((comment) => comment.category === "Partnership Inquiry"),
    communityRisks: records.filter((comment) => detectAudienceRisks(comment.text || comment.commentText || "").length > 0 || comment.category === "Troll"),
  };
}

export function generateCommentInsights(data: any) {
  const records = data.comments || comments;
  return {
    categories: countBy(records, (comment: any) => comment.category || classifyComment(comment)),
    averageSentiment: records.length ? records.reduce((sum: number, comment: any) => sum + (comment.sentimentScore || sentimentScore(comment.text || "")), 0) / records.length : 0,
    contentIdeas: records.filter((comment: any) => /question|feature request/i.test(comment.category || "")).map((comment: any) => `Answer: ${comment.text || comment.commentText}`),
  };
}

