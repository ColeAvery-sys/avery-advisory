import { createAgentGate, detectAgentRisks } from "./agentCivilizationSafety";

const messages: any[] = [];

export function createAgentMessage(message: any) {
  const stored = { ...message, id: message.id || `agent-message-${messages.length + 1}`, status: message.status || "Open", riskFlags: detectAgentRisks(message) };
  messages.push(stored);
  return stored;
}

export function respondToAgentMessage(messageId: string, response: any) {
  const message = findMessage(messageId);
  message.responses = [...(message.responses || []), response];
  message.status = response.escalate ? "Escalated" : "Responded";
  return message;
}

export function escalateAgentDependency(messageId: string, reason: string) {
  const message = findMessage(messageId);
  message.status = "Escalated";
  message.escalationReason = reason;
  return { ...message, ...createAgentGate("Agent communication escalation", detectAgentRisks(message).concat(["Escalation requires oversight review."])) };
}

export function getOpenAgentRequests(agentId: string) {
  return messages.filter((message) => (message.toAgentId === agentId || message.fromAgentId === agentId) && message.status === "Open");
}

function findMessage(messageId: string) {
  const message = messages.find((item) => item.id === messageId);
  if (!message) throw new Error(`Agent message ${messageId} not found.`);
  return message;
}
