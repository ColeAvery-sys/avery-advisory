import { scoreMissionAlignment } from "./missionGuardrailEngine";
import { generateOperationsPlan } from "./operationsCommandEngine";
import { createEditorCandidate, scoreEditorCandidate, generateEditorOutreachDraft } from "./editorOutsourcingEngine";
import { createEditingProject, calculateProjectProfitMargin, generateEditorTaskPacket } from "./editingFulfillmentEngine";
import { createQualityReview, generateQualityChecklist } from "./contractorQualityControlEngine";
import { createCreativeProject, generateCreativeBuildPlan, generateCreativeRecommendation } from "./creativeAutomationEngine";
import { createGodotProject, generateGameDesignBrief, generateGodotExportChecklist } from "./godotPipelineEngine";
import { createBlenderAsset, generateExportChecklist, generatePrintabilityChecklist } from "./blenderPipelineEngine";
import { createDavinciProject, generateDavinciProjectPlan, generateVideoQcChecklist } from "./davinciPipelineEngine";
import { createEasyModeDecisionCard, chooseEasyModeOption, getEasyModeDecisionLog } from "./easyModeDecisionEngine";

console.log("Mission Guardrail");
console.log(scoreMissionAlignment({ title: "Creator delivery", description: "paid client delivery", category: "Creator Logistics", fastCashPotential: 9, atlasHqValue: 4, atlasAssistValue: 2, grantFundingValue: 1, salesMarketingValue: 5, clientDeliveryValue: 10, creativeAssetValue: 2, distractionRisk: 2, timeCost: 4, overwhelmCost: 3 }));

console.log("\nOperations Plan");
console.log(generateOperationsPlan({ overloadRisk: "High", tasks: [{ title: "Paid client delivery", fastCashPotential: 9, clientDeliveryValue: 10, distractionRisk: 2, timeCost: 3, overwhelmCost: 3 }, { title: "Huge game idea", creativeAssetValue: 9, distractionRisk: 9, timeCost: 10, overwhelmCost: 9 }], decisions: [{ title: "Lead scope unclear" }] }));

console.log("\nEditor Outsourcing");
const editor = createEditorCandidate({ id: "editor-demo", editorName: "Editor Demo", rate: 25, availability: 8, qualityScore: 8, communicationScore: 8, speedScore: 7, reliabilityScore: 8, styleMatch: 8 });
console.log(scoreEditorCandidate(editor));
console.log(generateEditorOutreachDraft(editor));

console.log("\nEditing Fulfillment");
const project = createEditingProject({ id: "edit-demo", clientName: "Client", projectName: "Growth clips", packageSold: "Growth", price: 1200, paymentStatus: "Paid", contractorCost: 350 });
console.log(calculateProjectProfitMargin(project));
console.log(generateEditorTaskPacket(project));

console.log("\nContractor QC");
const review = createQualityReview({ id: "qc-demo", contractorName: "Editor", projectName: "Growth clips", technicalQuality: 9, creativeQuality: 8, fileOrganization: 8, clientReadiness: 8 });
console.log(review);
console.log(generateQualityChecklist(project));

console.log("\nCreative Automation");
const creative = createCreativeProject({ projectName: "Creator promo animation", projectType: "Blender Animation", salesMarketingValue: 8, creativeAssetValue: 8, distractionRisk: 4, timeCost: 4, overwhelmCost: 3 });
console.log(generateCreativeBuildPlan(creative));
console.log(generateCreativeRecommendation(creative));

console.log("\nGodot Pipeline");
const godot = createGodotProject({ gameTitle: "Prototype", concept: "simple demo", mainMechanic: "collect", currentScene: "main", exportTarget: "Windows" });
console.log(generateGameDesignBrief(godot));
console.log(generateGodotExportChecklist(godot));

console.log("\nBlender Pipeline");
const asset = createBlenderAsset({ id: "asset-demo", assetName: "Prototype prop", assetType: "3D printable object", targetUse: "demo", fileFormat: "STL" });
console.log(generateExportChecklist(asset));
console.log(generatePrintabilityChecklist(asset));

console.log("\nDaVinci Pipeline");
const video = createDavinciProject({ id: "davinci-demo", videoTitle: "Client reel", videoType: "Creator client edit", targetPlatform: "Instagram", sourceAssets: ["clip1"], audioAssets: ["music"] });
console.log(generateDavinciProjectPlan(video));
console.log(generateVideoQcChecklist(video));

console.log("\nEasy Mode");
createEasyModeDecisionCard({ id: "easy-demo", problemTitle: "Creator lead wants 30 clips in 1 week", problemSummary: "Scope and timeline unclear", department: "Sales", urgency: 8, riskLevel: "High", optionA: { label: "Accept Growth package", description: "Move forward", createsApprovalItem: true }, optionB: { label: "Offer Starter", description: "Reduce scope" }, optionC: { label: "Ask clarifying questions", description: "Reduce risk" }, optionD: { label: "Decline", description: "Avoid risky timeline" }, atlasRecommendation: "C", recommendationReason: "Scope and timeline are unclear." });
console.log(chooseEasyModeOption("easy-demo", "C"));
console.log(getEasyModeDecisionLog());
