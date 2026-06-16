import { classifyRdPriority, createRdGate, detectRdRisks, prototypeFirstStatus } from "./rdSafety";
import { createRdProject, generateRdCommandCenter, routeRdProject } from "./rdCommandEngine";
import { createSoftwareProject, estimateSoftwareEffort, generateSoftwareProjectPlan, identifySoftwareRisks, updateSoftwareProjectStatus } from "./softwareProjectManager";
import { createRoadmapFeature, generateFeatureDecision, prioritizeFeatureRoadmap } from "./featureRoadmapEngine";
import { createRdBugReport, prioritizeRdBugs } from "./bugTrackerEngine";
import { createResearchNote, generateFutureProductIdeas, generateGrantOpportunitiesFromResearch, generateResearchSummary } from "./researchLabEngine";
import { createExperiment, generateExperimentPlan, updateExperimentStage, validateExperimentForProduct } from "./experimentTrackerEngine";
import { blockScopeCreep, createGodotStudioProject, generateGameDesignDoc, generateGodotBuildPlan, validateGodotPrototype } from "./godotStudioManager";
import { advanceBlenderAssetStage, createBlenderPipelineAsset, generateBlenderAssetChecklist, routeBlenderAsset } from "./blenderAssetPipeline";
import { createPrintProject, estimatePrintCost, generatePrintabilityChecklist, validatePrintPrototype } from "./printingPipeline";
import { comparePrototypes, enforcePrototypeFirstRule, scorePrototypeIdea } from "./prototypeScoringEngine";

assertEqual(createRdGate("Deploy product", ["release"]).approvalStatus, "Needs Cole Approval");
assertEqual(detectRdRisks({ action: "deploy production code and order hardware" }).length >= 2, true);
assertEqual(classifyRdPriority({ projectName: "ATLAS Assist onboarding" }).tier, 1);
assertEqual(prototypeFirstStatus({ status: "Full Production" }).blockedFromFullDevelopment, true);

const rdProject = createRdProject({ id: "rd-1", projectName: "ATLAS Assist", status: "Prototype", researchComplete: true, prototypeValidated: true, missionScore: 9, accessibilityScore: 10 });
createRdProject({ id: "rd-2", projectName: "Experimental Godot Game", status: "Full Production" });
const command = generateRdCommandCenter();
assertEqual(command.totalProjects, 2);
assertEqual(command.blockedProjects.indexOf("Experimental Godot Game") >= 0, true);
assertEqual(routeRdProject(rdProject.id).route, "Experiment Tracker");

const software = createSoftwareProject({ id: "sw-1", projectName: "EchoFrame", features: ["caption repeat", "tone mode"], dependencies: ["local storage"], researchComplete: true });
assertEqual(generateSoftwareProjectPlan(software).requirements.length >= 3, true);
assertEqual(estimateSoftwareEffort(software).estimateLabel, "Small");
assertEqual(identifySoftwareRisks({ projectName: "Public release", status: "production" }).length > 0, true);
assertEqual(updateSoftwareProjectStatus("sw-1", "Testing").status, "Testing");

const feature = createRoadmapFeature({ id: "feat-1", featureTitle: "ATLAS Assist low battery mode", missionValue: 9, accessibilityValue: 9, revenueValue: 5, complexity: 3, risk: 2, developmentTime: 3, maintenanceCost: 3 });
assertEqual(feature.recommendation, "Build Now");
assertEqual(generateFeatureDecision({ featureTitle: "medical claim dashboard", risk: 9 }).recommendation, "Research First");
assertEqual(prioritizeFeatureRoadmap([{ featureTitle: "small assistive feature", missionValue: 8 }, { featureTitle: "risky launch", risk: 9 }])[0].featureTitle, "small assistive feature");

const bug = createRdBugReport({ id: "rd-bug-1", bugTitle: "ATLAS Assist keyboard accessibility broken", product: "ATLAS Assist", expectedBehavior: "Keyboard navigation works", actualBehavior: "Keyboard navigation fails" });
assertEqual(bug.rdCategory, "Accessibility");
assertEqual(prioritizeRdBugs("ATLAS Assist")[0].id, "rd-bug-1");

createResearchNote({ id: "research-1", category: "Accessibility", title: "Visual schedules", finding: "Visual prompts may reduce friction.", opportunity: "Pilot visual schedule support" });
assertEqual(generateResearchSummary("Accessibility").noteCount, 1);
assertEqual(generateGrantOpportunitiesFromResearch("Accessibility")[0].grantAngle.indexOf("Accessibility") >= 0, true);
assertEqual(generateFutureProductIdeas("Accessibility")[0].prototypeFirstRequired, true);

const experiment = createExperiment({ id: "exp-1", experimentName: "Smart glasses repeat last sentence", stage: "Idea" });
assertEqual(generateExperimentPlan(experiment).stages.length, 6);
assertEqual(updateExperimentStage("exp-1", "Pilot").stage, "Needs Cole Approval");
assertEqual(updateExperimentStage("exp-1", "Validated", { approvedBy: "Cole" }).stage, "Validated");
assertEqual(validateExperimentForProduct("exp-1").canBecomeProduct, true);

const godot = createGodotStudioProject({ id: "godot-1", gameTitle: "Road to Halvia", concept: "Prototype travel loop", coreLoopValidated: false });
assertEqual(generateGameDesignDoc(godot).prototypeGoal.indexOf("Playable") >= 0, true);
assertEqual(generateGodotBuildPlan(godot).indexOf("Playtest") >= 0, true);
assertEqual(validateGodotPrototype(godot).canEnterFullProduction, false);
assertEqual(blockScopeCreep({ gameTitle: "Road to Halvia", extraFeatures: ["open world"] }).blockedFeatures[0], "open world");

const asset = createBlenderPipelineAsset({ id: "asset-1", assetName: "EchoFrame prop", targetUse: "prototype" });
assertEqual(generateBlenderAssetChecklist(asset).checks.indexOf("Rights clear") >= 0, true);
assertEqual(advanceBlenderAssetStage("asset-1", "Export").stage, "Needs Cole Approval");
assertEqual(routeBlenderAsset("asset-1", "Godot").routeStatus, "Blocked until approved");

const print = createPrintProject({ id: "print-1", productName: "Desk toy prototype", materialCost: 3, printHours: 2 });
assertEqual(generatePrintabilityChecklist(print).checks.indexOf("Safety review") >= 0, true);
assertEqual(estimatePrintCost(print).approvalRequiredBeforeOrdering, true);
assertEqual(validatePrintPrototype({ productName: "Desk toy", printabilityStatus: "Passed", testingStatus: "Passed" }).productionStatus, "Blocked from production");

assertEqual(scorePrototypeIdea({ projectName: "ATLAS HQ tool", missionScore: 9, accessibilityScore: 5, complexityScore: 3, researchComplete: true, prototypeValidated: true }).finalRecommendation, "Build");
assertEqual(enforcePrototypeFirstRule({ projectName: "Hardware moonshot", status: "Full Production" }).blockedFromFullDevelopment, true);
assertEqual(comparePrototypes([{ projectName: "ATLAS HQ tool", missionScore: 9 }, { projectName: "Experimental entertainment", missionScore: 2 }])[0].itemName, "ATLAS HQ tool");

console.log("All ATLAS Batch 27 tests passed.");

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
}
