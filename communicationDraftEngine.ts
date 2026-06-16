export type DraftStyle = "Shorter" | "More Professional" | "Warmer" | "More Direct" | "More Confident" | "More Polite" | "More Sales-Focused";
export type CommunicationDraft = {
  id: string;
  documentType: string;
  audience: string;
  subject: string;
  body: string;
  classification: "internal-only" | "external-facing";
  approvalStatus: "Needs Cole Approval" | "Approved" | "Needs Review" | "Sent Manually" | "Archived";
  createdAt: string;
  updatedAt: string;
};

const drafts: CommunicationDraft[] = [];

export function createCommunicationDraft(input: Omit<CommunicationDraft, "classification" | "approvalStatus" | "createdAt" | "updatedAt"> & { externalFacing?: boolean }): CommunicationDraft {
  const now = new Date().toISOString();
  const classification = input.externalFacing === false ? "internal-only" : "external-facing";
  const draft = {
    id: input.id,
    documentType: input.documentType,
    audience: input.audience,
    subject: input.subject,
    body: sanitizeBody(input.body),
    classification,
    approvalStatus: classification === "external-facing" ? "Needs Cole Approval" : "Needs Review",
    createdAt: now,
    updatedAt: now,
  } as CommunicationDraft;
  drafts.push(draft);
  return draft;
}

export function rewriteDraft(draftId: string, style: DraftStyle): CommunicationDraft {
  const draft = findDraft(draftId);
  draft.body = sanitizeBody(`[${style}] ${draft.body}`);
  draft.approvalStatus = draft.classification === "external-facing" ? "Needs Cole Approval" : "Needs Review";
  draft.updatedAt = new Date().toISOString();
  return draft;
}

export function markDraftNeedsReview(draftId: string): CommunicationDraft {
  return updateDraftStatus(draftId, "Needs Review");
}

export function approveDraft(draftId: string): CommunicationDraft {
  return updateDraftStatus(draftId, "Approved");
}

export function markDraftSentManually(draftId: string): CommunicationDraft {
  return updateDraftStatus(draftId, "Sent Manually");
}

export function archiveDraft(draftId: string): CommunicationDraft {
  return updateDraftStatus(draftId, "Archived");
}

export function clearCommunicationDraftsForDemo(): void {
  drafts.length = 0;
}

function findDraft(id: string): CommunicationDraft {
  const draft = drafts.find((item) => item.id === id);
  if (!draft) throw new Error(`Draft ${id} not found.`);
  return draft;
}

function updateDraftStatus(id: string, approvalStatus: CommunicationDraft["approvalStatus"]): CommunicationDraft {
  const draft = findDraft(id);
  draft.approvalStatus = approvalStatus;
  draft.updatedAt = new Date().toISOString();
  return draft;
}

function sanitizeBody(body: string): string {
  return body.replace(/—/g, "-");
}
