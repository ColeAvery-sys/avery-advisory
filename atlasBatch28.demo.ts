import { createResearchEffort, generateResearchCommandCenter } from "./researchCommandEngine";
import { createParticipantRecord, generateParticipantSummary } from "./participantCrmEngine";
import { createPilotProgram, generatePilotCheckIns } from "./pilotProgramManager";
import { generateUsabilityReport } from "./accessibilityTestingLab";
import { createGrantRecord, rankGrants } from "./grantIntelligenceEngine";
import { createOutcomeRecord, generateOutcomeReport } from "./outcomeMeasurementEngine";
import { createPublicationDraft, generateSlideDeckOutline } from "./researchPublicationBuilder";
import { createUniversityPartner, identifyUniversityOpportunities } from "./universityPartnershipTracker";
import { createHealthcarePartner, identifyHealthcarePilotPotential } from "./healthcarePartnershipTracker";
import { createAssistiveTechRoadmap, rankAssistiveTechRoadmaps } from "./assistiveTechnologyRoadmapEngine";

createResearchEffort({ projectName: "ATLAS Assist", stage: "Pilot", accessibilityValue: 9, evidenceStrength: 6, partnerFit: 7, grantFit: 8 });
createResearchEffort({ projectName: "EchoFrame", stage: "Research", accessibilityValue: 9, evidenceStrength: 4, partnerFit: 8, grantFit: 8 });
createParticipantRecord({ participantId: "demo-p-1", displayName: "Tester A", interestAreas: ["Executive Dysfunction", "Accessibility"], consentStatus: "Approved" });
createPilotProgram({ id: "demo-pilot", programName: "ATLAS Assist Pilot", goals: ["Observe task completion", "Collect usability feedback"] });
createGrantRecord({ grantName: "Assistive Technology Innovation Grant", sponsor: "Foundation", eligibility: 9, missionFit: 9, requirementsReadiness: 7, partnerFit: 7, awardSize: 50000 });
createOutcomeRecord({ programId: "demo-pilot", taskCompletion: 8, userSatisfaction: 9, retention: 7 });
createUniversityPartner({ organization: "West Virginia University", researchInterests: ["Accessibility", "Assistive technology"] });
createHealthcarePartner({ organization: "Local Clinic", interests: ["Executive dysfunction support"], pilotPotential: "Medium" });
createAssistiveTechRoadmap({ productName: "EchoFrame", stage: "Prototype", accessibilityValue: 9, evidenceStrength: 5, partnerFit: 8, grantFit: 8 });

console.log("Batch 28 Accessibility Research Institute Snapshot");
console.log({
  commandCenter: generateResearchCommandCenter(),
  participants: generateParticipantSummary(),
  pilotCheckIns: generatePilotCheckIns("demo-pilot"),
  accessibilityReport: generateUsabilityReport({ productName: "ATLAS Assist", navigation: 8, readability: 7, audio: 6, voiceControl: 5, executiveFunctionLoad: 4, visualClarity: 8, cognitiveLoad: 4, errorRecovery: 5 }),
  grants: rankGrants(),
  outcomeReport: generateOutcomeReport("demo-pilot"),
  publication: createPublicationDraft({ title: "ATLAS Assist Pilot Summary", publicationType: "White Paper" }),
  slideDeck: generateSlideDeckOutline({ title: "ATLAS Assist Pilot Summary" }),
  universityOpportunities: identifyUniversityOpportunities(),
  healthcarePilotPotential: identifyHealthcarePilotPotential(),
  roadmaps: rankAssistiveTechRoadmaps(),
});
