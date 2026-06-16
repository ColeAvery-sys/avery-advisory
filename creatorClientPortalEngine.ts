export type ClientPortalProject = {
  id: string;
  clientName: string;
  projectName: string;
  package: string;
  startDate: string;
  dueDate: string;
  projectStatus: string;
  deliverables: string[];
  rawFootageLinks: string[];
  revisionCount: number;
  revisionLimit: number;
  paymentStatus: string;
  nextStep: string;
  deliveryPacketLink?: string;
  approvedDeliveryPacketId?: string;
  notesVisibleToClient?: string;
  contractorNotes?: string;
  profitMargin?: number;
  riskFlags?: string[];
  ColeApprovalStatus?: string;
  internalQualityChecklist?: string[];
  legalFinanceNotes?: string;
};

const portalProjects: ClientPortalProject[] = [];

export function createClientPortalRecord(project: ClientPortalProject): ClientPortalProject {
  portalProjects.push(project);
  return project;
}

export function getClientVisibleProjectStatus(projectId: string) {
  return hideInternalFields(findProject(projectId));
}

export function updateClientVisibleStatus(projectId: string, status: string): ClientPortalProject {
  const project = findProject(projectId);
  project.projectStatus = mapStatus(status);
  return project;
}

export function attachApprovedDeliveryPacket(projectId: string, packetId: string): ClientPortalProject {
  const project = findProject(projectId);
  if (project.ColeApprovalStatus !== "Approved for Delivery") throw new Error("Delivery packet must be approved before client can see it.");
  project.approvedDeliveryPacketId = packetId;
  project.deliveryPacketLink = `approved-packet://${packetId}`;
  return project;
}

export function getClientPortalSummary(projectId: string) {
  const project = findProject(projectId);
  return {
    clientName: project.clientName,
    projectName: project.projectName,
    status: mapStatus(project.projectStatus),
    nextStep: project.nextStep,
    revisionCount: project.revisionCount,
    revisionLimit: project.revisionLimit,
    paymentStatus: project.paymentStatus,
    deliveryPacketVisible: Boolean(project.approvedDeliveryPacketId),
  };
}

export function hideInternalFields(project: ClientPortalProject) {
  return {
    clientName: project.clientName,
    projectName: project.projectName,
    package: project.package,
    startDate: project.startDate,
    dueDate: project.dueDate,
    projectStatus: mapStatus(project.projectStatus),
    deliverables: project.deliverables,
    rawFootageLinks: project.rawFootageLinks,
    revisionCount: project.revisionCount,
    revisionLimit: project.revisionLimit,
    paymentStatus: project.paymentStatus,
    nextStep: project.nextStep,
    deliveryPacketLink: project.approvedDeliveryPacketId ? project.deliveryPacketLink : undefined,
    notesVisibleToClient: project.notesVisibleToClient,
  };
}

export function clearClientPortalForDemo(): void {
  portalProjects.length = 0;
}

function findProject(projectId: string): ClientPortalProject {
  const project = portalProjects.find((item) => item.id === projectId);
  if (!project) throw new Error(`Client portal project ${projectId} not found.`);
  return project;
}

function mapStatus(status: string): string {
  const normalized = status.toLowerCase();
  if (/waiting on footage|intake/.test(normalized)) return "Waiting on Files";
  if (/reviewing/.test(normalized)) return "In Review";
  if (/editing|organizing|clip selection/.test(normalized)) return "In Production";
  if (/quality/.test(normalized)) return "Quality Check";
  if (/cole approval|approved/.test(normalized)) return "Preparing Delivery";
  if (/delivered/.test(normalized)) return "Delivered";
  if (/revision/.test(normalized)) return "Revision Window";
  if (/complete/.test(normalized)) return "Complete";
  return status;
}
