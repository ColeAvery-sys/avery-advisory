export type EditingProject = {
  id: string;
  clientName: string;
  projectName: string;
  packageSold: string;
  price: number;
  deadline?: string;
  rawFootageLinks?: string[];
  editorAssigned?: string;
  internalStatus?: string;
  clientVisibleStatus?: string;
  paymentStatus: string;
  contractorCost?: number;
  expectedProfit?: number;
  revisionCount?: number;
  ColeApprovalStatus?: string;
  deliveryPacketLink?: string;
};

const projects: EditingProject[] = [];

export function createEditingProject(project: EditingProject): EditingProject {
  const stored = { ...project, revisionCount: project.revisionCount || 0, internalStatus: project.internalStatus || "Client Approved", clientVisibleStatus: project.clientVisibleStatus || "In Review" };
  stored.expectedProfit = calculateProjectProfitMargin(stored).expectedProfit;
  projects.push(stored);
  return stored;
}

export function generateEditorTaskPacket(project: EditingProject) {
  return { projectName: project.projectName, instructions: ["Review raw footage", "Follow client package scope", "Organize files", "Submit draft for QC"], rawFootageLinks: project.rawFootageLinks || [], approvalRequired: true };
}

export function assignEditorToProject(projectId: string, editorId: string, approval: { approvedByCole: boolean }) {
  if (!approval.approvedByCole) throw new Error("Cole approval required before editor assignment.");
  const project = findProject(projectId);
  if (!/verified|paid/i.test(project.paymentStatus)) throw new Error("Payment should be verified before paid editor work begins.");
  project.editorAssigned = editorId;
  project.internalStatus = "Editor Assigned";
  return project;
}

export function calculateProjectProfitMargin(project: EditingProject) {
  const expectedProfit = project.price - (project.contractorCost || 0);
  return { expectedProfit, marginPercent: project.price ? Math.round((expectedProfit / project.price) * 100) : 0, warning: expectedProfit < project.price * 0.4 ? "Margin may be too low." : "Margin looks workable." };
}

export function generateClientDeliveryPacket(project: EditingProject) {
  return { clientName: project.clientName, projectName: project.projectName, deliverables: project.deliveryPacketLink || "Delivery packet draft", approvalRequired: true, warning: "Client delivery requires Cole approval." };
}

export function generateRevisionResponse(project: EditingProject, revision: Record<string, any>) {
  const overLimit = (project.revisionCount || 0) >= 3;
  return { body: `Draft only: We received the revision request for ${revision.item || project.projectName}.`, overLimit, approvalRequired: overLimit || true };
}

export function markDeliveredManually(projectId: string, approval: { approvedByCole: boolean }) {
  if (!approval.approvedByCole) throw new Error("Cole approval required before client delivery.");
  const project = findProject(projectId);
  project.internalStatus = "Delivered Manually";
  project.clientVisibleStatus = "Delivered";
  return project;
}

function findProject(projectId: string): EditingProject {
  const project = projects.find((entry) => entry.id === projectId);
  if (!project) throw new Error(`Editing project ${projectId} not found.`);
  return project;
}
