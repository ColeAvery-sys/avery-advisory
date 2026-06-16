import { createReminder } from "./calendarIntegrationService";
import { logMemoryAction } from "./memoryEngineService";
import { saveMemory, linkMemoryToContact, linkMemoryToProject, linkMemoryToTask } from "./memoryEngineService";
import {
  EmailClassification,
  EmailForwardInput,
  EmailInput,
  EmailPermissionContext,
  EmailReplyInput,
  EmailRecord,
  EmailSearchFilters,
  EmailSendInput,
  EmailState,
  EmailUpdateInput,
  EmailView,
} from "./emailIntegrationTypes";
import {
  cloneEmailState,
  getEmailRecord,
  loadEmailState,
  removeEmailRecord,
  resetEmailRuntime,
  saveEmailState,
  upsertEmailRecord,
} from "./emailIntegrationRepository";

export interface EmailThreadView {
  threadId: string;
  emails: EmailView[];
}

export function createDraft(input: EmailInput): EmailView {
  return saveEmailItem("Draft", input, "Email Drafted", { draftedAt: new Date().toISOString() });
}

export function updateDraft(emailId: string, patch: EmailUpdateInput, context: EmailPermissionContext): EmailView {
  const email = requireEmail(emailId);
  ensureEditable(email);
  applyPatch(email, patch);
  email.updatedAt = new Date().toISOString();
  logMemoryAction("Email Updated", "Email", email.id, context.actor || "ATLAS", "Success", { status: email.status });
  upsertEmailRecord(email);
  return cloneEmail(email);
}

export function deleteDraft(emailId: string, context: EmailPermissionContext): EmailView {
  const email = requireEmail(emailId);
  ensureEditable(email);
  email.status = "Deleted";
  email.deletedAt = new Date().toISOString();
  email.updatedAt = email.deletedAt;
  logMemoryAction("Email Deleted", "Email", email.id, context.actor || "ATLAS", "Success", { subject: email.subject });
  upsertEmailRecord(email);
  return cloneEmail(email);
}

export function sendEmail(input: EmailSendInput): EmailView {
  if (input.draftId) {
    const draft = requireEmail(input.draftId);
    ensureEditable(draft);
    const merged = cloneEmail(draft);
    applyPatch(merged, input);
    merged.status = "Sent";
    merged.sentAt = new Date().toISOString();
    merged.timestamp = merged.sentAt;
    merged.updatedAt = merged.sentAt;
    merged.followUpStatus = deriveFollowUpStatus(merged);
    persistFollowUp(merged, "Email Sent");
    return cloneEmail(merged);
  }

  return saveEmailItem("Sent", input, "Email Sent", { sentAt: new Date().toISOString() });
}

export function receiveEmail(input: EmailInput): EmailView {
  return saveEmailItem("Received", input, "Email Received", { receivedAt: new Date().toISOString() });
}

export function sendReply(emailId: string, input: EmailReplyInput, context: EmailPermissionContext): EmailView {
  const original = requireEmail(emailId);
  const threadId = input.threadId || original.threadId;
  const sender = input.sender || original.recipients[0] || "ATLAS";
  const recipients = input.recipients && input.recipients.length > 0 ? input.recipients : [original.sender];
  const reply = saveEmailItem("Replied", {
    ...input,
    sender: sender,
    recipients: recipients,
    threadId: threadId,
    linkedProjectIds: input.linkedProjectIds || original.linkedProjectIds,
    linkedTaskIds: input.linkedTaskIds || original.linkedTaskIds,
    linkedContactIds: input.linkedContactIds || original.linkedContactIds,
    linkedMemoryIds: input.linkedMemoryIds || original.linkedMemoryIds,
  }, "Email Replied", {
    repliedAt: new Date().toISOString(),
    inReplyToId: original.id,
    threadId: threadId,
  });
  return reply;
}

export function forwardEmail(emailId: string, input: EmailForwardInput, context: EmailPermissionContext): EmailView {
  const original = requireEmail(emailId);
  const forwarded = saveEmailItem("Forwarded", {
    ...input,
    subject: input.subject || "Fwd: " + original.subject,
    sender: input.sender || "ATLAS",
    recipients: input.recipients || [],
    body: input.body || original.body,
    threadId: input.threadId || original.threadId,
    linkedProjectIds: input.linkedProjectIds || original.linkedProjectIds,
    linkedTaskIds: input.linkedTaskIds || original.linkedTaskIds,
    linkedContactIds: input.linkedContactIds || original.linkedContactIds,
    linkedMemoryIds: input.linkedMemoryIds || original.linkedMemoryIds,
  }, "Email Forwarded", {
    forwardedAt: new Date().toISOString(),
    forwardedFromId: original.id,
    threadId: input.threadId || original.threadId,
  });
  return forwarded;
}

export function readEmail(emailId: string, actor: string = "ATLAS"): EmailView {
  const email = requireEmail(emailId);
  logMemoryAction("Email Read", "Email", email.id, actor, "Success", { subject: email.subject });
  return cloneEmail(email);
}

export function getEmailById(emailId: string): EmailView {
  return readEmail(emailId);
}

export function searchEmails(query: string, filters: EmailSearchFilters = {}, actor: string = "ATLAS"): EmailView[] {
  const state = loadEmailState();
  const normalizedQuery = normalizeText(query).toLowerCase();
  const results = state.emails
    .filter((email) => email.status !== "Deleted")
    .map((email) => cloneEmail(email))
    .filter((email) => matchesEmailFilters(email, filters))
    .filter((email) => matchesEmailQuery(email, normalizedQuery))
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  logMemoryAction("Email Searched", "Email", "search", actor, "Success", { query: normalizedQuery, resultCount: results.length });
  return results;
}

export function filterEmails(filters: EmailSearchFilters, actor: string = "ATLAS"): EmailView[] {
  return searchEmails("", filters, actor);
}

export function retrieveThread(threadId: string): EmailThreadView {
  validateThreadId(threadId);
  const emails = searchEmails("", { threadId: threadId });
  return {
    threadId: threadId,
    emails: emails.sort((a, b) => a.timestamp.localeCompare(b.timestamp)),
  };
}

export function classifyEmail(input: Pick<EmailInput, "subject" | "sender" | "body" | "recipients">, actor: string = "ATLAS"): EmailClassification {
  const text = normalizeText([input.subject, input.sender, input.body, (input.recipients || []).join(" ")].join(" ")).toLowerCase();
  const sender = normalizeText(input.sender).toLowerCase();
  const combined = text + " " + sender;
  let classification: EmailClassification = "Unclassified";
  if (/invoice|billing|receipt|tax|pay|finance/.test(combined)) classification = "Finance";
  else if (/legal|contract|agreement|law|policy|compliance/.test(combined)) classification = "Legal";
  else if (/support|helpdesk|ticket|issue|bug/.test(combined)) classification = "Support";
  else if (/sales|quote|pricing|proposal|demo|lead/.test(combined)) classification = "Sales";
  else if (/internal|team|ops|meeting|project/.test(combined)) classification = "Internal";
  else if (/client|customer|vendor|partner|grant|program officer/.test(combined)) classification = "Client";
  else if (/personal|family|friend|coach|doctor/.test(combined)) classification = "Personal";
  logMemoryAction("Email Classified", "Email", normalizeText(input.subject) || normalizeText(input.sender) || "classification", actor, "Success", {
    classification: classification,
    sender: input.sender,
  });
  return classification;
}

export function detectFollowUpEmails(asOf: string = new Date().toISOString()): EmailView[] {
  const state = loadEmailState();
  const now = new Date(asOf);
  const results: EmailView[] = [];
  for (const email of state.emails) {
    if (email.status === "Deleted" || email.status === "Archived") continue;
    const followUpStatus = calculateFollowUpStatus(email, now);
    if (followUpStatus === "None") continue;
    if (email.followUpStatus !== followUpStatus) {
      email.followUpStatus = followUpStatus;
      email.updatedAt = new Date().toISOString();
    }
    results.push(cloneEmail(email));
  }

  if (results.length > 0) {
    logMemoryAction("Email Follow-Up Detected", "Email", "follow-up", "ATLAS", "Success", { resultCount: results.length });
    saveEmailState(state);
    generateFollowUpReminders(results, asOf);
  }

  return results;
}

export function resetEmailForDemo(): void {
  resetEmailRuntime();
  const state = loadEmailState();
  state.emails = [];
  state.updatedAt = new Date().toISOString();
  saveEmailState(state);
}

function saveEmailItem(status: EmailRecord["status"], input: EmailInput, logActionType: any, patch: Partial<EmailRecord>): EmailView {
  validateEmailInput(input);
  const now = patch.draftedAt || patch.sentAt || patch.receivedAt || new Date().toISOString();
  const existingThread = input.threadId || createThreadId(input);
  const email: EmailRecord = {
    id: input.id || createId("email"),
    subject: normalizeText(input.subject),
    sender: normalizeText(input.sender),
    recipients: normalizeList(input.recipients),
    cc: normalizeList(input.cc || []),
    bcc: normalizeList(input.bcc || []),
    timestamp: normalizeText(input.timestamp || now),
    threadId: normalizeText(existingThread),
    status: status,
    classification: classifyEmail(input, input.actor || "ATLAS"),
    body: normalizeText(input.body),
    snippet: buildSnippet(input.body),
    replyRequired: !!input.replyRequired,
    followUpStatus: input.replyRequired ? "Awaiting Response" : "None",
    followUpDueAt: input.followUpDueAt ? normalizeText(input.followUpDueAt) : null,
    receivedAt: patch.receivedAt || null,
    sentAt: patch.sentAt || null,
    draftedAt: patch.draftedAt || null,
    repliedAt: patch.repliedAt || null,
    forwardedAt: patch.forwardedAt || null,
    archivedAt: null,
    deletedAt: null,
    inReplyToId: patch.inReplyToId || null,
    forwardedFromId: patch.forwardedFromId || null,
    linkedProjectIds: normalizeList(input.linkedProjectIds || []),
    linkedTaskIds: normalizeList(input.linkedTaskIds || []),
    linkedContactIds: normalizeList(input.linkedContactIds || []),
    linkedMemoryIds: normalizeList(input.linkedMemoryIds || []),
    links: [],
    createdAt: now,
    updatedAt: now,
  };
  email.links = buildLinks(email);
  upsertEmailRecord(email);
  persistEmailIntegrationLog(logActionType, email, input.actor || "ATLAS");
  if (email.replyRequired && email.status !== "Draft") {
    generateFollowUpReminders([cloneEmail(email)]);
  }
  return cloneEmail(email);
}

function persistFollowUp(email: EmailRecord, logActionType: string) {
  email.followUpStatus = deriveFollowUpStatus(email);
  email.links = buildLinks(email);
  upsertEmailRecord(email);
  persistEmailIntegrationLog(logActionType, email, "ATLAS");
}

function persistEmailIntegrationLog(actionType: string, email: EmailRecord, actor: string) {
  logMemoryAction(actionType as any, "Email", email.id, actor, "Success", {
    subject: email.subject,
    threadId: email.threadId,
    classification: email.classification,
    status: email.status,
    followUpStatus: email.followUpStatus,
  });
}

function generateFollowUpReminders(emails: EmailView[], asOf?: string) {
  for (const email of emails) {
    if (email.followUpStatus === "None") continue;
    const reminderDate = determineReminderDate(email, asOf);
    if (!reminderDate) continue;
    createReminder({
      title: `Follow up: ${email.subject}`,
      date: reminderDate,
      startTime: "09:00",
      endTime: "09:15",
      notes: `Email follow-up for ${email.sender}`,
      linkedMemoryIds: email.linkedMemoryIds,
      actor: "ATLAS",
    });
  }
}

function determineReminderDate(email: EmailView, asOf?: string): string | undefined {
  if (email.followUpDueAt) return email.followUpDueAt.slice(0, 10);
  const base = new Date(asOf || new Date().toISOString());
  base.setDate(base.getDate() + 1);
  return base.toISOString().slice(0, 10);
}

function calculateFollowUpStatus(email: EmailRecord, now: Date): EmailRecord["followUpStatus"] {
  if (!email.replyRequired) return "None";
  if (email.status === "Replied") return "None";
  const dueDate = email.followUpDueAt ? new Date(email.followUpDueAt) : new Date(email.timestamp);
  const overdueDate = new Date(dueDate.getTime());
  overdueDate.setDate(overdueDate.getDate() + 3);
  const followUpDate = new Date(dueDate.getTime());
  followUpDate.setDate(followUpDate.getDate() + 1);
  if (now.getTime() > overdueDate.getTime()) return "Overdue Reply";
  if (now.getTime() > followUpDate.getTime()) return "Follow-Up Needed";
  return "Awaiting Response";
}

function deriveFollowUpStatus(email: EmailRecord): EmailRecord["followUpStatus"] {
  return calculateFollowUpStatus(email, new Date());
}

function matchesEmailQuery(email: EmailView, query: string): boolean {
  if (!query) return true;
  const text = [
    email.subject,
    email.sender,
    email.recipients.join(" "),
    email.cc.join(" "),
    email.bcc.join(" "),
    email.body,
    email.classification,
    email.followUpStatus,
  ].join(" ").toLowerCase();
  return text.indexOf(query) >= 0;
}

function matchesEmailFilters(email: EmailView, filters: EmailSearchFilters): boolean {
  if (filters.status && email.status !== filters.status) return false;
  if (filters.classification && email.classification !== filters.classification) return false;
  if (filters.sender && email.sender.toLowerCase().indexOf(filters.sender.toLowerCase()) < 0) return false;
  if (filters.recipient && !email.recipients.some((recipient) => recipient.toLowerCase().indexOf(filters.recipient!.toLowerCase()) >= 0)) return false;
  if (filters.threadId && email.threadId !== filters.threadId) return false;
  if (filters.followUpStatus && email.followUpStatus !== filters.followUpStatus) return false;
  if (filters.linkedObjectType || filters.linkedObjectId) {
    const hasLink = email.links.some((link) => {
      if (filters.linkedObjectType && link.targetType !== filters.linkedObjectType) return false;
      if (filters.linkedObjectId && link.targetId !== filters.linkedObjectId) return false;
      return true;
    });
    if (!hasLink) return false;
  }
  return true;
}

function applyPatch(email: EmailRecord, patch: EmailUpdateInput | EmailInput) {
  if (patch.subject !== undefined) email.subject = normalizeText(patch.subject);
  if (patch.sender !== undefined) email.sender = normalizeText(patch.sender);
  if (patch.recipients !== undefined) email.recipients = normalizeList(patch.recipients);
  if (patch.body !== undefined) {
    email.body = normalizeText(patch.body);
    email.snippet = buildSnippet(patch.body);
  }
  if (patch.cc !== undefined) email.cc = normalizeList(patch.cc);
  if (patch.bcc !== undefined) email.bcc = normalizeList(patch.bcc);
  if (patch.replyRequired !== undefined) email.replyRequired = !!patch.replyRequired;
  if (patch.followUpDueAt !== undefined) email.followUpDueAt = patch.followUpDueAt ? normalizeText(patch.followUpDueAt) : null;
  if (patch.linkedProjectIds !== undefined) email.linkedProjectIds = normalizeList(patch.linkedProjectIds);
  if (patch.linkedTaskIds !== undefined) email.linkedTaskIds = normalizeList(patch.linkedTaskIds);
  if (patch.linkedContactIds !== undefined) email.linkedContactIds = normalizeList(patch.linkedContactIds);
  if (patch.linkedMemoryIds !== undefined) email.linkedMemoryIds = normalizeList(patch.linkedMemoryIds);
  email.classification = classifyEmail(email, "ATLAS");
  email.followUpStatus = deriveFollowUpStatus(email);
  email.links = buildLinks(email);
}

function ensureEditable(email: EmailRecord) {
  if (email.status !== "Draft") {
    throw new Error("Only draft emails may be modified or deleted.");
  }
}

function validateEmailInput(input: EmailInput) {
  if (!input || typeof input !== "object") throw new Error("Email input must be an object.");
  if (!normalizeText(input.subject)) throw new Error("Email subject is required.");
  if (!normalizeText(input.sender)) throw new Error("Email sender is required.");
  if (!Array.isArray(input.recipients) || input.recipients.length === 0) throw new Error("Email recipients are required.");
  if (!normalizeText(input.body)) throw new Error("Email body is required.");
}

function validateThreadId(threadId: string) {
  if (!normalizeText(threadId)) throw new Error("Thread id is required.");
}

function requireEmail(emailId: string): EmailRecord {
  const email = getEmailRecord(emailId);
  if (!email) throw new Error(`Email ${emailId} not found.`);
  return email;
}

function buildLinks(email: EmailRecord) {
  return [
    ...email.linkedProjectIds.map((id) => ({ targetType: "Project" as const, targetId: id })),
    ...email.linkedTaskIds.map((id) => ({ targetType: "Task" as const, targetId: id })),
    ...email.linkedContactIds.map((id) => ({ targetType: "Contact" as const, targetId: id })),
    ...email.linkedMemoryIds.map((id) => ({ targetType: "Memory" as const, targetId: id })),
  ];
}

function buildSnippet(body: string): string {
  const text = normalizeText(body);
  return text.length > 140 ? text.slice(0, 140) : text;
}

function createThreadId(input: EmailInput): string {
  return "thread-" + normalizeText(input.sender || "atlas").toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString(36);
}

function cloneEmail(email: EmailRecord): EmailView {
  return JSON.parse(JSON.stringify(email));
}

function normalizeText(value: any) {
  return String(value == null ? "" : value).trim();
}

function normalizeList(values?: string[]) {
  const list: string[] = [];
  for (const value of values || []) {
    const cleaned = normalizeText(value);
    if (!cleaned) continue;
    if (list.some((item) => item.toLowerCase() === cleaned.toLowerCase())) continue;
    list.push(cleaned);
  }
  return list;
}

function createId(prefix: string) {
  return prefix + "-" + new Date().getTime().toString(36) + "-" + Math.random().toString(16).slice(2, 8);
}
