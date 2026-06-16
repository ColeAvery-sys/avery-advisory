import { submitAtlasAssistInterest } from "./atlasAssistInterestEngine";
import { createProofItem, getApprovedPublicProofItems, validateProofForPublicUse, clearProofItemsForDemo } from "./caseStudyProofEngine";
import { submitCreatorSalesLead } from "./creatorLogisticsSalesEngine";
import { submitDemoRequest } from "./demoRequestEngine";
import { validateFunderClaims, generateFunderReplyDraft } from "./funderCredibilityEngine";
import { generateAveryTechHeroCopy, validatePublicClaims } from "./landingPageContentEngine";
import { createLeadMagnetRecord, submitLeadMagnetRequest, clearLeadMagnetsForDemo } from "./leadMagnetEngine";
import { submitPartnerInquiry } from "./partnerPageIntakeEngine";
import { routeWebsiteLead } from "./websiteLeadRouter";
import { recordWebsiteEvent, calculateConversionRate, identifyDropOffPoints, clearWebsiteAnalyticsForDemo } from "./websiteAnalyticsEngine";

assertEqual(generateAveryTechHeroCopy().ctas.includes("Request a Demo"), true);
assertEqual(validatePublicClaims("This will guarantee growth").valid, false);

const routed = routeWebsiteLead({ name: "Lead", email: "lead@example.com", message: "Need creator clips", consentToContact: true });
assertEqual(routed.inboxItem.assignedAgent, "ATLAS Sales Operator");
assertEqual(routed.draftReply.approvalRequired, true);

assertThrows(() => submitAtlasAssistInterest({ name: "User", email: "u@example.com", userType: "individual", accessibilityInterest: "support", supportNeed: "diagnosis details", consentToContact: true }));
const assist = submitAtlasAssistInterest({ name: "User", email: "u@example.com", userType: "clinic", organization: "Clinic", accessibilityInterest: "overwhelm support", supportNeed: "organization", consentToContact: true });
assertEqual(assist.followUpDraft.approvalRequired, true);

const sales = submitCreatorSalesLead({ name: "Creator", email: "c@example.com", platformLinks: [], longVideos: 3, shortClipsNeeded: 30, needsTimestamps: true, needsUploadCalendar: true });
assertEqual(sales.packageRecommendation, "Operator");
assertEqual(sales.proposalDraft.approvalRequired, true);

assertEqual(validateFunderClaims("We guarantee outcomes").valid, false);
assertEqual(generateFunderReplyDraft({ contactName: "Funder" }).approvalRequired, true);

const partner = submitPartnerInquiry({ name: "Partner", email: "p@example.com", partnerType: "Clinic", message: "Interested", consentToContact: true });
assertEqual(partner.replyDraft.approvalRequired, true);

clearProofItemsForDemo();
const proof = createProofItem({ id: "proof-1", title: "Prototype screenshot", proofType: "screenshot", summary: "prototype", permissionGranted: false, coleApprovedPublicUse: false, sensitiveInfo: "private data", prototype: true, status: "Internal Only" });
assertEqual(validateProofForPublicUse(proof).valid, false);
assertEqual(getApprovedPublicProofItems().length, 0);

const demo = submitDemoRequest({ name: "Demo", email: "d@example.com", interestType: "ATLAS Assist", message: "accessibility", consentToContact: true });
assertEqual(demo.replyDraft.approvalRequired, true);

clearLeadMagnetsForDemo();
createLeadMagnetRecord({ id: "lm-1", title: "Overwhelm Mode Checklist", category: "ATLAS Assist", description: "safe checklist" });
assertThrows(() => submitLeadMagnetRequest({ email: "x@example.com", name: "X", interestCategory: "ATLAS Assist", selectedLeadMagnet: "Overwhelm Mode Checklist", consentToContact: false }));
assertEqual(submitLeadMagnetRequest({ email: "x@example.com", name: "X", interestCategory: "ATLAS Assist", selectedLeadMagnet: "Overwhelm Mode Checklist", consentToContact: true }).followUpDraft.approvalRequired, true);

clearWebsiteAnalyticsForDemo();
recordWebsiteEvent({ eventType: "page viewed", page: "creator", timestamp: "2099-01-01", visitorId: "v1" });
recordWebsiteEvent({ eventType: "form started", page: "creator", timestamp: "2099-01-01", visitorId: "v1" });
recordWebsiteEvent({ eventType: "form submitted", page: "creator", timestamp: "2099-01-01", visitorId: "v1" });
assertEqual(calculateConversionRate("creator"), 0.5);
assertEqual(identifyDropOffPoints().length, 0);

console.log("All ATLAS Batch 12 tests passed.");

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
