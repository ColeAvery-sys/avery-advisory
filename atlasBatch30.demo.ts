import { registerCoreRecord, generateCoreSummary } from "./atlasCoreEngine";
import { createIdentity, getIdentityNetwork, linkIdentityRecord } from "./identityEngine";
import { publishMemoryEvent, routeMemoryEvent } from "./memoryBusEngine";
import { createApprovalRequest, generateApprovalSummary } from "./approvalEngine";
import { createNotification, generateNotificationDigest } from "./notificationEngine";
import { createDepartmentManager, generateManagerReport } from "./departmentManagerEngine";
import { addSearchIndexRecord, globalSearch } from "./globalSearchEngine";
import { createMeshLink, createMeshNode, traceKnowledgePath } from "./knowledgeMeshEngine";
import { generateNetworkAnalyticsReport } from "./networkAnalyticsEngine";
import { generateAtlasOsDashboard } from "./atlasDashboardEngine";

registerCoreRecord({ id: "project-echoframe", type: "Project", projectName: "EchoFrame", brand: "AveryTech", critical: true });
registerCoreRecord({ id: "grant-echoframe", type: "Grant", title: "EchoFrame accessibility grant", critical: true });

const cole = createIdentity({ id: "cole", displayName: "Cole Avery", roles: ["CEO", "Founder", "Approver"] });
linkIdentityRecord(cole.id, { type: "Project", id: "project-echoframe" });

const memory = publishMemoryEvent({
  sourceSystem: "Research Institute",
  recordType: "Pilot Insight",
  title: "Pilot participant feedback supports EchoFrame",
});
routeMemoryEvent(memory.id, ["Grant Manager", "Product Manager", "Knowledge Layer"]);

createApprovalRequest({ action: "Approve pilot expansion and grant-facing claim", projectName: "EchoFrame" });
createNotification({ title: "EchoFrame grant materials waiting", priority: "High" });
const researchManager = createDepartmentManager({ id: "research-manager", managerName: "Research Manager", department: "Research" });

addSearchIndexRecord({ type: "Video", title: "New Prometheus accessibility video", projectName: "EchoFrame" });
createMeshNode({ id: "video", type: "Video", title: "New Prometheus video" });
createMeshNode({ id: "pilot", type: "Pilot", title: "EchoFrame pilot" });
createMeshNode({ id: "grant", type: "Grant", title: "EchoFrame grant" });
createMeshLink({ from: "video", to: "pilot", relationship: "originated interest for" });
createMeshLink({ from: "pilot", to: "grant", relationship: "supports" });

console.log("Batch 30 ATLAS Network OS Snapshot");
console.log({
  core: generateCoreSummary(),
  identity: getIdentityNetwork("cole"),
  approvals: generateApprovalSummary(),
  notifications: generateNotificationDigest(),
  managerReport: generateManagerReport(researchManager.id, { approvals: [{}], blockers: [] }),
  search: globalSearch("EchoFrame"),
  knowledgePath: traceKnowledgePath("pilot", "grant"),
  analytics: generateNetworkAnalyticsReport({ revenue: [{ amount: 1500 }], completedProjects: 8, totalProjects: 10, completedResearchMilestones: 4, totalResearchMilestones: 6 }),
  dashboard: generateAtlasOsDashboard({ revenue: 1500, projects: ["EchoFrame"], approvals: [{ status: "Pending" }], risks: ["grant claim review"], opportunities: ["pilot expansion"] }),
});
