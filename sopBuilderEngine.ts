import { confidenceFromEvidence, createIntelligenceGate } from "./companyIntelligenceSafety";

const sops: any[] = [];

export function createSopDraft(input: any) {
  const stored = { ...input, ...createIntelligenceGate("SOP draft", confidenceFromEvidence((input.sourceProjects || []).length)), status: "Draft" };
  sops.push(stored);
  return stored;
}

export function buildSopFromSuccessfulProjects(projects: any[], sopName: string) {
  const successful = projects.filter((project) => /success|complete|profitable|won/i.test(project.outcome || project.status || ""));
  return createSopDraft({
    id: `sop-${sops.length + 1}`,
    sopName,
    sourceProjects: successful.map((project) => project.id || project.projectName),
    steps: inferSteps(successful),
    checklists: ["Required files", "Quality standards", "Approval gates", "Delivery notes"],
    warnings: inferWarnings(projects),
    qualityStandards: ["clear scope", "timely communication", "rights checked", "final approval before delivery"],
  });
}

export function generateSopFromRepeatedProcess(processData: any) {
  return buildSopFromSuccessfulProjects(processData.projects || processData.examples || [], processData.sopName || processData.processName || "Company SOP Draft");
}

export function attachSopToWorkflow(sopId: string, workflowId: string) {
  const sop = findSop(sopId);
  sop.attachedWorkflows = Array.from(new Set([...(sop.attachedWorkflows || []), workflowId]));
  return sop;
}

export function attachLessonToSop(sopId: string, lesson: any) {
  const sop = findSop(sopId);
  sop.lessons = Array.from(new Set([...(sop.lessons || []), lesson.id || lesson.lessonId || lesson.lessonTitle || lesson]));
  return sop;
}

export function generateSopChecklist(sopId: string) {
  const sop = findSop(sopId);
  return [...(sop.steps || []), ...(sop.checklists || [])];
}

export function markSopApproved(sopId: string, approval: any) {
  const sop = findSop(sopId);
  if (!approval || approval.approvedBy !== "Cole" || approval.approvalStatus !== "Approved") {
    sop.status = "Needs Cole Approval";
    return sop;
  }
  sop.status = "Approved";
  sop.approvedBy = "Cole";
  sop.approvedAt = approval.approvedAt || new Date(0).toISOString();
  return sop;
}

function inferSteps(projects: any[]) {
  return projects.length ? ["Intake", "Scope review", "Asset collection", "Production", "QC", "Approval", "Delivery"] : ["Collect more successful examples before finalizing SOP"];
}

function inferWarnings(projects: any[]) {
  return projects.filter((project) => /late|complaint|missing|blocked/i.test(project.notes || "")).map((project) => project.notes);
}

function findSop(sopId: string) {
  const sop = sops.find((entry) => entry.id === sopId || entry.sopId === sopId);
  if (!sop) throw new Error(`SOP ${sopId} not found.`);
  return sop;
}
