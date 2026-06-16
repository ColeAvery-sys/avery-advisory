import { createNetworkGate, detectNetworkRisks, singleSourceStatus } from "./atlasNetworkSafety";
import { generateCoreSummary, getCoreRecord, registerCoreRecord, searchCoreRecords, syncCriticalInfoToCore, validateSingleSourceOfTruth } from "./atlasCoreEngine";
import { createIdentity, findIdentitiesByRole, getIdentityNetwork, linkIdentityRecord } from "./identityEngine";
import { generateMemoryBusReport, getMemoryEventsForSystem, publishMemoryEvent, routeMemoryEvent } from "./memoryBusEngine";
import { classifyApproval, createApprovalRequest, generateApprovalSummary, getPendingApprovals, resolveApproval } from "./approvalEngine";
import { createNotification, generateNotificationDigest, markNotificationRead, prioritizeNotifications } from "./notificationEngine";
import { createDepartmentManager, generateManagerReport } from "./departmentManagerEngine";
import { addSearchIndexRecord, generateSearchSummary, globalSearch } from "./globalSearchEngine";
import { createMeshLink, createMeshNode, generateKnowledgeMeshSummary, getMeshNeighbors, traceKnowledgePath } from "./knowledgeMeshEngine";
import { calculateNetworkMetrics, generateNetworkAnalyticsReport, identifyNetworkBottlenecks } from "./networkAnalyticsEngine";
import { generateAtlasOsDashboard, generateHomeScreenCards } from "./atlasDashboardEngine";

assertEqual(createNetworkGate("Publish video", ["approval"]).approvalStatus, "Cole Approval Required");
assertEqual(detectNetworkRisks({ action: "send customer invoice and publish post" }).length >= 2, true);
assertEqual(singleSourceStatus({ sourceOfTruth: "ATLAS Core", coreSynced: true }).coreSynced, true);

const core = registerCoreRecord({ id: "core-1", type: "Project", projectName: "EchoFrame", critical: true });
assertEqual(core.sourceOfTruth, "ATLAS Core");
assertEqual(getCoreRecord("core-1").projectName, "EchoFrame");
assertEqual(searchCoreRecords("EchoFrame").length >= 1, true);
assertEqual(validateSingleSourceOfTruth(core).valid, true);
syncCriticalInfoToCore("Research Institute", { id: "core-2", type: "Research", title: "Pilot feedback" });
assertEqual(generateCoreSummary().totalRecords >= 2, true);

const identity = createIdentity({ id: "person-1", displayName: "Cole Avery", roles: ["CEO", "Approver", "Founder"] });
linkIdentityRecord(identity.id, { type: "Project", id: "core-1" });
assertEqual(getIdentityNetwork("person-1").roles.indexOf("Approver") >= 0, true);
assertEqual(findIdentitiesByRole("CEO")[0].displayName, "Cole Avery");

const event = publishMemoryEvent({ id: "event-1", sourceSystem: "Creator Logistics", recordType: "Client Outcome", title: "Client closed from New Prometheus video" });
assertEqual(routeMemoryEvent(event.id, ["Revenue Engine", "Knowledge Layer"]).length, 2);
assertEqual(getMemoryEventsForSystem("Revenue Engine").length, 1);
assertEqual(generateMemoryBusReport().coreSyncedEvents >= 1, true);

const approval = createApprovalRequest({ id: "approval-1", action: "publish customer-facing grant update" });
assertEqual(approval.decision, "Cole Approval Required");
assertEqual(classifyApproval({ action: "internal department note" }), "Manager Approval Required");
assertEqual(resolveApproval("approval-1", { approvedBy: "Manager", status: "Approved" }).status, "Still Requires Cole Approval");
assertEqual(getPendingApprovals().length >= 1, true);
assertEqual(generateApprovalSummary().coleRequired >= 1, true);

createNotification({ id: "n-1", title: "Grant deadline", priority: "Critical" });
createNotification({ id: "n-2", title: "Low priority note", priority: "Low" });
assertEqual(prioritizeNotifications()[0].title, "Grant deadline");
assertEqual(generateNotificationDigest().critical, 1);
assertEqual(markNotificationRead("n-2").status, "Read");

const manager = createDepartmentManager({ id: "manager-1", managerName: "Research Manager", department: "Research" });
const report = generateManagerReport(manager.id, { approvals: [{}], blockers: [{}] });
assertEqual(report.recommendations[0].indexOf("pilots") >= 0, true);
assertEqual(report.warnings.length >= 2, true);

addSearchIndexRecord({ id: "search-1", type: "Video", title: "EchoFrame explainer" });
assertEqual(globalSearch("EchoFrame").results.length >= 2, true);
assertEqual(generateSearchSummary("EchoFrame").resultCount >= 2, true);

createMeshNode({ id: "video-1", type: "Video", title: "New Prometheus video" });
createMeshNode({ id: "grant-1", type: "Grant", title: "EchoFrame grant" });
createMeshLink({ from: "video-1", to: "grant-1", relationship: "supports" });
assertEqual(traceKnowledgePath("video-1", "grant-1")[1], "supports");
assertEqual(getMeshNeighbors("video-1")[0].id, "grant-1");
assertEqual(generateKnowledgeMeshSummary().nodeCount, 2);

const metrics = calculateNetworkMetrics({ revenue: [{ amount: 1000 }], completedProjects: 7, totalProjects: 10, completedResearchMilestones: 2, totalResearchMilestones: 4, teamUtilization: 91 });
assertEqual(metrics.revenue, 1000);
assertEqual(metrics.projectCompletionRate, 0.7);
assertEqual(generateNetworkAnalyticsReport({ revenue: [{ amount: 1000 }], completedProjects: 7, totalProjects: 10 }).recommendation.indexOf("Scale carefully") >= 0, true);
assertEqual(identifyNetworkBottlenecks({ pendingApprovals: 6, teamUtilization: 95 }).length, 2);

const dashboard = generateAtlasOsDashboard({ revenue: 1000, projects: [{}], approvals: [{ status: "Pending" }], risks: ["cash"], opportunities: ["pilot expansion"] });
assertEqual(dashboard.approvalsWaiting.length, 1);
assertEqual(generateHomeScreenCards({ revenue: 1000, projects: [{}], approvals: [{ status: "Pending" }], risks: ["cash"], opportunities: ["pilot expansion"] }).length, 5);

console.log("All ATLAS Batch 30 tests passed.");

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
}
