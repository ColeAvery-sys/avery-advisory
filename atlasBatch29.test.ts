import { createHqGate, detectHqRisks, hqBeforeEmpireStatus, scorePropertyFit } from "./physicalHqSafety";
import { createHqRecord, generateHqCommandCenter } from "./hqCommandEngine";
import { createPropertyRecord, generatePropertyDueDiligence, rankProperties, scoreProperty } from "./propertyAcquisitionTracker";
import { createFacilityArea, generateAreaChecklist, generateFacilityPlan } from "./facilityPlannerEngine";
import { bookStudio, createStudioRecord, generateStudioMaintenancePlan, generateStudioSchedule } from "./studioManagementEngine";
import { assignAsset, createInventoryAsset, generateAssetReplacementPlan, generateInventorySummary, updateAssetLocation } from "./inventoryManagementEngine";
import { createLabProject, generateLabSafetyChecklist, summarizeLabPipeline, updateLabProjectStage } from "./makerSpaceManager";
import { createEventRecord, generateEventResourcePlan, logEventFeedback, summarizeEventFeedback } from "./eventSpaceManager";
import { createVehicleRecord, generateVehicleMaintenancePlan, logVehicleTrip, summarizeLogistics } from "./vehicleLogisticsEngine";
import { createEmergencyPlan, generateRecoveryPlan, generateResponsePlan, listEmergencyContacts } from "./emergencyOperationsEngine";
import { createExpansionPlan, evaluateExpansionReadiness, generateCapacityReport, generateExpansionRecommendations } from "./expansionPlanningEngine";

assertEqual(createHqGate("Buy property", ["approval"]).approvalStatus, "Needs Cole Approval");
assertEqual(detectHqRisks({ action: "sign lease and spend deposit" }).length >= 2, true);
assertEqual(hqBeforeEmpireStatus({ request: "new hq", monthlyRevenue: 0, teamSize: 0, currentCapacityUse: 20 }).blockedFromExpansion, true);
assertEqual(scorePropertyFit({ missionFit: 9, affordability: 9, accessibility: 8, expansionPotential: 7, location: 8, infrastructure: 8 }) >= 80, true);

createHqRecord({ id: "hq-risk", name: "Lease idea", notes: "sign lease" });
const command = generateHqCommandCenter({
  equipment: [{ condition: "Good" }],
  events: [{ eventName: "Accessibility meetup" }],
  studios: [{ studioName: "Video Studio", bookedHours: 3 }],
  makerSpaces: [{ spaceName: "3D Lab", usageHours: 2 }],
  expansionPlans: [{ planName: "Bigger HQ", request: "expand", monthlyRevenue: 0, teamSize: 0, currentCapacityUse: 20 }],
});
assertEqual(command.expansionNeeds[0], "Bigger HQ");
assertEqual(command.approvalStatus, "Needs Cole Approval");

const property = createPropertyRecord({ id: "property-1", propertyName: "Small Office", address: "Main St", missionFit: 8, affordability: 8, accessibility: 8, expansionPotential: 6, location: 8, infrastructure: 8 });
assertEqual(scoreProperty(property) >= 70, true);
assertEqual(rankProperties()[0].propertyName, "Small Office");
assertEqual(generatePropertyDueDiligence("property-1").approvalStatus, "Needs Cole Approval");

createFacilityArea({ id: "area-1", areaName: "Content Studio", capacity: 3, revenueSupport: 9, missionSupport: 8, expectedUsage: 8, buildCost: 4, equipmentNeeded: ["camera", "lights"] });
assertEqual(generateFacilityPlan()[0].areaName, "Content Studio");
assertEqual(generateAreaChecklist("area-1").checklist.indexOf("Accessibility") >= 0, true);

createStudioRecord({ id: "studio-1", studioName: "Video Studio", equipment: ["camera", "microphone"] });
bookStudio("studio-1", { project: "Creator Logistics promo", hours: 2 });
assertEqual(generateStudioSchedule("studio-1").bookings.length, 1);
assertEqual(generateStudioMaintenancePlan("studio-1").checklist.indexOf("Audio test") >= 0, true);

createInventoryAsset({ assetId: "asset-1", name: "Camera", category: "Cameras", location: "Studio", condition: "Needs repair", replacementCost: 800 });
updateAssetLocation("asset-1", "Content Studio");
assignAsset("asset-1", "Cole");
assertEqual(generateInventorySummary().needsRepair[0], "Camera");
assertEqual(generateAssetReplacementPlan()[0].approvalRequiredBeforePurchase, true);

createLabProject({ id: "lab-1", projectName: "Accessibility desk toy", status: "Concept" });
assertEqual(updateLabProjectStage("lab-1", "Testing").status, "Needs Cole Approval");
assertEqual(generateLabSafetyChecklist("lab-1").approvalStatus, "Needs Cole Approval");
assertEqual(summarizeLabPipeline().totalProjects, 1);

createEventRecord({ id: "event-1", eventName: "Accessibility Workshop", attendees: 12, budget: 50 });
assertEqual(generateEventResourcePlan("event-1").approvalStatus, "Needs Cole Approval");
logEventFeedback("event-1", { theme: "Useful" });
assertEqual(summarizeEventFeedback("event-1").feedbackCount, 1);

createVehicleRecord({ id: "vehicle-1", vehicleName: "Future Van", mileage: 1000 });
logVehicleTrip("vehicle-1", { miles: 25, purpose: "equipment transport" });
assertEqual(generateVehicleMaintenancePlan("vehicle-1").checklist.indexOf("Emergency kit") >= 0, true);
assertEqual(summarizeLogistics().totalMiles, 25);

const emergency = createEmergencyPlan({ id: "emergency-1", emergencyType: "Internet failure", contacts: ["Cole", "ISP"] });
assertEqual(listEmergencyContacts(emergency.id).length, 2);
assertEqual(generateRecoveryPlan("emergency-1").approvalRequiredForSpending, true);
assertEqual(generateResponsePlan("Power failure").approvalStatus, "Needs Cole Approval");

createExpansionPlan({ id: "expansion-1", planName: "Commercial Building", request: "expand", monthlyRevenue: 0, teamSize: 0, currentCapacityUse: 40 });
assertEqual(evaluateExpansionReadiness({ planName: "Commercial Building", request: "expand", monthlyRevenue: 0, teamSize: 0, currentCapacityUse: 40 }).ready, false);
assertEqual(generateExpansionRecommendations()[0].hqBeforeEmpire.blockedFromExpansion, true);
assertEqual(generateCapacityReport({ currentCapacityUse: 85 }).recommendation.indexOf("Capacity pressure") >= 0, true);

console.log("All ATLAS Batch 29 tests passed.");

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
}
