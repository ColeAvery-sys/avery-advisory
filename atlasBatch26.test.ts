import { createWorkforceGate, detectWorkforceRisks, scoreWorkQuality, workloadRisk } from "./workforceSafety";
import { createTalentRecord, generateTalentCommandCenter } from "./talentCommandEngine";
import { createApplicantRecord, updateApplicantStage, generateApplicantRecommendation } from "./applicantTrackingEngine";
import { createEditorRecord, assignEditorProject, recordEditorDelivery, calculateEditorMetrics, createShadowEditorPlan } from "./editorManagementEngine";
import { createContractorRecord, matchContractorToWork, generateContractorProfile, identifyContractorSkillCoverage } from "./contractorManagementEngine";
import { generateTrainingPack, assignTraining } from "./onboardingAcademyEngine";
import { createSkillProfile, calculateCapabilityScore, identifySkillGaps, identifyTrainingNeeds, identifyPromotionCandidates, identifyHiringNeeds } from "./skillCapabilityMatrixEngine";
import { calculateWorkload, balanceWorkload, generateWorkloadRecommendation } from "./workloadBalancerEngine";
import { createPerformanceReview } from "./performanceReviewEngine";
import { createKnowledgeTransferItem, generateExitContinuityPlan, createWorkflowGuide, searchKnowledgeTransfer } from "./knowledgeTransferEngine";
import { generateEditorCareerPath, generateCareerRequirements, mapPersonToCareerPath } from "./careerPathEngine";

assertEqual(createWorkforceGate("Hire editor", ["Hiring"]).approvalStatus, "Needs Cole Approval");
assertEqual(detectWorkforceRisks({ action: "hire contractor and change rate" }).length >= 2, true);
assertEqual(scoreWorkQuality({ qualityScore: 9, reliabilityScore: 9, communicationScore: 8, speedScore: 7 }) >= 80, true);
assertEqual(workloadRisk({ activeProjects: 5, weeklyHours: 45, deadlinesThisWeek: 3, stress: 9 }), "High");

createTalentRecord({ id: "talent-1", name: "Avery Editor", role: "Editor", availability: "Available", qualityScore: 9, reliabilityScore: 9, communicationScore: 8, speedScore: 8 });
const command = generateTalentCommandCenter();
assertEqual(command.totalPeople, 1);
assertEqual(command.topPerformers[0], "Avery Editor");

const applicant = createApplicantRecord({ id: "app-1", applicantName: "Editor Candidate", portfolioQuality: 9, skillFit: 8, rateFit: 7, testResults: 9 });
assertEqual(applicant.atlasRecommendation, "Strong Candidate");
assertEqual(updateApplicantStage("app-1", "Offer").approvalStatus, "Needs Cole Approval");
assertEqual(generateApplicantRecommendation("app-1").approvalStatus, "Needs Cole Approval");

const editor = createEditorRecord({ id: "editor-1", editorName: "Lead Editor", qualityScore: 9, reliabilityScore: 8, communicationScore: 8, speedScore: 7, activeProjects: 1 });
assertEqual(editor.qualityIndex >= 80, true);
assertEqual(assignEditorProject("editor-1", { projectName: "Client edit" }, {}).assignmentStatus, "Blocked - Cole Approval Required");
assertEqual(assignEditorProject("editor-1", { projectName: "Client edit" }, { approvedBy: "Cole", approvalStatus: "Approved" }).assignmentStatus, "Assigned With Approval");
recordEditorDelivery("editor-1", { deliveryDays: 3, revisions: 1 });
assertEqual(calculateEditorMetrics("editor-1").revisionCount, 1);
assertEqual(createShadowEditorPlan("editor-1").approvalRequiredBeforeClientWork, true);

createContractorRecord({ id: "contractor-1", contractorName: "Motion Artist", skills: ["motion", "thumbnail"], preferredWorkTypes: ["promo"], qualityScore: 8, reliabilityScore: 8 });
assertEqual(matchContractorToWork({ requiredSkills: ["motion"] })[0].contractorId, "contractor-1");
assertEqual(generateContractorProfile("contractor-1").approvalStatus, "Draft");
assertEqual(identifyContractorSkillCoverage().indexOf("thumbnail") >= 0, true);

const training = generateTrainingPack("Asset Rights");
assertEqual(training.checklist.length >= 5, true);
assertEqual(assignTraining("talent-1", training.id).completionStatus, "Not Started");

const skillProfile = createSkillProfile({ id: "skill-1", personId: "talent-1", personName: "Avery Editor", skills: { DaVinci: 8, "YouTube SEO": 7, "Motion Graphics": 3 }, reliability: 9 });
assertEqual(calculateCapabilityScore(skillProfile) >= 60, true);
assertEqual(identifySkillGaps(["DaVinci", "Blender"]).indexOf("Blender") >= 0, true);
assertEqual(identifyTrainingNeeds("talent-1")[0].skill, "Motion Graphics");
assertEqual(identifyPromotionCandidates().length, 0);
assertEqual(identifyHiringNeeds(["Blender"])[0].approvalRequiredBeforeHiring, true);

assertEqual(calculateWorkload({ name: "Busy Editor", activeProjects: 5, weeklyHours: 45, deadlinesThisWeek: 3, stress: 9 }).risk, "High");
assertEqual(balanceWorkload([{ name: "Available Editor", activeProjects: 1, weeklyHours: 10 }], [{ title: "Clip pack" }])[0].recommendedOwner, "Available Editor");
assertEqual(generateWorkloadRecommendation({ name: "Busy Editor", activeProjects: 5, weeklyHours: 45, deadlinesThisWeek: 3, stress: 9 }).recommendation, "Delay new work, delegate, or hire help.");

const review = createPerformanceReview({ id: "talent-1", name: "Avery Editor" }, { qualityScore: 9, reliabilityScore: 8, communicationScore: 5 });
assertEqual(review.weaknesses[0], "Communication");
assertEqual(review.approvalRequiredForDisciplineOrCompChange, true);

createKnowledgeTransferItem({ id: "transfer-1", type: "Template", title: "Editing Handoff Template" });
assertEqual(generateExitContinuityPlan({ name: "Avery Editor" }).approvalRequiredBeforeAccessChanges, true);
assertEqual(createWorkflowGuide({ title: "Creator Logistics Handoff" }).type, "Workflow Guide");
assertEqual(searchKnowledgeTransfer("handoff").length >= 2, true);

const path = generateEditorCareerPath();
assertEqual(generateCareerRequirements("Junior Editor").indexOf("Pass test task") >= 0, true);
assertEqual(mapPersonToCareerPath({ name: "Avery Editor", capabilityScore: 82 }, path.id).promotionRequiresColeApproval, true);

console.log("All ATLAS Batch 26 tests passed.");

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
}
