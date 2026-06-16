import { approveAction, clearActionCenterForDemo, createAction, getHighRiskActions } from "./actionCenterEngine";
import { clearAutomationLogsForDemo, generateAuditSummary, getExternalFacingLogs, logAutomationAction } from "./automationLogEngine";
import { clearCalendarCommandsForDemo, createCalendarSuggestion, markScheduledManually } from "./calendarCommandEngine";
import { clearClientDeliveryPacketsForDemo, createClientDeliveryPacket, generateQualityChecklist } from "./clientDeliveryPacketEngine";
import { approveDraft, clearCommunicationDraftsForDemo, createCommunicationDraft, rewriteDraft } from "./communicationDraftEngine";
import { attachFileToGrant, clearFileDriveManagerForDemo, createFileRecord, generateFolderStructure, getSensitiveFiles } from "./fileDriveManagerEngine";
import { clearGrantPacketsForDemo, createGrantPacket, generateFullGrantPacket, markReadyToSubmit } from "./grantSubmissionPacketEngine";
import { checkToolActionPermission, clearIntegrationRegistryForDemo, createIntegrationRecord, updateConnectionStatus } from "./integrationPermissionRegistry";
import { clearInvoicePaymentTrackerForDemo, createContractorPaymentRecord, createInvoiceRecord, generateInvoiceNotes, getExpectedCash, sendContractorPaymentToApproval } from "./invoicePaymentTrackerEngine";
import { addContact, clearOutreachCrmForDemo, convertContactToClient, generateContactSummary, getFollowUpsDue } from "./outreachCrmEngine";

clearActionCenterForDemo();
const action = createAction({
  id: "a1",
  title: "Send client delivery email",
  actionType: "email",
  department: "Client",
  proposedByAgent: "Creator Logistics Manager",
  riskLevel: "High",
  proposedAction: "Prepare email for Cole approval",
  requiredInputs: ["draft"],
  missingInputs: [],
  deadline: "2099-01-01",
});
assertEqual(action.approvalStatus, "Needs Cole Approval");
assertEqual(getHighRiskActions().length, 1);
assertEqual(approveAction("a1").approvalStatus, "Approved");

clearIntegrationRegistryForDemo();
createIntegrationRecord({ toolName: "Gmail" });
assertEqual(checkToolActionPermission("Gmail", "create draft"), "Allowed");
assertEqual(checkToolActionPermission("Gmail", "send email"), "Approval Required");
assertEqual(updateConnectionStatus("Gmail", "Connected").connectionStatus, "Connected");

clearCommunicationDraftsForDemo();
const draft = createCommunicationDraft({ id: "d1", documentType: "outreach email", audience: "client", subject: "Hello", body: "Direct — professional.", externalFacing: true });
assertEqual(draft.approvalStatus, "Needs Cole Approval");
assertEqual(rewriteDraft("d1", "More Professional").body.includes("—"), false);
assertEqual(approveDraft("d1").approvalStatus, "Approved");

clearCalendarCommandsForDemo();
const calendar = createCalendarSuggestion({ id: "c1", title: "Client call", type: "External Meeting", relatedDepartment: "Client", startDate: "2099-01-01", endDate: "2099-01-01", priority: 9 });
assertEqual(calendar.approvalRequired, true);
assertEqual(markScheduledManually("c1").status, "Scheduled Manually");

clearFileDriveManagerForDemo();
assertEqual(generateFolderStructure("Avery Industries LLC").includes("Avery Industries LLC/02_Grants"), true);
createFileRecord({ id: "f1", fileName: "client-contract.pdf", fileType: "pdf", category: "Legal", recommendedPath: "Avery Industries LLC/06_Legal" });
assertEqual(getSensitiveFiles().length, 1);
assertEqual(attachFileToGrant("f1", "g1").relatedGrant, "g1");

clearGrantPacketsForDemo();
createGrantPacket({
  id: "g1",
  grantName: "WV Accessibility Grant",
  amount: 25000,
  eligibilitySummary: "Strong WV fit.",
  companySummary: "Avery Industries LLC builds ATLAS.",
  projectSummary: "Disability-aid workflow support.",
  disabilityAidImpactStatement: "This supports independent living without guaranteed medical claims.",
  budgetOutline: "Software and operations.",
  timeline: "90 days.",
  requiredDocuments: ["budget", "summary"],
  completedDocuments: ["summary"],
  evidenceAttachments: ["f1"],
});
assertEqual(generateFullGrantPacket("g1").includes("Funding is not guaranteed"), true);
assertEqual(markReadyToSubmit("g1").approvalStatus, "Ready for Cole Approval");

clearClientDeliveryPacketsForDemo();
createClientDeliveryPacket({ id: "cp1", clientName: "Client", projectName: "Clips", deliverables: ["clips", "timestamps"], completedDeliverables: ["clips"], paymentStatus: "Unpaid", revisionCount: 4 });
assertEqual(generateQualityChecklist("cp1").some((item) => item.includes("payment")), true);

clearInvoicePaymentTrackerForDemo();
createInvoiceRecord({ id: "i1", clientName: "Client", amount: 900, dueDate: "2099-01-01", status: "Draft" });
assertEqual(generateInvoiceNotes("i1").includes("Cole approval required"), true);
assertEqual(getExpectedCash(), 900);
createContractorPaymentRecord({ id: "p1", contractorName: "Editor", amount: 200, reason: "clips", approvalStatus: "Draft" });
assertEqual(sendContractorPaymentToApproval("p1").approvalStatus, "Needs Cole Approval");

clearOutreachCrmForDemo();
addContact({ id: "o1", name: "Lead", organization: "Studio", relationshipType: "Lead", status: "Warm", tags: ["creator"], nextFollowUp: "2000-01-01" });
assertEqual(getFollowUpsDue("2099-01-01").length, 1);
assertEqual(convertContactToClient("o1").relationshipType, "Client");
assertEqual(generateContactSummary("o1").includes("never sent automatically"), true);

clearAutomationLogsForDemo();
logAutomationAction({ id: "l1", timestamp: "2099-01-01", actor: "ATLAS", actionType: "external email draft", department: "Sales", permissionLevel: "Approval Required", riskLevel: "High", approvalStatus: "Needs Cole Approval", outcome: "Prepared", notes: "client-facing" });
assertEqual(getExternalFacingLogs().length, 1);
assertEqual(generateAuditSummary(getExternalFacingLogs()).includes("1 high-risk"), true);

console.log("All ATLAS Batch 4 tests passed.");

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) {
    throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
  }
}
