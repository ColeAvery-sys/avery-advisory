export type FeedbackRecord = { id: string; sourceName: string; sourceType: string; product: string; feature?: string; feedbackText: string; painPoint?: string; severity?: string; suggestedChange?: string; status?: string; relatedBug?: string; relatedFeature?: string; productManagerNotes?: string };
const feedbackRecords: FeedbackRecord[] = [];

export function createFeedbackRecord(feedback: FeedbackRecord): FeedbackRecord {
  const stored = { ...feedback, status: feedback.status || "New" };
  feedbackRecords.push(stored);
  return stored;
}

export function triageFeedback(feedbackId: string): FeedbackRecord {
  const feedback = findFeedback(feedbackId);
  const text = `${feedback.feedbackText} ${feedback.painPoint || ""}`.toLowerCase();
  feedback.status = /broken|bug|error|does not work|exposes/.test(text) ? "Bug" : /should|need|wish|feature/.test(text) ? "Feature Request" : "Triaged";
  return feedback;
}

export function convertFeedbackToFeature(feedbackId: string) {
  const feedback = findFeedback(feedbackId);
  feedback.status = "Feature Request";
  return { id: `feature-from-${feedbackId}`, featureTitle: feedback.suggestedChange || feedback.feedbackText, product: feedback.product, problemSolved: feedback.painPoint || feedback.feedbackText, targetUser: feedback.sourceType, requirements: [feedback.suggestedChange || "Clarify requirement"], priority: feedback.severity || "Medium" };
}

export function convertFeedbackToBug(feedbackId: string) {
  const feedback = findFeedback(feedbackId);
  feedback.status = "Bug";
  return { id: `bug-from-${feedbackId}`, bugTitle: feedback.feedbackText, product: feedback.product, expectedBehavior: "User can complete intended workflow safely.", actualBehavior: feedback.painPoint || feedback.feedbackText };
}

export function summarizeFeedback(product: string) {
  const records = feedbackRecords.filter((entry) => entry.product === product);
  return { product, count: records.length, severe: records.filter((entry) => /Critical|High/i.test(entry.severity || "")).length, repeated: identifyRepeatedFeedback({ feedback: records }) };
}

export function identifyRepeatedFeedback(data: Record<string, any>) {
  const records = data.feedback || feedbackRecords;
  const grouped = records.reduce((acc: Record<string, number>, item: FeedbackRecord) => {
    const key = (item.feature || item.painPoint || item.feedbackText).toLowerCase();
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  return Object.keys(grouped).filter((key) => grouped[key] > 1).map((key) => ({ pattern: key, count: grouped[key], recommendation: "Consider roadmap priority if aligned with strategy." }));
}

function findFeedback(feedbackId: string): FeedbackRecord {
  const feedback = feedbackRecords.find((entry) => entry.id === feedbackId);
  if (!feedback) throw new Error(`Feedback ${feedbackId} not found.`);
  return feedback;
}
