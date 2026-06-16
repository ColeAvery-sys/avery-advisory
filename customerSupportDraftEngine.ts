export type SupportMessage = { id: string; senderName: string; platform: string; message: string; category?: string; sentiment?: string; urgency?: number; suggestedReply?: string; riskLevel?: string; approvalStatus?: string; relatedOrder?: string; relatedClient?: string; relatedListing?: string; status?: string };
const messages: SupportMessage[] = [];

export function createSupportMessage(message: SupportMessage): SupportMessage {
  const classification = classifySupportMessage(message);
  const stored = { ...message, category: message.category || classification.category, riskLevel: classification.riskLevel, approvalStatus: "Needs Cole Approval", status: "Draft Reply Needed" };
  messages.push(stored);
  return stored;
}

export function classifySupportMessage(message: SupportMessage) {
  const text = message.message.toLowerCase();
  if (/refund|payment|charge|legal|health|medical|angry|complaint|client conflict/.test(text)) return { category: "Sensitive", riskLevel: "High" };
  if (/question|how|when|where/.test(text)) return { category: "Question", riskLevel: "Medium" };
  return { category: "General", riskLevel: "Low" };
}

export function generateSupportReply(message: SupportMessage) {
  const classification = classifySupportMessage(message);
  return {
    reply: `Draft only: Hi ${message.senderName}, thanks for reaching out. I am checking this carefully and will respond with the right next step after review.`,
    approvalRequired: true,
    riskLevel: classification.riskLevel,
    escalationRequired: classification.riskLevel === "High",
  };
}

export function rewriteSupportReply(reply: string, style: string): string {
  if (/warmer/i.test(style)) return `Thanks for reaching out. ${reply}`;
  if (/direct/i.test(style)) return reply.replace(/thanks for reaching out\.?\s*/i, "");
  return reply;
}

export function escalateSensitiveMessage(message: SupportMessage) {
  return { messageId: message.id, escalationTarget: "Cole Approval", reason: "Sensitive customer/support message requires review.", approvalRequired: true };
}

export function markReplySentManually(messageId: string): SupportMessage {
  const message = messages.find((entry) => entry.id === messageId);
  if (!message) throw new Error(`Support message ${messageId} not found.`);
  if (message.approvalStatus !== "Approved") throw new Error("Cole approval required before marking reply sent.");
  message.status = "Sent Manually";
  return message;
}
