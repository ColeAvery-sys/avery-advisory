import { createRdProject, generateRdCommandCenter } from "./rdCommandEngine";
import { generateSoftwareProjectPlan } from "./softwareProjectManager";
import { generateFeatureDecision } from "./featureRoadmapEngine";
import { createRdBugReport, prioritizeRdBugs } from "./bugTrackerEngine";
import { createResearchNote, generateGrantOpportunitiesFromResearch } from "./researchLabEngine";
import { generateExperimentPlan } from "./experimentTrackerEngine";
import { generateGameDesignDoc } from "./godotStudioManager";
import { generateBlenderAssetChecklist } from "./blenderAssetPipeline";
import { estimatePrintCost, generatePrintabilityChecklist } from "./printingPipeline";
import { enforcePrototypeFirstRule, scorePrototypeIdea } from "./prototypeScoringEngine";

const atlasAssist = createRdProject({
  projectName: "ATLAS Assist",
  status: "Prototype",
  researchComplete: true,
  prototypeValidated: true,
  missionScore: 9,
  accessibilityScore: 10,
});

createRdProject({ projectName: "Road to Halvia", status: "Research", projectType: "Godot Game" });

createRdBugReport({
  id: "demo-bug",
  product: "ATLAS Assist",
  bugTitle: "Screen reader labels missing",
  expectedBehavior: "Controls have labels",
  actualBehavior: "Screen reader cannot identify controls",
});

createResearchNote({
  category: "Accessibility",
  title: "Repeat last sentence support",
  finding: "Users may benefit from low-friction auditory recall support.",
  opportunity: "EchoFrame prototype study",
});

console.log("Batch 27 R&D Snapshot");
console.log({
  commandCenter: generateRdCommandCenter(),
  softwarePlan: generateSoftwareProjectPlan({ projectName: "EchoFrame", features: ["repeat last sentence", "privacy mode"], researchComplete: true }),
  featureDecision: generateFeatureDecision({ featureTitle: "ATLAS Assist Low Battery Mode", missionValue: 9, accessibilityValue: 9, complexity: 3, risk: 2 }),
  bugs: prioritizeRdBugs("ATLAS Assist"),
  grants: generateGrantOpportunitiesFromResearch("Accessibility"),
  experiment: generateExperimentPlan({ experimentName: "Smart glasses repeat last sentence", stage: "Idea" }),
  godot: generateGameDesignDoc({ gameTitle: "Road to Halvia", concept: "N64-style prototype route", artNeeded: ["low-poly path"], programmingTasks: ["third-person controller"] }),
  blender: generateBlenderAssetChecklist({ assetName: "EchoFrame Desk Prop", targetUse: "prototype render" }),
  printing: {
    checklist: generatePrintabilityChecklist({ productName: "Accessibility Desk Toy" }),
    cost: estimatePrintCost({ productName: "Accessibility Desk Toy", materialCost: 4, printHours: 3 }),
  },
  prototypeScore: scorePrototypeIdea(atlasAssist),
  prototypeFirst: enforcePrototypeFirstRule({ projectName: "Future hardware", status: "Full Production" }),
});
