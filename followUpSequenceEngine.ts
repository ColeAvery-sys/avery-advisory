export type FollowUpSequence = {
  id: string;
  sequenceName: string;
  audience: string;
  trigger: string;
  numberOfSteps: number;
  intervalDays: number;
  messages?: Array<Record<string, any>>;
  stopCondition: string;
  approvalStatus: "Draft" | "Needs Cole Approval" | "Approved";
};

const sequences: FollowUpSequence[] = [];
const stoppedLeads: Record<string, string> = {};
const sentSteps: Array<Record<string, string>> = [];

export function createFollowUpSequence(sequence: FollowUpSequence): FollowUpSequence {
  const stored = { ...sequence, approvalStatus: "Needs Cole Approval" as const, messages: sequence.messages || generateSequenceMessages(sequence) };
  sequences.push(stored);
  return stored;
}

export function generateSequenceMessages(sequence: FollowUpSequence) {
  return Array.from({ length: sequence.numberOfSteps }, (_, index) => ({
    id: `${sequence.id}-step-${index + 1}`,
    subject: `${sequence.sequenceName} follow-up ${index + 1}`,
    body: `Draft only: checking whether ${sequence.audience} still wants to discuss the next step. Cole approval required before sending.`,
    purpose: index === 0 ? "reopen conversation" : "gentle follow-up",
    tone: "professional and direct",
    CTA: "Reply with the best next step",
    approvalRequired: true,
  }));
}

export function getNextFollowUpForLead(lead: Record<string, any>, sequence: FollowUpSequence) {
  if (stoppedLeads[lead.id]) return { stopped: true, reason: stoppedLeads[lead.id] };
  const messages = sequence.messages || generateSequenceMessages(sequence);
  return messages[0];
}

export function markFollowUpSentManually(leadId: string, stepId: string) {
  sentSteps.push({ leadId, stepId, sentManually: "true" });
  return { leadId, stepId, status: "Sent Manually", note: "ATLAS did not send this automatically." };
}

export function stopSequenceForLead(leadId: string, reason: string) {
  stoppedLeads[leadId] = reason;
  return { leadId, stopped: true, reason };
}

export function getSequencesByAudience(audience: string): FollowUpSequence[] {
  return sequences.filter((sequence) => sequence.audience === audience);
}

export function clearSequencesForDemo(): void {
  sequences.length = 0;
  sentSteps.length = 0;
  Object.keys(stoppedLeads).forEach((key) => delete stoppedLeads[key]);
}
