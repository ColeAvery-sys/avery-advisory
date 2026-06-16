import { createResearchGate, detectResearchRisks, evidenceBeforeExpansionStatus, scoreMissionFit } from "./researchInstituteSafety";
import { createResearchEffort, generateResearchCommandCenter } from "./researchCommandEngine";
import { createParticipantRecord, generateParticipantSummary, matchParticipantsToPilot, updateParticipantConsent } from "./participantCrmEngine";
import { addParticipantToPilot, createPilotProgram, generatePilotCheckIns, summarizePilotResults } from "./pilotProgramManager";
import { createAccessibilityTest, generateUsabilityReport, runAccessibilityScore } from "./accessibilityTestingLab";
import { createGrantRecord, generateGrantReadinessPacket, rankGrants } from "./grantIntelligenceEngine";
import { calculateOutcomeSummary, createOutcomeRecord, generateOutcomeReport } from "./outcomeMeasurementEngine";
import { createPublicationDraft, generateExecutiveSummary, generateSlideDeckOutline } from "./researchPublicationBuilder";
import { createUniversityPartner, generateUniversityOutreachBrief, identifyUniversityOpportunities, logUniversityMeeting } from "./universityPartnershipTracker";
import { createHealthcarePartner, generateHealthcareOutreachBrief, identifyHealthcarePilotPotential, logHealthcareMeeting } from "./healthcarePartnershipTracker";
import { createAssistiveTechRoadmap, generateRoadmapStages, rankAssistiveTechRoadmaps, recommendNextRoadmapAction } from "./assistiveTechnologyRoadmapEngine";

assertEqual(createResearchGate("Grant submission", ["approval"]).approvalStatus, "Needs Cole Approval");
assertEqual(detectResearchRisks({ note: "clinical claim and submit grant" }).length >= 2, true);
assertEqual(evidenceBeforeExpansionStatus({ stage: "Scale" }).blockedFromScale, true);
assertEqual(scoreMissionFit({ accessibilityValue: 9, evidenceStrength: 8, partnerFit: 8, grantFit: 8 }) >= 70, true);

createResearchEffort({ id: "effort-1", projectName: "ATLAS Assist", stage: "Pilot", accessibilityValue: 9, evidenceStrength: 6 });
createResearchEffort({ id: "effort-2", projectName: "EchoFrame", stage: "Scale" });
const command = generateResearchCommandCenter();
assertEqual(command.totalEfforts, 2);
assertEqual(command.blockedFromScale.indexOf("EchoFrame") >= 0, true);

const participant = createParticipantRecord({ participantId: "p-1", displayName: "Tester A", interestAreas: ["Executive Dysfunction", "Accessibility"], consentStatus: "Not Collected", diagnosis: "should not store" });
assertEqual((participant as any).diagnosis, undefined);
assertEqual(updateParticipantConsent("p-1", "Approved", { approvedBy: "Cole" }).consentStatus, "Approved");
assertEqual(matchParticipantsToPilot("Accessibility")[0].participantId, "p-1");
assertEqual(generateParticipantSummary().consented, 1);

const pilot = createPilotProgram({ id: "pilot-1", programName: "ATLAS Assist Pilot", goals: ["Observe task completion"] });
assertEqual(addParticipantToPilot("pilot-1", "p-1", {}).status, "Blocked - Cole Approval Required");
addParticipantToPilot("pilot-1", "p-1", { approvedBy: "Cole" });
assertEqual(generatePilotCheckIns("pilot-1").checkIns.length, 5);
assertEqual(summarizePilotResults("pilot-1").claimsAllowed, false);

const accessTest = createAccessibilityTest({ id: "test-1", productName: "ATLAS Assist", navigation: 8, readability: 8, audio: 6, voiceControl: 5, executiveFunctionLoad: 4, visualClarity: 8, cognitiveLoad: 4, errorRecovery: 5 });
assertEqual(runAccessibilityScore(accessTest) < 70, true);
assertEqual(generateUsabilityReport(accessTest).recommendations.length >= 1, true);

createGrantRecord({ id: "grant-1", grantName: "Accessibility Innovation Grant", sponsor: "Foundation", eligibility: 9, missionFit: 9, requirementsReadiness: 7, partnerFit: 6, awardSize: 75000 });
assertEqual(rankGrants()[0].grantName, "Accessibility Innovation Grant");
assertEqual(generateGrantReadinessPacket("grant-1").approvalStatus, "Needs Cole Approval");

createOutcomeRecord({ programId: "pilot-1", taskCompletion: 8, userSatisfaction: 9, retention: 7 });
assertEqual(calculateOutcomeSummary("pilot-1").observedOnly, true);
assertEqual(generateOutcomeReport("pilot-1").prohibitedClaims.indexOf("medical efficacy") >= 0, true);

const publication = createPublicationDraft({ title: "ATLAS Assist Pilot Summary", publicationType: "White Paper", summary: "Observed outcomes only." });
assertEqual(publication.claimsReviewRequired, true);
assertEqual(generateExecutiveSummary({ title: "ATLAS Assist" }).approvalRequiredBeforeSharing, true);
assertEqual(generateSlideDeckOutline({ title: "ATLAS Assist" }).length, 7);

createUniversityPartner({ id: "u-1", organization: "West Virginia University", researchInterests: ["Accessibility", "Assistive technology"] });
logUniversityMeeting("u-1", { date: "2026-05-29", notes: "Intro call" });
assertEqual(identifyUniversityOpportunities()[0].organization, "West Virginia University");
assertEqual(generateUniversityOutreachBrief("u-1").approvalStatus, "Needs Cole Approval");

createHealthcarePartner({ id: "h-1", organization: "Local Clinic", interests: ["Executive dysfunction support"], pilotPotential: "High" });
logHealthcareMeeting("h-1", { notes: "Discussed non-clinical feedback" });
assertEqual(identifyHealthcarePilotPotential()[0].clinicalClaimsAllowed, false);
assertEqual(generateHealthcareOutreachBrief("h-1").approvalStatus, "Needs Cole Approval");

const roadmap = createAssistiveTechRoadmap({ id: "roadmap-1", productName: "EchoFrame", stage: "Prototype", accessibilityValue: 9, evidenceStrength: 5, partnerFit: 7, grantFit: 7 });
assertEqual(generateRoadmapStages(roadmap.id).stages.length, 6);
assertEqual(recommendNextRoadmapAction(roadmap.id), "Recruit approved pilot participants.");
assertEqual(rankAssistiveTechRoadmaps()[0].productName, "EchoFrame");

console.log("All ATLAS Batch 28 tests passed.");

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
}
