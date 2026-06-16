export type GmailDraftStatus = "Draft" | "Needs Cole Approval" | "Approved for Gmail Draft" | "Gmail Draft Created" | "Sent Manually" | "Needs Changes" | "Archived";
export type GmailDraftType = "Creator Logistics outreach" | "Creator follow-up" | "Client delivery" | "Grant funder question" | "Investor/patron pitch" | "Contractor instructions" | "College/admin email" | "Local business partnership" | "Clinic/disability partner outreach";

export type GmailDraftRecord = {
  id: string;
  subject: string;
  recipientName: string;
  recipientEmail: string;
  body: string;
  draftType: GmailDraftType;
  department: string;
  relatedClient?: string;
  relatedGrant?: string;
  relatedCampaign?: string;
  approvalStatus: GmailDraftStatus;
  gmailStatus: "Not Created" | "Placeholder Created" | "Created Manually";
  riskLevel: "Medium" | "High";
  createdAt: string;
  updatedAt: string;
};

const gmailDrafts: GmailDraftRecord[] = [];

export function createGmailDraftRecord(input: Omit<GmailDraftRecord, "approvalStatus" | "gmailStatus" | "riskLevel" | "createdAt" | "updatedAt">): GmailDraftRecord {
  const now = new Date().toISOString();
  const record: GmailDraftRecord = { ...input, body: sanitize(input.body), approvalStatus: "Needs Cole Approval", gmailStatus: "Not Created", riskLevel: getRiskLevel(input), createdAt: now, updatedAt: now };
  gmailDrafts.push(record);
  return record;
}

export function getGmailDraftsByStatus(status: GmailDraftStatus): GmailDraftRecord[] {
  return gmailDrafts.filter((draft) => draft.approvalStatus === status);
}

export function markApprovedForGmailDraft(id: string): GmailDraftRecord {
  return updateDraft(id, { approvalStatus: "Approved for Gmail Draft" });
}

export function createGmailDraftPlaceholder(id: string): GmailDraftRecord {
  const draft = findDraft(id);
  if (draft.approvalStatus !== "Approved for Gmail Draft") throw new Error("Cole approval required before creating Gmail draft placeholder.");
  return updateDraft(id, { approvalStatus: "Gmail Draft Created", gmailStatus: "Placeholder Created" });
}

export function markGmailDraftSentManually(id: string): GmailDraftRecord {
  return updateDraft(id, { approvalStatus: "Sent Manually", gmailStatus: "Created Manually" });
}

export function markGmailDraftNeedsChanges(id: string): GmailDraftRecord {
  return updateDraft(id, { approvalStatus: "Needs Changes" });
}

export function archiveGmailDraft(id: string): GmailDraftRecord {
  return updateDraft(id, { approvalStatus: "Archived" });
}

export function clearGmailDraftCenterForDemo(): void {
  gmailDrafts.length = 0;
}

function findDraft(id: string): GmailDraftRecord {
  const draft = gmailDrafts.find((item) => item.id === id);
  if (!draft) throw new Error(`Gmail draft ${id} not found.`);
  return draft;
}

function updateDraft(id: string, updates: Partial<GmailDraftRecord>): GmailDraftRecord {
  const draft = findDraft(id);
  Object.assign(draft, updates, { updatedAt: new Date().toISOString() });
  return draft;
}

function getRiskLevel(input: Pick<GmailDraftRecord, "draftType" | "department">): "Medium" | "High" {
  return /client|grant|contractor|college|investor|clinic|partner/i.test(`${input.draftType} ${input.department}`) ? "High" : "Medium";
}

function sanitize(value: string): string {
  return value.replace(/—/g, "-");
}
