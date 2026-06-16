import { createHqRecord, generateHqCommandCenter } from "./hqCommandEngine";
import { createPropertyRecord, rankProperties } from "./propertyAcquisitionTracker";
import { createFacilityArea, generateFacilityPlan } from "./facilityPlannerEngine";
import { bookStudio, createStudioRecord, generateStudioSchedule } from "./studioManagementEngine";
import { createInventoryAsset, generateInventorySummary } from "./inventoryManagementEngine";
import { createLabProject, summarizeLabPipeline } from "./makerSpaceManager";
import { createEventRecord, generateEventResourcePlan } from "./eventSpaceManager";
import { createVehicleRecord, logVehicleTrip, summarizeLogistics } from "./vehicleLogisticsEngine";
import { generateResponsePlan } from "./emergencyOperationsEngine";
import { createExpansionPlan, generateExpansionRecommendations } from "./expansionPlanningEngine";

createHqRecord({ name: "Future AveryTech HQ", notes: "planning only" });
createPropertyRecord({ propertyName: "Small Office Candidate", address: "Main St", missionFit: 8, affordability: 8, accessibility: 8, expansionPotential: 6, location: 8, infrastructure: 8 });
createFacilityArea({ areaName: "Content Studio", capacity: 3, revenueSupport: 9, missionSupport: 8, expectedUsage: 8, buildCost: 4 });
createStudioRecord({ id: "studio-demo", studioName: "Video Studio", equipment: ["camera", "lights", "microphone"] });
bookStudio("studio-demo", { project: "Creator Logistics promo", hours: 2 });
createInventoryAsset({ name: "Camera", category: "Cameras", location: "Studio", condition: "Good", replacementCost: 800 });
createLabProject({ projectName: "Accessibility desk toy", status: "Concept" });
createEventRecord({ id: "event-demo", eventName: "Accessibility Workshop", attendees: 12, budget: 50 });
createVehicleRecord({ id: "vehicle-demo", vehicleName: "Future Van", mileage: 1000 });
logVehicleTrip("vehicle-demo", { miles: 25, purpose: "equipment transport" });
createExpansionPlan({ planName: "Commercial Building", request: "expand", monthlyRevenue: 0, teamSize: 0, currentCapacityUse: 40 });

console.log("Batch 29 Physical HQ Snapshot");
console.log({
  commandCenter: generateHqCommandCenter({
    equipment: [{ condition: "Good" }],
    studios: [{ studioName: "Video Studio", bookedHours: 2 }],
    makerSpaces: [{ spaceName: "Maker Space", usageHours: 1 }],
    expansionPlans: [{ planName: "Commercial Building", request: "expand", monthlyRevenue: 0, teamSize: 0, currentCapacityUse: 40 }],
  }),
  properties: rankProperties(),
  facilityPlan: generateFacilityPlan(),
  studioSchedule: generateStudioSchedule("studio-demo"),
  inventory: generateInventorySummary(),
  lab: summarizeLabPipeline(),
  event: generateEventResourcePlan("event-demo"),
  logistics: summarizeLogistics(),
  emergency: generateResponsePlan("Internet failure"),
  expansion: generateExpansionRecommendations(),
});
