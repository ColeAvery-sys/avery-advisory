import { createCalendarDraft, createCalendarPlaceholder, markCalendarDraftApproved, clearCalendarDraftCenterForDemo } from "./calendarDraftCenterEngine";
import { createGmailDraftRecord, createGmailDraftPlaceholder, markApprovedForGmailDraft, clearGmailDraftCenterForDemo } from "./gmailDraftCenterEngine";
import { generateFullFolderMap, generateMissingFolderList, clearDriveStructureForDemo } from "./googleDriveStructureBuilder";
import { createGoogleDocPlaceholder, generateGoogleDocRecord, markGoogleDocApproved, clearGoogleDocsGeneratorForDemo } from "./googleDocsGeneratorEngine";
import { createGoogleSheetPlaceholder, createSheetExport, generateCsv, markSheetExportApproved, clearSheetsExportCenterForDemo } from "./googleSheetsExportCenter";
import { createIntegrationTest, runDryIntegrationTest, clearIntegrationTestConsoleForDemo } from "./integrationTestConsole";
import { createWatchedFileRecord, getSensitiveWatchedFiles, markFileWatcherPlaceholderActive, clearLocalFileWatcherForDemo } from "./localFileWatcherEngine";
import { createWebhookScenario, markWebhookActive, clearWebhookStagingForDemo } from "./makeWebhookStagingEngine";
import { createNotification, getUnreadNotifications, markNotificationRead, clearNotificationCenterForDemo } from "./notificationCenterEngine";
import { createPromptExport, getPromptExportsByTarget, markPromptExported, clearPromptExportsForDemo } from "./promptExportEngine";

clearGmailDraftCenterForDemo();
const gmail = createGmailDraftRecord({ id: "g1", subject: "Client follow-up", recipientName: "Client", recipientEmail: "client@example.com", body: "Prepared draft.", draftType: "Creator follow-up", department: "Client", relatedClient: "c1" });
assertEqual(gmail.approvalStatus, "Needs Cole Approval");
assertThrows(() => createGmailDraftPlaceholder("g1"));
markApprovedForGmailDraft("g1");
assertEqual(createGmailDraftPlaceholder("g1").gmailStatus, "Placeholder Created");

clearCalendarDraftCenterForDemo();
const calendar = createCalendarDraft({ id: "cal1", title: "Client meeting", type: "Meeting Draft", department: "Client", startDate: "2099-01-01", endDate: "2099-01-01", description: "External invite draft.", relatedClient: "c1" });
assertEqual(calendar.approvalStatus, "Needs Cole Approval");
markCalendarDraftApproved("cal1");
assertEqual(createCalendarPlaceholder("cal1").calendarStatus, "Placeholder Created");

clearDriveStructureForDemo();
const folders = generateFullFolderMap();
assertEqual(folders.some((folder) => folder.folderName === "Evidence Locker" && folder.approvalStatus === "Needs Cole Approval"), true);
assertEqual(generateMissingFolderList([]).length, 15);

clearGoogleDocsGeneratorForDemo();
generateGoogleDocRecord({ id: "doc1", title: "Client Proposal", documentType: "Client proposal", department: "Sales", targetAudience: "client", sourceData: "proposal", body: "Client proposal draft.", relatedClient: "c1", sensitivity: "Client Confidential" });
assertThrows(() => createGoogleDocPlaceholder("doc1"));
markGoogleDocApproved("doc1");
assertEqual(createGoogleDocPlaceholder("doc1").docsStatus, "Placeholder Created");

clearSheetsExportCenterForDemo();
createSheetExport({ id: "s1", exportName: "Invoices", tableType: "Invoices", filters: [], columns: ["client", "amount"], rows: [{ client: "Client", amount: 750 }] });
assertEqual(generateCsv("s1").includes("\"Client\",750"), true);
markSheetExportApproved("s1");
assertEqual(createGoogleSheetPlaceholder("s1").sheetsStatus, "Placeholder Created");

clearWebhookStagingForDemo();
const webhook = createWebhookScenario({ id: "w1", scenarioName: "Gmail Draft Approved", trigger: "gmail draft approved", payloadPreview: { id: "g1" }, destination: "Make.com", notes: "Internal staging." });
assertEqual(webhook.approvalRequired, true);
assertThrows(() => markWebhookActive("w1"));

clearPromptExportsForDemo();
const prompt = createPromptExport({ id: "p1", target: "Codex", title: "Build test", department: "Product", sourceTask: "Create module", requirements: ["Use local data"] });
assertEqual(prompt.prompt.includes("North Star"), true);
assertEqual(markPromptExported("p1").exportStatus, "Exported");
assertEqual(getPromptExportsByTarget("Codex").length, 1);

clearLocalFileWatcherForDemo();
createWatchedFileRecord({ id: "f1", path: "Legal/contract.pdf", category: "Legal", watchStatus: "Planned", sensitivity: "Legal/Financial" });
assertEqual(markFileWatcherPlaceholderActive("f1").watchStatus, "Watching Placeholder");
assertEqual(getSensitiveWatchedFiles().length, 1);

clearNotificationCenterForDemo();
createNotification({ id: "n1", title: "Approval needed", message: "Gmail draft is ready.", department: "Client", priority: "High", notificationType: "Approval Needed", relatedItem: "g1" });
assertEqual(getUnreadNotifications().length, 1);
assertEqual(markNotificationRead("n1").status, "Read");

clearIntegrationTestConsoleForDemo();
createIntegrationTest({ id: "t1", integrationName: "Gmail", testName: "Draft dry run", dryRunOnly: true, expectedOutcome: "Draft placeholder created." });
assertEqual(runDryIntegrationTest("t1").resultStatus, "Passed");

console.log("All ATLAS Batch 5 tests passed.");

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) {
    throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
  }
}

function assertThrows(callback: () => void): void {
  let threw = false;
  try {
    callback();
  } catch {
    threw = true;
  }
  if (!threw) throw new Error("Expected function to throw.");
}
