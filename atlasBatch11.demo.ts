import { createDeliveryTracker, generateDeliveryProgressSummary } from "./clientDeliveryTrackerEngine";
import { createOnboardingRecord, validateOnboardingCompletion } from "./clientOnboardingEngine";
import { createContractorPortalTask, getContractorVisibleTask, clearContractorPortalForDemo } from "./contractorPortalEngine";
import { submitClinicPartnerIntake } from "./clinicDisabilityPartnerIntakeEngine";
import { createClientPortalRecord, getClientVisibleProjectStatus, clearClientPortalForDemo } from "./creatorClientPortalEngine";
import { submitCreatorLead } from "./creatorLeadIntakeEngine";
import { submitGrantPartnerIntake } from "./grantPartnerIntakeEngine";
import { submitPublicRequest } from "./publicRequestRouterEngine";
import { submitRevisionRequest, clearRevisionRequestsForDemo } from "./revisionRequestEngine";
import { submitTestimonial, getInternalOnlyTestimonials, clearTestimonialsForDemo } from "./testimonialCaseStudyEngine";

clearClientPortalForDemo();
clearRevisionRequestsForDemo();
clearContractorPortalForDemo();
clearTestimonialsForDemo();

console.log("Creator Lead Intake");
console.log(submitCreatorLead({ creatorName: "Creator", email: "creator@example.com", platformLinks: ["youtube"], contentType: "video", biggestProblem: "Need clips and timestamps", numberOfLongVideos: 3, numberOfShortClipsNeeded: 24, editingHelpNeeded: true, timestampHelpNeeded: true, captionHelpNeeded: true, uploadCalendarNeeded: true, monthlyBudgetRange: "$1000" }));

console.log("\nClient Onboarding");
const onboarding = createOnboardingRecord({ id: "onboard-1", preferredName: "Creator", email: "creator@example.com", socialLinks: ["youtube"], brandDescription: "Educational creator", targetAudience: "founders", contentExamples: [], rawFootageLinks: ["drive"], deliverablesRequested: ["clips", "timestamps"], styleReferences: [], mustAvoid: [], deadline: "2099-01-10", revisionPolicyAcknowledged: true, paymentConfirmed: true, coleApprovedStart: false });
console.log(validateOnboardingCompletion(onboarding));

console.log("\nClient Portal");
createClientPortalRecord({ id: "portal-1", clientName: "Creator", projectName: "Clip package", package: "Operator", startDate: "2099-01-01", dueDate: "2099-01-10", projectStatus: "Editing / Organizing", deliverables: ["clips"], rawFootageLinks: ["drive"], revisionCount: 1, revisionLimit: 3, paymentStatus: "Paid", nextStep: "Quality check", contractorNotes: "hidden", profitMargin: 60, riskFlags: ["hidden"] });
console.log(getClientVisibleProjectStatus("portal-1"));

console.log("\nDelivery Tracker");
createDeliveryTracker({ id: "delivery-1", clientName: "Creator", projectName: "Clip package", internalStatus: "Quality Check", paymentStatus: "Paid", blockers: [], revisionCount: 1, dueDate: "2099-01-10" });
console.log(generateDeliveryProgressSummary("delivery-1"));

console.log("\nRevision Request");
console.log(submitRevisionRequest({ id: "rev-1", projectId: "portal-1", clientName: "Creator", projectName: "Clip package", deliveryItem: "clip 1", requestedChange: "caption typo", reason: "fix typo", priority: "Medium", submittedAt: "2099-01-02", status: "Submitted" }));

console.log("\nContractor Portal");
createContractorPortalTask({ id: "contractor-1", contractorName: "Editor", role: "Editor", taskTitle: "Edit clips", projectName: "Clip package", clientName: "Creator", instructions: "Edit clips only.", fileLinks: ["drive"], deliverables: ["clips"], deadline: "2099-01-08", status: "Assigned", qualityChecklist: ["Check captions"], companyFinancials: "hidden", coleApprovedAssignment: true });
console.log(getContractorVisibleTask("contractor-1"));

console.log("\nGrant Partner Intake");
console.log(submitGrantPartnerIntake({ organizationName: "Funder", contactName: "Grant Lead", email: "grant@example.com", organizationType: "Foundation", fundingOrPartnershipType: "Grant", amountRange: "$25k", requiredDocuments: ["budget"], interestArea: "accessibility", accessibilityFocus: "independent living" }));

console.log("\nClinic/Disability Partner Intake");
console.log(submitClinicPartnerIntake({ organizationName: "Clinic", contactName: "Partner", role: "Therapist", email: "clinic@example.com", currentPainPoints: "accessibility workflow", accessibilityNeeds: "organization tools", interestInPilot: true, interestInResearch: false, interestInReferral: true }));

console.log("\nPublic Request Router");
console.log(submitPublicRequest({ name: "Lead", email: "lead@example.com", requestType: "ATLAS Assist", message: "Accessibility tool inquiry", consentToContact: true }));

console.log("\nTestimonials and Case Studies");
submitTestimonial({ id: "testimonial-1", clientName: "Client", testimonialText: "Helpful work.", permissionToUse: false, dateReceived: "2099-01-01", status: "Draft" });
console.log(getInternalOnlyTestimonials());
