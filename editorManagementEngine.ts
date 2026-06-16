import { createWorkforceGate, scoreWorkQuality, workloadRisk } from "./workforceSafety";

const editors: any[] = [];

export function createEditorRecord(editor: any) {
  const stored = { ...editor, id: editor.id || `editor-${editors.length + 1}`, qualityIndex: scoreWorkQuality(editor), workloadRisk: workloadRisk(editor) };
  editors.push(stored);
  return stored;
}

export function assignEditorProject(editorId: string, project: any, approval: any) {
  const editor = findEditor(editorId);
  if (approval?.approvedBy !== "Cole" || approval?.approvalStatus !== "Approved") {
    return { editorId, project, assignmentStatus: "Blocked - Cole Approval Required", ...createWorkforceGate("Editor assignment", ["Editor assignment requires Cole approval."]) };
  }
  editor.projects = [...(editor.projects || []), project];
  editor.activeProjects = Number(editor.activeProjects || 0) + 1;
  editor.workloadRisk = workloadRisk(editor);
  return { editorId, project, assignmentStatus: "Assigned With Approval" };
}

export function recordEditorDelivery(editorId: string, delivery: any) {
  const editor = findEditor(editorId);
  editor.deliveries = [...(editor.deliveries || []), delivery];
  editor.averageDeliveryTime = average(editor.deliveries.map((item: any) => Number(item.deliveryDays || 0)));
  editor.revisionCount = (editor.deliveries || []).reduce((sum: number, item: any) => sum + Number(item.revisions || 0), 0);
  return editor;
}

export function calculateEditorMetrics(editorId: string) {
  const editor = findEditor(editorId);
  return {
    editorId,
    averageDeliveryTime: editor.averageDeliveryTime || 0,
    revisionCount: editor.revisionCount || 0,
    qualityScore: editor.qualityScore || 5,
    clientSatisfaction: editor.clientSatisfaction || "Unknown",
    reliability: editor.reliabilityScore || 5,
    workloadRisk: workloadRisk(editor),
  };
}

export function createShadowEditorPlan(editorId: string) {
  const editor = findEditor(editorId);
  return {
    editorId,
    shadowing: editor.editorName || editor.name,
    modules: ["Watch approved project review", "Edit a low-risk practice clip", "Compare against QC checklist", "Receive feedback", "Graduate to supervised task"],
    approvalRequiredBeforeClientWork: true,
  };
}

function average(values: number[]) {
  const filtered = values.filter((value) => value > 0);
  return filtered.length ? Math.round((filtered.reduce((sum, value) => sum + value, 0) / filtered.length) * 10) / 10 : 0;
}

function findEditor(editorId: string) {
  const editor = editors.find((item) => item.id === editorId);
  if (!editor) throw new Error(`Editor ${editorId} not found.`);
  return editor;
}
