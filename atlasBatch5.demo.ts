import { createCalendarDraft, markCalendarDraftApproved, createCalendarPlaceholder, clearCalendarDraftCenterForDemo } from "./calendarDraftCenterEngine";
import { createGmailDraftRecord, markApprovedForGmailDraft, createGmailDraftPlaceholder, clearGmailDraftCenterForDemo } from "./gmailDraftCenterEngine";
import { generateFullFolderMap, clearDriveStructureForDemo } from "./googleDriveStructureBuilder";
import { generateGoogleDocRecord, markGoogleDocApproved, createGoogleDocPlaceholder, exportGoogleDocMarkdown, clearGoogleDocsGeneratorForDemo } from "./googleDocsGeneratorEngine";
import { createSheetExport, generateSheetPreview, generateCsv, clearSheetsExportCenterForDemo } from "./googleSheetsExportCenter";
import { createIntegrationTest, runDryIntegrationTest, clearIntegrationTestConsoleForDemo } from "./integrationTestConsole";
import { createWatchedFileRecord, markFileWatcherPlaceholderActive, clearLocalFileWatcherForDemo } from "./localFileWatcherEngine";
import { createWebhookScenario, copyWebhookPayload, clearWebhookStagingForDemo } from "./makeWebhookStagingEngine";
import { createNotification, getUnreadNotifications, clearNotificationCenterForDemo } from "./notificationCenterEngine";
import { createPromptExport, markPromptExported, clearPromptExportsForDemo } from "./promptExportEngine";

clearGmailDraftCenterForDemo();
clearCalendarDraftCenterForDemo();
clearDriveStructureForDemo();
clearGoogleDocsGeneratorForDemo();
clearSheetsExportCenterForDemo();
clearWebhookStagingForDemo();
clearPromptExportsForDemo();
clearLocalFileWatcherForDemo();
clearNotificationCenterForDemo();
clearIntegrationTestConsoleForDemo();

console.log("Gmail Draft Center");
createGmailDraftRecord({ id: "gmail-demo", subject: "Creator logistics follow-up", recipientName: "Creator", recipientEmail: "creator@example.com", body: "Prepared follow-up draft.", draftType: "Creator follow-up", department: "Creator Logistics" });
markApprovedForGmailDraft("gmail-demo");
console.log(createGmailDraftPlaceholder("gmail-demo"));

console.log("\nCalendar Draft Center");
createCalendarDraft({ id: "calendar-demo", title: "Grant deadline work block", type: "Grant Deadline", department: "Grants", startDate: "2099-01-01", endDate: "2099-01-01", description: "Prepare packet." });
markCalendarDraftApproved("calendar-demo");
console.log(createCalendarPlaceholder("calendar-demo"));

console.log("\nGoogle Drive Structure Builder");
console.log(generateFullFolderMap().map((folder) => folder.recommendedPath));

console.log("\nGoogle Docs Generator");
generateGoogleDocRecord({ id: "doc-demo", title: "Grant Project Summary", documentType: "Grant project summary", department: "Grants", targetAudience: "funder", sourceData: "ATLAS Assist", body: "Approval-ready grant summary.", relatedGrant: "grant-demo", sensitivity: "High Risk" });
markGoogleDocApproved("doc-demo");
console.log(createGoogleDocPlaceholder("doc-demo"));
console.log(exportGoogleDocMarkdown("doc-demo"));

console.log("\nGoogle Sheets Export Center");
createSheetExport({ id: "sheet-demo", exportName: "Money Pipeline", tableType: "Money Pipeline", filters: ["active"], columns: ["title", "score"], rows: [{ title: "Creator client", score: 90 }] });
console.log(generateSheetPreview("sheet-demo"));
console.log(generateCsv("sheet-demo"));

console.log("\nMake.com Webhook Staging");
createWebhookScenario({ id: "webhook-demo", scenarioName: "New Approval Needed", trigger: "approval_created", payloadPreview: { actionId: "a1", status: "Needs Cole Approval" }, destination: "Make.com" });
console.log(copyWebhookPayload("webhook-demo"));

console.log("\nCursor/Codex Prompt Export");
console.log(markPromptExported(createPromptExport({ id: "prompt-demo", target: "Cursor", title: "Build Gmail Draft Center UI", department: "Product", sourceTask: "Create Batch 5 page", requirements: ["Use staged records", "No automatic sending"] }).id));

console.log("\nLocal File Watcher");
console.log(markFileWatcherPlaceholderActive(createWatchedFileRecord({ id: "watch-demo", path: "Evidence Locker/grant.pdf", category: "Evidence", watchStatus: "Planned", sensitivity: "High Risk" }).id));

console.log("\nNotification Center");
createNotification({ id: "notification-demo", title: "Approval needed", message: "Gmail draft placeholder is ready.", department: "Creator Logistics", priority: "High", notificationType: "Approval Needed" });
console.log(getUnreadNotifications());

console.log("\nIntegration Test Console");
createIntegrationTest({ id: "test-demo", integrationName: "Gmail", testName: "Draft placeholder dry run", dryRunOnly: true, expectedOutcome: "No email is sent." });
console.log(runDryIntegrationTest("test-demo"));
