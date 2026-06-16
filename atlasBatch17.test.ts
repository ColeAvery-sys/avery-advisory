import { scoreMissionAlignment } from "./missionGuardrailEngine";
import { generateOperationsPlan } from "./operationsCommandEngine";
import { createEditorCandidate, scoreEditorCandidate, generateEditorOutreachDraft, approveEditorContractor } from "./editorOutsourcingEngine";
import { createEditingProject, assignEditorToProject, calculateProjectProfitMargin, markDeliveredManually } from "./editingFulfillmentEngine";
import { createQualityReview, scoreContractorSubmission, sendPaymentToApproval } from "./contractorQualityControlEngine";
import { createCreativeProject, generateCreativeRecommendation } from "./creativeAutomationEngine";
import { createGodotProject, calculatePrototypeReadiness, generateGodotExportChecklist } from "./godotPipelineEngine";
import { createBlenderAsset, routeAssetTo3dPrinterPrep } from "./blenderPipelineEngine";
import { createDavinciProject, generateDavinciProjectPlan, routeToEditingFulfillment } from "./davinciPipelineEngine";
import { createEasyModeDecisionCard, chooseEasyModeOption, getEasyModeDecisionLog } from "./easyModeDecisionEngine";

const cashScore = scoreMissionAlignment({ title: "Creator delivery", description: "paid client delivery", category: "Creator Logistics", fastCashPotential: 9, atlasHqValue: 4, atlasAssistValue: 2, grantFundingValue: 1, salesMarketingValue: 5, clientDeliveryValue: 10, creativeAssetValue: 2, distractionRisk: 2, timeCost: 4, overwhelmCost: 3 });
assertEqual(cashScore.shouldDoNow, true);

const distractionScore = scoreMissionAlignment({ title: "Huge game idea", description: "open world prototype", category: "Creative", fastCashPotential: 0, atlasHqValue: 0, atlasAssistValue: 1, grantFundingValue: 0, salesMarketingValue: 1, clientDeliveryValue: 0, creativeAssetValue: 9, distractionRisk: 9, timeCost: 10, overwhelmCost: 9 });
assertEqual(distractionScore.shouldArchive, true);

const ops = generateOperationsPlan({ overloadRisk: "High", tasks: [{ title: "Paid client delivery", fastCashPotential: 9, clientDeliveryValue: 10, distractionRisk: 2, timeCost: 3, overwhelmCost: 3 }, { title: "Huge game idea", creativeAssetValue: 9, distractionRisk: 9, timeCost: 10, overwhelmCost: 9 }], decisions: [{ title: "Lead scope unclear" }] });
assertEqual(ops.dailyTaskLimit, 3);
assertEqual(ops.distractions.length, 1);

const editor = createEditorCandidate({ id: "editor-1", editorName: "Editor", rate: 25, availability: 8, qualityScore: 8, communicationScore: 8, speedScore: 7, reliabilityScore: 8, styleMatch: 8 });
assertEqual(scoreEditorCandidate(editor).score >= 70, true);
assertEqual(generateEditorOutreachDraft(editor).approvalRequired, true);
assertThrows(() => approveEditorContractor("editor-1", { approvedByCole: false }));
assertEqual(approveEditorContractor("editor-1", { approvedByCole: true }).status, "Approved Contractor");

const project = createEditingProject({ id: "edit-1", clientName: "Client", projectName: "Growth clips", packageSold: "Growth", price: 1200, paymentStatus: "Paid", contractorCost: 350 });
assertEqual(calculateProjectProfitMargin(project).expectedProfit, 850);
assertThrows(() => assignEditorToProject("edit-1", "editor-1", { approvedByCole: false }));
assertEqual(assignEditorToProject("edit-1", "editor-1", { approvedByCole: true }).editorAssigned, "editor-1");
assertThrows(() => markDeliveredManually("edit-1", { approvedByCole: false }));

const review = createQualityReview({ id: "qc-1", contractorName: "Editor", projectName: "Growth clips", technicalQuality: 9, creativeQuality: 8, fileOrganization: 8, clientReadiness: 8, deadlineMet: true, instructionsFollowed: true });
assertEqual(scoreContractorSubmission(review).passed, true);
assertEqual(sendPaymentToApproval("qc-1").approvalRequired, true);

const creative = createCreativeProject({ projectName: "Creator promo animation", projectType: "Blender Animation", salesMarketingValue: 8, creativeAssetValue: 8, distractionRisk: 4, timeCost: 4, overwhelmCost: 3 });
assertEqual(generateCreativeRecommendation(creative).indexOf("Do now") >= 0, true);

const godot = createGodotProject({ gameTitle: "Prototype", concept: "simple demo", mainMechanic: "collect", currentScene: "main", exportTarget: "Windows" });
assertEqual(calculatePrototypeReadiness(godot).demoReady, true);
assertEqual(generateGodotExportChecklist(godot).indexOf("Windows export preset") >= 0, true);

const asset = createBlenderAsset({ id: "asset-1", assetName: "Prototype prop", assetType: "3D printable object", targetUse: "demo", fileFormat: "STL" });
assertEqual(routeAssetTo3dPrinterPrep("asset-1").approvalRequired, true);

const davinci = createDavinciProject({ id: "davinci-1", videoTitle: "Client reel", videoType: "Creator client edit", targetPlatform: "Instagram", sourceAssets: ["clip1"], audioAssets: ["music"] });
assertEqual(generateDavinciProjectPlan(davinci).approvalRequired, true);
assertEqual(routeToEditingFulfillment("davinci-1").approvalRequired, true);

createEasyModeDecisionCard({ id: "easy-1", problemTitle: "Creator lead wants 30 clips in 1 week", problemSummary: "Scope and timeline unclear", department: "Sales", urgency: 8, riskLevel: "High", optionA: { label: "Accept Growth package", description: "Move forward", createsApprovalItem: true }, optionB: { label: "Offer Starter", description: "Reduce scope" }, optionC: { label: "Ask clarifying questions", description: "Reduce risk" }, optionD: { label: "Decline", description: "Avoid risky timeline" }, atlasRecommendation: "C", recommendationReason: "Scope and timeline are unclear." });
const decision = chooseEasyModeOption("easy-1", "C");
assertEqual(decision.resultingAction!.approvalRequired, true);
assertEqual(getEasyModeDecisionLog().length, 1);

console.log("All ATLAS Batch 17 tests passed.");

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
