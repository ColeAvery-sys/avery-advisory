declare const require: any;
declare const __dirname: string;
declare const process: any;

const fs = require("fs");
const path = require("path");

import { listMemoryActions } from "./memoryEngineService";
import { resetMemoryEngineRuntime } from "./memoryEngineRepository";
import { EMAIL_BACKUP_PATH, EMAIL_STATE_PATH, resetEmailRuntime } from "./emailIntegrationRepository";
import {
  createDraft,
  deleteDraft,
  detectFollowUpEmails,
  filterEmails,
  forwardEmail,
  getEmailById,
  readEmail,
  receiveEmail,
  retrieveThread,
  searchEmails,
  sendEmail,
  sendReply,
  updateDraft,
  classifyEmail,
  resetEmailForDemo,
} from "./emailIntegrationService";
import { readTodaySchedule, resetCalendarForDemo, searchEvents } from "./calendarIntegrationService";

const backupEmailState = readBackup(EMAIL_STATE_PATH);
const backupEmailBackup = readBackup(EMAIL_BACKUP_PATH);

try {
  resetMemoryEngineRuntime();
  resetEmailRuntime();
  resetCalendarForDemo();
  resetEmailForDemo();

  const draft = createDraft({
    subject: "Grant approval request",
    sender: "cole@averyindustries.com",
    recipients: ["program@grants.org"],
    body: "Please approve the EchoFrame grant paperwork.",
    linkedProjectIds: ["echoframe"],
    linkedTaskIds: ["grant-paperwork"],
    linkedContactIds: ["program-officer"],
    actor: "QA",
  });
  assertEqual(draft.status, "Draft");
  assertEqual(draft.classification, "Client");

  const updatedDraft = updateDraft(draft.id, { body: "Please approve the EchoFrame grant paperwork as soon as possible." }, { actor: "QA" });
  assertEqual(updatedDraft.body.indexOf("soon as possible") >= 0, true);

  const sent = sendEmail({
    draftId: draft.id,
    subject: "Grant approval request",
    sender: "cole@averyindustries.com",
    recipients: ["program@grants.org"],
    body: "Please approve the EchoFrame grant paperwork as soon as possible.",
    replyRequired: true,
    followUpDueAt: isoDateOffset(-4),
    actor: "QA",
  });
  assertEqual(sent.status, "Sent");
  assertEqual(sent.followUpStatus === "Follow-Up Needed" || sent.followUpStatus === "Overdue Reply", true);

  const received = receiveEmail({
    subject: "Vendor invoice",
    sender: "billing@vendor.com",
    recipients: ["cole@averyindustries.com"],
    body: "Invoice attached for payment.",
    replyRequired: true,
    followUpDueAt: isoDateOffset(-5),
    actor: "QA",
  });
  assertEqual(received.status, "Received");
  assertEqual(received.classification, "Finance");

  const reply = sendReply(received.id, {
    subject: "Re: Vendor invoice",
    body: "Thanks, I am reviewing the invoice now.",
    recipients: ["billing@vendor.com"],
    actor: "QA",
  }, { actor: "QA" });
  assertEqual(reply.status, "Replied");
  assertEqual(reply.threadId, received.threadId);

  const forwarded = forwardEmail(received.id, {
    recipients: ["accounting@averyindustries.com"],
    body: "Forwarding invoice for processing.",
    actor: "QA",
  }, { actor: "QA" });
  assertEqual(forwarded.status, "Forwarded");

  const read = readEmail(received.id);
  assertEqual(read.subject, "Vendor invoice");
  assertEqual(getEmailById(received.id).id, received.id);

  const classification = classifyEmail({
    subject: "Legal agreement review",
    sender: "legal@advisor.com",
    body: "Please review the agreement and contract terms.",
    recipients: ["cole@averyindustries.com"],
  });
  assertEqual(classification, "Legal");

  const searchResults = searchEmails("invoice", { classification: "Finance" });
  assertEqual(searchResults.length >= 1, true);
  assertEqual(filterEmails({ sender: "billing@vendor.com" }).length >= 1, true);
  assertEqual(searchEmails("", { linkedObjectType: "Project", linkedObjectId: "echoframe" }).length >= 1, true);
  assertEqual(retrieveThread(received.threadId).emails.length >= 3, true);

  const remindersBefore = readTodaySchedule(new Date().toISOString().slice(0, 10));
  assertEqual(Array.isArray(remindersBefore), true);

  const followUps = detectFollowUpEmails();
  assertEqual(followUps.length >= 1, true);
  assertEqual(searchEvents("Follow up:", {}).length >= 1, true);

  const actions = listMemoryActions().filter((action) => action.objectType === "Email");
  assertEqual(actions.some((action) => action.actionType === "Email Drafted"), true);
  assertEqual(actions.some((action) => action.actionType === "Email Sent"), true);
  assertEqual(actions.some((action) => action.actionType === "Email Received"), true);
  assertEqual(actions.some((action) => action.actionType === "Email Replied"), true);
  assertEqual(actions.some((action) => action.actionType === "Email Forwarded"), true);
  assertEqual(actions.some((action) => action.actionType === "Email Read"), true);
  assertEqual(actions.some((action) => action.actionType === "Email Searched"), true);
  assertEqual(actions.some((action) => action.actionType === "Email Classified"), true);
  assertEqual(actions.some((action) => action.actionType === "Email Follow-Up Detected"), true);

  const deleted = deleteDraft(
    createDraft({
      subject: "Temporary draft",
      sender: "cole@averyindustries.com",
      recipients: ["temp@vendor.com"],
      body: "Temp body",
      actor: "QA",
    }).id,
    { actor: "QA" },
  );
  assertEqual(deleted.status, "Deleted");

  console.log("All Email Integration V1 tests passed.");
} finally {
  restore(EMAIL_STATE_PATH, backupEmailState);
  restore(EMAIL_BACKUP_PATH, backupEmailBackup);
  resetEmailRuntime();
  resetMemoryEngineRuntime();
}

function readBackup(filePath: string) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, "utf8") : null;
}

function restore(filePath: string, content: string | null) {
  if (content === null) {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return;
  }
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}

function isoDateOffset(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) {
    throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
  }
}
