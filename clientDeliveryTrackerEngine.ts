export type DeliveryTrackerProject = {
  id: string;
  clientName: string;
  projectName: string;
  internalStatus: string;
  paymentStatus: string;
  blockers: string[];
  revisionCount: number;
  dueDate: string;
  coleApprovedDelivery?: boolean;
};

const deliveryProjects: DeliveryTrackerProject[] = [];

export function createDeliveryTracker(project: DeliveryTrackerProject): DeliveryTrackerProject {
  deliveryProjects.push(project);
  return project;
}

export function updateInternalDeliveryStatus(projectId: string, status: string): DeliveryTrackerProject {
  const project = findProject(projectId);
  project.internalStatus = status;
  return project;
}

export function mapInternalStatusToClientStatus(internalStatus: string): string {
  if (/waiting on footage|intake/i.test(internalStatus)) return "Waiting on Files";
  if (/reviewing/i.test(internalStatus)) return "In Review";
  if (/clip|editing|organizing/i.test(internalStatus)) return "In Production";
  if (/quality/i.test(internalStatus)) return "Quality Check";
  if (/cole|approved/i.test(internalStatus)) return "Preparing Delivery";
  if (/delivered/i.test(internalStatus)) return "Delivered";
  if (/revision/i.test(internalStatus)) return "Revision Window";
  if (/complete/i.test(internalStatus)) return "Complete";
  return "In Review";
}

export function getDeliveryRiskFlags(project: DeliveryTrackerProject): string[] {
  const flags = [...project.blockers];
  if (project.paymentStatus !== "Paid") flags.push("unpaid project warning");
  if (project.revisionCount > 3) flags.push("revision count over included limit");
  return flags;
}

export function generateDeliveryProgressSummary(projectId: string) {
  const project = findProject(projectId);
  return { clientStatus: mapInternalStatusToClientStatus(project.internalStatus), internalStatus: project.internalStatus, riskFlags: getDeliveryRiskFlags(project), approvalRequired: true };
}

export function markApprovedForDelivery(projectId: string, approval: { approvedByCole: boolean }): DeliveryTrackerProject {
  if (!approval.approvedByCole) throw new Error("Delivery requires Cole approval.");
  const project = findProject(projectId);
  project.coleApprovedDelivery = true;
  project.internalStatus = "Approved for Delivery";
  return project;
}

export function clearDeliveryTrackersForDemo(): void {
  deliveryProjects.length = 0;
}

function findProject(projectId: string): DeliveryTrackerProject {
  const project = deliveryProjects.find((item) => item.id === projectId);
  if (!project) throw new Error(`Delivery project ${projectId} not found.`);
  return project;
}
