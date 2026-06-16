import { createDeliveryTracker, generateDeliveryProgressSummary, markApprovedForDelivery, clearDeliveryTrackersForDemo } from "./clientDeliveryTrackerEngine";
import { createOnboardingRecord, validateOnboardingCompletion, sendStartApprovalToActionCenter, clearOnboardingForDemo } from "./clientOnboardingEngine";
import { createContractorPortalTask, getContractorVisibleTask, submitContractorWork, clearContractorPortalForDemo } from "./contractorPortalEngine";
import { submitClinicPartnerIntake } from "./clinicDisabilityPartnerIntakeEngine";
import { createClientPortalRecord, getClientVisibleProjectStatus, attachApprovedDeliveryPacket, clearClientPortalForDemo } from "./creatorClientPortalEngine";
import { submitCreatorLead, validateCreatorLead } from "./creatorLeadIntakeEngine";
import { submitGrantPartnerIntake } from "./grantPartnerIntakeEngine";
import { submitPublicRequest } from "./publicRequestRouterEngine";
import { submitRevisionRequest, checkRevisionLimit, clearRevisionRequestsForDemo } from "./revisionRequestEngine";
import { submitTestimonial, createCaseStudyDraft, markApprovedForPublicUse, getApprovedPublicTestimonials, clearTestimonialsForDemo } from "./testimonialCaseStudyEngine";

clearClientPortalForDemo();
createClientPortalRecord({ id: "p1", clientName: "Client", projectName: "Clips", package: "Growth", startDate: "2099-01-01", dueDate: "2099-01-10", projectStatus: "Waiting on Cole Approval", deliverables: ["clips"], rawFootageLinks: [], revisionCount: 0, revisionLimit: 3, paymentStatus: "Paid", nextStep: "Approval", contractorNotes: "hidden", profitMargin: 50, riskFlags: ["hidden"], ColeApprovalStatus: "Pending" });
const visible = getClientVisibleProjectStatus("p1");
assertEqual(Object.prototype.hasOwnProperty.call(visible, "contractorNotes"), false);
assertThrows(() => attachApprovedDeliveryPacket("p1", "packet-1"));

assertThrows(() => validateCreatorLead({ creatorName: "Creator", email: "", platformLinks: [], contentType: "video", biggestProblem: "clips", numberOfLongVideos: 2, numberOfShortClipsNeeded: 20, editingHelpNeeded: true, timestampHelpNeeded: true, captionHelpNeeded: false, uploadCalendarNeeded: true, monthlyBudgetRange: "$1000" }));
const lead = submitCreatorLead({ creatorName: "Creator", email: "creator@example.com", platformLinks: ["yt"], contentType: "video", biggestProblem: "Need clips", numberOfLongVideos: 2, numberOfShortClipsNeeded: 20, editingHelpNeeded: true, timestampHelpNeeded: true, captionHelpNeeded: false, uploadCalendarNeeded: true, monthlyBudgetRange: "$1000" });
assertEqual(lead.recommendation, "Operator");
assertEqual(lead.draftReply.approvalRequired, true);

clearOnboardingForDemo();
const onboarding = createOnboardingRecord({ id: "o1", preferredName: "Client", email: "client@example.com", socialLinks: [], brandDescription: "brand", targetAudience: "fans", contentExamples: [], rawFootageLinks: [], deliverablesRequested: ["clips"], styleReferences: [], mustAvoid: [], deadline: "2099-01-10", revisionPolicyAcknowledged: false, paymentConfirmed: false });
assertEqual(validateOnboardingCompletion(onboarding).canBecomeActive, false);
assertEqual(sendStartApprovalToActionCenter(onboarding).approvalRequired, true);

clearDeliveryTrackersForDemo();
createDeliveryTracker({ id: "d1", clientName: "Client", projectName: "Clips", internalStatus: "Waiting on Cole Approval", paymentStatus: "Unpaid", blockers: ["missing footage"], revisionCount: 4, dueDate: "2099-01-10" });
assertEqual(generateDeliveryProgressSummary("d1").riskFlags.length, 3);
assertThrows(() => markApprovedForDelivery("d1", { approvedByCole: false }));
assertEqual(markApprovedForDelivery("d1", { approvedByCole: true }).coleApprovedDelivery, true);

clearRevisionRequestsForDemo();
submitRevisionRequest({ id: "r1", projectId: "p1", clientName: "Client", projectName: "Clips", deliveryItem: "clip1", requestedChange: "small caption fix", reason: "typo", priority: "Medium", submittedAt: "2099-01-01", status: "Submitted" });
submitRevisionRequest({ id: "r2", projectId: "p1", clientName: "Client", projectName: "Clips", deliveryItem: "clip1", requestedChange: "small caption fix", reason: "typo", priority: "Medium", submittedAt: "2099-01-01", status: "Submitted" });
submitRevisionRequest({ id: "r3", projectId: "p1", clientName: "Client", projectName: "Clips", deliveryItem: "clip1", requestedChange: "small caption fix", reason: "typo", priority: "Medium", submittedAt: "2099-01-01", status: "Submitted" });
assertEqual(checkRevisionLimit("p1").overLimit, true);
assertEqual(submitRevisionRequest({ id: "r4", projectId: "p1", clientName: "Client", projectName: "Clips", deliveryItem: "clip1", requestedChange: "new video", reason: "extra clips", priority: "High", submittedAt: "2099-01-01", status: "Submitted" }).approvalRequired, true);

clearContractorPortalForDemo();
assertThrows(() => createContractorPortalTask({ id: "ct1", contractorName: "Editor", role: "Editor", taskTitle: "Edit", projectName: "Clips", clientName: "Client", instructions: "Edit", fileLinks: [], deliverables: ["clips"], deadline: "2099-01-10", status: "Assigned", qualityChecklist: [], companyFinancials: "hidden" }));
createContractorPortalTask({ id: "ct1", contractorName: "Editor", role: "Editor", taskTitle: "Edit", projectName: "Clips", clientName: "Client", instructions: "Edit", fileLinks: [], deliverables: ["clips"], deadline: "2099-01-10", status: "Assigned", qualityChecklist: [], companyFinancials: "hidden", coleApprovedAssignment: true });
assertEqual(Object.prototype.hasOwnProperty.call(getContractorVisibleTask("ct1"), "companyFinancials"), false);
assertEqual(submitContractorWork("ct1", { submissionLink: "link" }).qualityReviewTask.relatedTask, "ct1");

const grant = submitGrantPartnerIntake({ organizationName: "Funder", contactName: "Grant Person", email: "grant@example.com", organizationType: "Nonprofit", fundingOrPartnershipType: "Grant", amountRange: "$25k", requiredDocuments: ["budget"], interestArea: "accessibility", accessibilityFocus: "independent living" });
assertEqual(grant.followUpDraft.approvalRequired, true);

const clinic = submitClinicPartnerIntake({ organizationName: "Clinic", contactName: "Partner", role: "Therapist", email: "clinic@example.com", currentPainPoints: "support", accessibilityNeeds: "tools", interestInPilot: true, interestInResearch: false, interestInReferral: true, notes: "no medical detail" });
assertEqual(clinic.followUpDraft.approvalRequired, true);

const request = submitPublicRequest({ name: "Lead", email: "lead@example.com", requestType: "Creator Logistics", message: "Need clips", consentToContact: true });
assertEqual(request.draftReply.approvalRequired, true);

clearTestimonialsForDemo();
submitTestimonial({ id: "t1", clientName: "Client", testimonialText: "Great", permissionToUse: false, dateReceived: "2099-01-01", status: "Draft" });
assertEqual(getApprovedPublicTestimonials().length, 0);
createCaseStudyDraft({ id: "cs1", title: "Case", clientOrProject: "Project", problem: "private data", solution: "solution", process: "process", outcome: "made progress", evidenceLinks: [], permissionStatus: "Needs Permission", publicUseApproved: false, status: "Draft" });
assertThrows(() => markApprovedForPublicUse("cs1", { approvedByCole: false }));
assertEqual(markApprovedForPublicUse("cs1", { approvedByCole: true }).status, "Approved for Public Use");

console.log("All ATLAS Batch 11 tests passed.");

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
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
