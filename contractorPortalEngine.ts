export type ContractorTask = {
  id: string;
  contractorName: string;
  role: string;
  taskTitle: string;
  projectName: string;
  clientName: string;
  instructions: string;
  fileLinks: string[];
  deliverables: string[];
  deadline: string;
  status: string;
  submissionLink?: string;
  qualityChecklist: string[];
  revisionNotes?: string;
  confidentialClientNotes?: string;
  companyFinancials?: string;
  paymentStatusVisible?: boolean;
  paymentStatus?: string;
  coleApprovedAssignment?: boolean;
};

const contractorTasks: ContractorTask[] = [];

export function createContractorPortalTask(task: ContractorTask): ContractorTask {
  if (!task.coleApprovedAssignment) throw new Error("Assigning contractor requires Cole approval.");
  contractorTasks.push(task);
  return task;
}

export function getContractorVisibleTask(taskId: string) {
  return hideRestrictedContractorFields(findTask(taskId));
}

export function submitContractorWork(taskId: string, submission: { submissionLink: string; notes?: string }) {
  const task = findTask(taskId);
  task.submissionLink = submission.submissionLink;
  task.status = "Submitted for Quality Review";
  return { task, qualityReviewTask: { title: `Quality review: ${task.taskTitle}`, relatedTask: task.id, notes: submission.notes } };
}

export function updateContractorTaskStatus(taskId: string, status: string): ContractorTask {
  const task = findTask(taskId);
  task.status = status;
  return task;
}

export function generateContractorQualityChecklist(task: ContractorTask): string[] {
  return ["Match instructions", "Check deliverables", "Check file links", "Confirm no confidential notes are exposed", ...task.qualityChecklist];
}

export function hideRestrictedContractorFields(task: ContractorTask) {
  return {
    contractorName: task.contractorName,
    role: task.role,
    taskTitle: task.taskTitle,
    projectName: task.projectName,
    clientName: task.clientName,
    instructions: task.instructions,
    fileLinks: task.fileLinks,
    deliverables: task.deliverables,
    deadline: task.deadline,
    status: task.status,
    submissionLink: task.submissionLink,
    qualityChecklist: task.qualityChecklist,
    revisionNotes: task.revisionNotes,
    paymentStatus: task.paymentStatusVisible ? task.paymentStatus : undefined,
  };
}

export function clearContractorPortalForDemo(): void {
  contractorTasks.length = 0;
}

function findTask(taskId: string): ContractorTask {
  const task = contractorTasks.find((item) => item.id === taskId);
  if (!task) throw new Error(`Contractor task ${taskId} not found.`);
  return task;
}
