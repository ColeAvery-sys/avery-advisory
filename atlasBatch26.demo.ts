import { createTalentRecord, generateTalentCommandCenter } from "./talentCommandEngine";
import { createApplicantRecord, generateApplicantRecommendation } from "./applicantTrackingEngine";
import { createEditorRecord, createShadowEditorPlan } from "./editorManagementEngine";
import { createContractorRecord, matchContractorToWork } from "./contractorManagementEngine";
import { generateTrainingPack } from "./onboardingAcademyEngine";
import { createSkillProfile, identifySkillGaps, identifyHiringNeeds } from "./skillCapabilityMatrixEngine";
import { balanceWorkload } from "./workloadBalancerEngine";
import { createPerformanceReview } from "./performanceReviewEngine";
import { generateExitContinuityPlan } from "./knowledgeTransferEngine";
import { generateEditorCareerPath, mapPersonToCareerPath } from "./careerPathEngine";

createTalentRecord({ name: "Avery Editor", role: "Editor", availability: "Available", qualityScore: 9, reliabilityScore: 9, communicationScore: 8, speedScore: 7 });
createTalentRecord({ name: "Busy Contractor", role: "Artist", availability: "Limited", activeProjects: 5, weeklyHours: 45, deadlinesThisWeek: 3, stress: 9 });

const applicant = createApplicantRecord({ applicantName: "Shadow Editor Candidate", portfolioQuality: 8, skillFit: 7, rateFit: 7, testResults: 8 });
const editor = createEditorRecord({ id: "editor-demo", editorName: "Avery Editor", qualityScore: 9, reliabilityScore: 9, communicationScore: 8, speedScore: 7 });
createContractorRecord({ id: "contractor-demo", contractorName: "Motion Artist", skills: ["motion", "thumbnail"], qualityScore: 8, reliabilityScore: 8 });
createSkillProfile({ personId: "editor-demo", personName: "Avery Editor", skills: { DaVinci: 8, "YouTube SEO": 7, Blender: 3 }, reliability: 9 });

const path = generateEditorCareerPath();

console.log("Batch 26 Workforce Snapshot");
console.log({
  commandCenter: generateTalentCommandCenter(),
  applicant: generateApplicantRecommendation(applicant.id),
  shadowEditorPlan: createShadowEditorPlan(editor.id),
  contractorMatches: matchContractorToWork({ requiredSkills: ["thumbnail"] }),
  training: generateTrainingPack("Creator Logistics").moduleName,
  skillGaps: identifySkillGaps(["DaVinci", "Blender", "Asset Rights"]),
  hiringNeeds: identifyHiringNeeds(["Blender"]),
  workloadPlan: balanceWorkload([{ name: "Avery Editor", activeProjects: 1, weeklyHours: 12 }], [{ title: "Creator clip pack" }]),
  performanceReview: createPerformanceReview({ id: "editor-demo", name: "Avery Editor" }, { qualityScore: 9, reliabilityScore: 9, communicationScore: 8 }),
  continuity: generateExitContinuityPlan({ name: "Avery Editor", files: ["delivery checklist"] }),
  careerPath: mapPersonToCareerPath({ name: "Avery Editor", capabilityScore: 82 }, path.id),
});
