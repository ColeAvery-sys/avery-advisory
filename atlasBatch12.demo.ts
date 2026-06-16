import { submitAtlasAssistInterest } from "./atlasAssistInterestEngine";
import { createProofItem, getInternalOnlyProofItems, clearProofItemsForDemo } from "./caseStudyProofEngine";
import { submitCreatorSalesLead } from "./creatorLogisticsSalesEngine";
import { submitDemoRequest } from "./demoRequestEngine";
import { generateFunderSummary } from "./funderCredibilityEngine";
import { generateAveryTechHeroCopy, generateAtlasAssistCopy } from "./landingPageContentEngine";
import { createLeadMagnetRecord, submitLeadMagnetRequest, clearLeadMagnetsForDemo } from "./leadMagnetEngine";
import { submitPartnerInquiry } from "./partnerPageIntakeEngine";
import { routeWebsiteLead } from "./websiteLeadRouter";
import { recordWebsiteEvent, generateWebsiteAnalyticsSummary, clearWebsiteAnalyticsForDemo } from "./websiteAnalyticsEngine";

clearProofItemsForDemo();
clearLeadMagnetsForDemo();
clearWebsiteAnalyticsForDemo();

console.log("Landing Page Content");
console.log(generateAveryTechHeroCopy());
console.log(generateAtlasAssistCopy());

console.log("\nWebsite Lead Router");
console.log(routeWebsiteLead({ name: "Creator Lead", email: "creator@example.com", message: "Need clips from long videos", sourcePage: "Creator Logistics", consentToContact: true }));

console.log("\nATLAS Assist Interest");
console.log(submitAtlasAssistInterest({ name: "Clinic Partner", email: "clinic@example.com", userType: "clinic", organization: "Clinic", accessibilityInterest: "pilot", supportNeed: "organization support", consentToContact: true }));

console.log("\nCreator Logistics Sales");
console.log(submitCreatorSalesLead({ name: "Creator", email: "creator@example.com", platformLinks: ["youtube"], longVideos: 4, shortClipsNeeded: 30, needsTimestamps: true, needsUploadCalendar: true }));

console.log("\nFunder Credibility");
console.log(generateFunderSummary({ companyName: "AveryTech" }));

console.log("\nPartner Intake");
console.log(submitPartnerInquiry({ name: "Partner", email: "partner@example.com", organization: "Support Org", partnerType: "Disability Advocate", message: "Interested in accessibility workflows", consentToContact: true }));

console.log("\nProof System");
createProofItem({ id: "proof-demo", title: "Prototype screenshot", proofType: "screenshot", summary: "ATLAS Assist prototype", permissionGranted: false, coleApprovedPublicUse: false, prototype: true, status: "Internal Only" });
console.log(getInternalOnlyProofItems());

console.log("\nDemo Request");
console.log(submitDemoRequest({ name: "Demo Lead", email: "demo@example.com", interestType: "ATLAS Assist", message: "Interested in pilot info", consentToContact: true }));

console.log("\nLead Magnet");
createLeadMagnetRecord({ id: "lm-demo", title: "Creator Content Organization Checklist", category: "Creator Logistics", description: "Checklist" });
console.log(submitLeadMagnetRequest({ email: "lead@example.com", name: "Lead", interestCategory: "Creator Logistics", selectedLeadMagnet: "Creator Content Organization Checklist", consentToContact: true }));

console.log("\nWebsite Analytics");
recordWebsiteEvent({ eventType: "page viewed", page: "creator", timestamp: "2099-01-01", visitorId: "anon-1" });
recordWebsiteEvent({ eventType: "form submitted", page: "creator", timestamp: "2099-01-01", visitorId: "anon-1", conversionStatus: "Converted" });
console.log(generateWebsiteAnalyticsSummary({ start: "2099-01-01", end: "2099-12-31" }));
