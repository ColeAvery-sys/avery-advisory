import { countBy, detectAudienceRisks } from "./audienceSafety";

const feedbackRecords: any[] = [];

export function createFeedbackRecord(record: any) {
  const stored = { ...record, category: record.category || classifyFeedback(record), riskFlags: detectAudienceRisks(record.feedbackText || record.text || "") };
  feedbackRecords.push(stored);
  return stored;
}

export function classifyFeedback(record: any): string {
  const text = String(record.feedbackText || record.text || "").toLowerCase();
  if (/feature|add|wish|could/.test(text)) return "Feature Request";
  if (/product|template|book|merch/.test(text)) return "Product Request";
  if (/community|discord|group/.test(text)) return "Community Request";
  if (/pain|hard|struggle|problem/.test(text)) return "Pain Point";
  return "General Feedback";
}

export function mineFeedback(data: any) {
  const records = (data.feedback || feedbackRecords).map((record: any) => record.category ? record : createFeedbackRecord(record));
  return {
    featureRequests: records.filter((record: any) => record.category === "Feature Request"),
    productRequests: records.filter((record: any) => record.category === "Product Request"),
    communityRequests: records.filter((record: any) => record.category === "Community Request"),
    painPointReports: records.filter((record: any) => record.category === "Pain Point"),
    categoryCounts: countBy(records, (record: any) => record.category),
  };
}

export function generateOpportunityReport(data: any) {
  const mined = mineFeedback(data);
  const topCategory = Object.entries(mined.categoryCounts).sort((a: any, b: any) => b[1] - a[1])[0];
  return { topCategory: topCategory ? topCategory[0] : "None", recommendation: topCategory ? `Prioritize ${topCategory[0]} follow-up.` : "Collect more feedback.", approvalRequired: false };
}

