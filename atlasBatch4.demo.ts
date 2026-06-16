import { createAction, clearActionCenterForDemo } from "./actionCenterEngine";
import { logAutomationAction, generateAuditSummary, getAutomationLogs, clearAutomationLogsForDemo } from "./automationLogEngine";
import { createCalendarSuggestion, clearCalendarCommandsForDemo } from "./calendarCommandEngine";
import { createClientDeliveryPacket, generateDeliveryPacket, clearClientDeliveryPacketsForDemo } from "./clientDeliveryPacketEngine";
import { createCommunicationDraft, clearCommunicationDraftsForDemo } from "./communicationDraftEngine";
import { createFileRecord, generateFolderStructure, clearFileDriveManagerForDemo } from "./fileDriveManagerEngine";
import { createGrantPacket, generateFullGrantPacket, clearGrantPacketsForDemo } from "./grantSubmissionPacketEngine";
import { createIntegrationRecord, checkToolActionPermission, clearIntegrationRegistryForDemo } from "./integrationPermissionRegistry";
import { createInvoiceRecord, generateInvoiceNotes, clearInvoicePaymentTrackerForDemo } from "./invoicePaymentTrackerEngine";
import { addContact, generateContactSummary, clearOutreachCrmForDemo } from "./outreachCrmEngine";

clearActionCenterForDemo();
clearIntegrationRegistryForDemo();
clearCommunicationDraftsForDemo();
clearCalendarCommandsForDemo();
clearFileDriveManagerForDemo();
clearGrantPacketsForDemo();
clearClientDeliveryPacketsForDemo();
clearInvoicePaymentTrackerForDemo();
clearOutreachCrmForDemo();
clearAutomationLogsForDemo();

console.log("Action Center");
console.log(createAction({ id: "demo-a1", title: "Client email approval", actionType: "email", department: "Client", proposedByAgent: "ATLAS", riskLevel: "High", proposedAction: "Send prepared draft to Action Center", requiredInputs: ["draft"], missingInputs: [] }));

console.log("\nIntegration Permission Registry");
createIntegrationRecord({ toolName: "Gmail" });
console.log(checkToolActionPermission("Gmail", "send email"));

console.log("\nCommunication Draft Engine");
console.log(createCommunicationDraft({ id: "demo-d1", documentType: "outreach email", audience: "client", subject: "Creator logistics", body: "I prepared the email for review.", externalFacing: true }));

console.log("\nCalendar Command Engine");
console.log(createCalendarSuggestion({ id: "demo-c1", title: "Grant work block", type: "Internal Block", relatedDepartment: "Grants", startDate: "2099-01-01", endDate: "2099-01-01", priority: 9 }));

console.log("\nFile/Drive Manager Engine");
console.log(generateFolderStructure("Avery Industries LLC"));
console.log(createFileRecord({ id: "demo-f1", fileName: "grant-budget.xlsx", fileType: "sheet", category: "Financial", recommendedPath: "Avery Industries LLC/02_Grants" }));

console.log("\nGrant Submission Packet Engine");
createGrantPacket({ id: "demo-g1", grantName: "Accessibility Grant", amount: 25000, eligibilitySummary: "Promising fit.", companySummary: "Avery Industries LLC builds useful AI systems.", projectSummary: "ATLAS Assist support workflow.", disabilityAidImpactStatement: "Supports disability-aid organization and independent living.", budgetOutline: "Software, documentation, operations.", timeline: "90 days.", requiredDocuments: ["budget"], completedDocuments: [], evidenceAttachments: ["demo-f1"] });
console.log(generateFullGrantPacket("demo-g1"));

console.log("\nClient Delivery Packet Engine");
createClientDeliveryPacket({ id: "demo-cp1", clientName: "Creator Client", projectName: "Clip Delivery", deliverables: ["clips", "timestamps"], completedDeliverables: ["clips"], paymentStatus: "Unpaid", revisionCount: 2 });
console.log(generateDeliveryPacket("demo-cp1"));

console.log("\nInvoice Payment Tracker Engine");
createInvoiceRecord({ id: "demo-i1", clientName: "Creator Client", amount: 750, dueDate: "2099-01-01", status: "Draft" });
console.log(generateInvoiceNotes("demo-i1"));

console.log("\nOutreach CRM Engine");
addContact({ id: "demo-o1", name: "Warm Lead", organization: "Studio", relationshipType: "Lead", status: "Warm", tags: ["creator"], nextFollowUp: "2099-01-01" });
console.log(generateContactSummary("demo-o1"));

console.log("\nAutomation Log Engine");
logAutomationAction({ id: "demo-l1", timestamp: new Date().toISOString(), actor: "ATLAS", actionType: "external email draft", department: "Client", permissionLevel: "Approval Required", riskLevel: "High", approvalStatus: "Needs Cole Approval", outcome: "Prepared", notes: "Logged generated external action." });
console.log(generateAuditSummary(getAutomationLogs()));
