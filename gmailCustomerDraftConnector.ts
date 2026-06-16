import { connectorLog, detectConnectorRisks, ensureApproval, requireFields } from "./platformConnectorSafety";

const drafts: any[] = [];

export function validateCustomerDraft(draft: any) {
  const missing = requireFields(draft, ["draftId", "recipientEmail", "subject", "body"]);
  const risks = detectConnectorRisks(`${draft.subject} ${draft.body} ${draft.messageType || ""}`);
  const errors = missing.map((field) => `${field} missing`).concat(risks);
  const escalationRequired = risks.length > 0 || /refund|dispute|legal|medical|financial|payment/i.test(`${draft.messageType} ${draft.body}`);
  return { valid: errors.length === 0, errors, escalationRequired, approvalRequired: true };
}

export function createGmailCustomerDraftAfterApproval(draft: any, approval: { approvedByCole?: boolean }, gmailClient?: any) {
  ensureApproval(approval, "Cole approval required before creating Gmail draft.");
  const validation = validateCustomerDraft(draft);
  if (!validation.valid) throw new Error(validation.errors.join("; "));
  const stored = { ...draft, gmailDraftStatus: gmailClient ? "Created by Client" : "Mock Draft Created", gmailDraftLink: gmailClient ? "external-gmail-draft-link" : `local-gmail-draft://${draft.draftId}` };
  drafts.push(stored);
  logGmailCustomerAction({ draftId: draft.draftId, action: "create Gmail draft", status: stored.gmailDraftStatus });
  return stored;
}

export function generateCustomerDraftFromOrder(order: any) {
  return { draftId: `draft-${order.orderId || order.id}`, recipientName: order.customerName, recipientEmail: order.customerEmail || "", subject: `Update on ${order.productOrService}`, body: "Draft only. ATLAS will not send this email automatically.", messageType: "customer update", relatedOrder: order.orderId || order.id, approvalStatus: "Needs Cole Approval" };
}

export function generateRevisionResponseDraft(revision: any) {
  return { draftId: `revision-${revision.requestId || revision.id}`, recipientEmail: revision.email || "", subject: `Revision update for ${revision.projectName}`, body: "Draft revision response. Scope and delivery need review before sending.", messageType: "revision response", approvalStatus: "Needs Cole Approval" };
}

export function generateRefundConcernDraft(issue: any) {
  return { draftId: `refund-${issue.issueId || issue.id}`, recipientEmail: issue.email || "", subject: "Refund concern follow-up", body: "Draft refund response. This is sensitive and must be reviewed before sending.", messageType: "refund/dispute response", riskLevel: "High", approvalStatus: "Needs Cole Approval" };
}

export function markCustomerEmailSentManually(draftId: string, approval?: { approvedByCole?: boolean }) {
  ensureApproval(approval, "Cole approval required before logging customer email sent manually.");
  const draft = drafts.find((entry) => entry.draftId === draftId);
  if (!draft) throw new Error(`Gmail draft ${draftId} not found.`);
  draft.gmailDraftStatus = "Sent Manually";
  return draft;
}

export function logGmailCustomerAction(action: any) {
  return connectorLog({ platform: "Gmail", ...action });
}

