declare const require: any;
declare const __dirname: string;

import { EmailRecord, EmailState } from "./emailIntegrationTypes";

const fs = require("fs");
const path = require("path");

export const EMAIL_STATE_PATH = path.resolve(__dirname, "..", "atlas_ops", "logs", "atlas_email_v1.json");
export const EMAIL_BACKUP_PATH = path.resolve(__dirname, "..", "atlas_ops", "logs", "atlas_email_v1.backup.json");

let emailCache: EmailState | null = null;

export function createEmptyEmailState(): EmailState {
  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    createdAt: now,
    updatedAt: now,
    emails: [],
  };
}

export function loadEmailState(): EmailState {
  if (emailCache) {
    return cloneEmailState(emailCache);
  }

  if (!fs.existsSync(EMAIL_STATE_PATH)) {
    emailCache = createEmptyEmailState();
    return cloneEmailState(emailCache);
  }

  try {
    const parsed = JSON.parse(fs.readFileSync(EMAIL_STATE_PATH, "utf8"));
    emailCache = normalizeEmailState(parsed);
    return cloneEmailState(emailCache);
  } catch (primaryError) {
    if (fs.existsSync(EMAIL_BACKUP_PATH)) {
      try {
        const parsedBackup = JSON.parse(fs.readFileSync(EMAIL_BACKUP_PATH, "utf8"));
        emailCache = normalizeEmailState(parsedBackup);
        persistEmailState(emailCache);
        return cloneEmailState(emailCache);
      } catch (_backupError) {
        throw primaryError;
      }
    }
    throw primaryError;
  }
}

export function saveEmailState(state: EmailState): EmailState {
  const normalized = normalizeEmailState(state);
  persistEmailState(normalized);
  emailCache = normalized;
  return cloneEmailState(normalized);
}

export function resetEmailRuntime(): void {
  emailCache = null;
}

export function cloneEmailState(state: EmailState): EmailState {
  return JSON.parse(JSON.stringify(state));
}

export function normalizeEmailState(payload: any): EmailState {
  const fallback = createEmptyEmailState();
  return {
    schemaVersion: Number(payload && payload.schemaVersion) || 1,
    createdAt: String(payload && payload.createdAt ? payload.createdAt : fallback.createdAt),
    updatedAt: String(payload && payload.updatedAt ? payload.updatedAt : fallback.updatedAt),
    emails: Array.isArray(payload && payload.emails) ? payload.emails.map(normalizeEmailRecord) : [],
  };
}

export function persistEmailState(state: EmailState): void {
  fs.mkdirSync(path.dirname(EMAIL_STATE_PATH), { recursive: true });
  if (fs.existsSync(EMAIL_STATE_PATH)) {
    try {
      fs.chmodSync(EMAIL_STATE_PATH, 0o666);
    } catch {
      // ignore
    }
    fs.copyFileSync(EMAIL_STATE_PATH, EMAIL_BACKUP_PATH);
  }

  const tempPath = EMAIL_STATE_PATH + ".tmp";
  fs.writeFileSync(tempPath, JSON.stringify(state, null, 2));
  let lastError: any = null;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      if (fs.existsSync(EMAIL_STATE_PATH)) {
        try {
          fs.unlinkSync(EMAIL_STATE_PATH);
        } catch {
          // ignore and fall through to replacement strategies
        }
      }
      fs.renameSync(tempPath, EMAIL_STATE_PATH);
      return;
    } catch (error) {
      lastError = error;
      try {
        if (fs.existsSync(EMAIL_STATE_PATH)) {
          try {
            fs.unlinkSync(EMAIL_STATE_PATH);
          } catch {
            // ignore
          }
        }
        fs.copyFileSync(tempPath, EMAIL_STATE_PATH);
        fs.unlinkSync(tempPath);
        return;
      } catch (copyError) {
        lastError = copyError;
        try {
          fs.writeFileSync(EMAIL_STATE_PATH, JSON.stringify(state, null, 2));
          fs.unlinkSync(tempPath);
          return;
        } catch (writeError) {
          lastError = writeError;
        }
      }
    }
  }

  throw lastError;
}

export function upsertEmailRecord(record: EmailRecord): EmailState {
  const state = loadEmailState();
  const index = state.emails.findIndex((item) => item.id === record.id);
  if (index >= 0) {
    state.emails[index] = record;
  } else {
    state.emails.push(record);
  }
  state.updatedAt = new Date().toISOString();
  return saveEmailState(state);
}

export function removeEmailRecord(emailId: string): EmailState {
  const state = loadEmailState();
  state.emails = state.emails.filter((item) => item.id !== emailId);
  state.updatedAt = new Date().toISOString();
  return saveEmailState(state);
}

export function getEmailRecord(emailId: string): EmailRecord | null {
  const state = loadEmailState();
  return state.emails.find((item) => item.id === emailId) || null;
}

function normalizeEmailRecord(record: any): EmailRecord {
  const now = new Date().toISOString();
  return {
    id: String(record && record.id ? record.id : `email-${Date.now()}`),
    subject: String(record && record.subject ? record.subject : ""),
    sender: String(record && record.sender ? record.sender : ""),
    recipients: Array.isArray(record && record.recipients) ? record.recipients.map(String) : [],
    cc: Array.isArray(record && record.cc) ? record.cc.map(String) : [],
    bcc: Array.isArray(record && record.bcc) ? record.bcc.map(String) : [],
    timestamp: String(record && record.timestamp ? record.timestamp : now),
    threadId: String(record && record.threadId ? record.threadId : `thread-${Date.now()}`),
    status: normalizeStatus(record && record.status),
    classification: normalizeClassification(record && record.classification),
    body: String(record && record.body ? record.body : ""),
    snippet: String(record && record.snippet ? record.snippet : ""),
    replyRequired: !!(record && record.replyRequired),
    followUpStatus: normalizeFollowUpStatus(record && record.followUpStatus),
    followUpDueAt: record && record.followUpDueAt ? String(record.followUpDueAt) : null,
    receivedAt: record && record.receivedAt ? String(record.receivedAt) : null,
    sentAt: record && record.sentAt ? String(record.sentAt) : null,
    draftedAt: record && record.draftedAt ? String(record.draftedAt) : null,
    repliedAt: record && record.repliedAt ? String(record.repliedAt) : null,
    forwardedAt: record && record.forwardedAt ? String(record.forwardedAt) : null,
    archivedAt: record && record.archivedAt ? String(record.archivedAt) : null,
    deletedAt: record && record.deletedAt ? String(record.deletedAt) : null,
    inReplyToId: record && record.inReplyToId ? String(record.inReplyToId) : null,
    forwardedFromId: record && record.forwardedFromId ? String(record.forwardedFromId) : null,
    linkedProjectIds: Array.isArray(record && record.linkedProjectIds) ? record.linkedProjectIds.map(String) : [],
    linkedTaskIds: Array.isArray(record && record.linkedTaskIds) ? record.linkedTaskIds.map(String) : [],
    linkedContactIds: Array.isArray(record && record.linkedContactIds) ? record.linkedContactIds.map(String) : [],
    linkedMemoryIds: Array.isArray(record && record.linkedMemoryIds) ? record.linkedMemoryIds.map(String) : [],
    links: Array.isArray(record && record.links) ? record.links.map(normalizeLink) : [],
    createdAt: String(record && record.createdAt ? record.createdAt : now),
    updatedAt: String(record && record.updatedAt ? record.updatedAt : now),
  };
}

function normalizeLink(link: any) {
  return {
    targetType: link && (link.targetType === "Project" || link.targetType === "Task" || link.targetType === "Contact" || link.targetType === "Memory")
      ? link.targetType
      : "Memory",
    targetId: String(link && link.targetId ? link.targetId : ""),
  };
}

function normalizeStatus(value: any): EmailRecord["status"] {
  if (value === "Draft" || value === "Sent" || value === "Received" || value === "Replied" || value === "Forwarded" || value === "Archived" || value === "Deleted") {
    return value;
  }
  return "Draft";
}

function normalizeClassification(value: any): EmailRecord["classification"] {
  if (value === "Client" || value === "Personal" || value === "Internal" || value === "Sales" || value === "Support" || value === "Finance" || value === "Legal") {
    return value;
  }
  return "Unclassified";
}

function normalizeFollowUpStatus(value: any): EmailRecord["followUpStatus"] {
  if (value === "Awaiting Response" || value === "Follow-Up Needed" || value === "Overdue Reply") {
    return value;
  }
  return "None";
}
