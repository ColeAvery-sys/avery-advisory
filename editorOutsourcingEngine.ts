export type EditorCandidate = {
  id: string;
  editorName: string;
  contactInfo?: string;
  platformFoundOn?: string;
  portfolioLink?: string;
  editingStyle?: string;
  rate: number;
  availability: number;
  testTaskStatus?: string;
  qualityScore?: number;
  reliabilityScore?: number;
  communicationScore?: number;
  speedScore?: number;
  styleMatch?: number;
  notes?: string;
  approvalStatus?: string;
  status?: string;
};

const editors: EditorCandidate[] = [];

export function createEditorCandidate(candidate: EditorCandidate): EditorCandidate {
  const stored = { ...candidate, status: candidate.status || "Candidate", approvalStatus: "Needs Cole Approval" };
  editors.push(stored);
  return stored;
}

export function scoreEditorCandidate(candidate: EditorCandidate) {
  const rateFit = candidate.rate <= 30 ? 10 : candidate.rate <= 60 ? 7 : 4;
  const score = Math.round(((candidate.qualityScore || 5) * 0.25 + (candidate.communicationScore || 5) * 0.18 + rateFit * 0.15 + (candidate.speedScore || 5) * 0.15 + (candidate.styleMatch || 5) * 0.15 + (candidate.reliabilityScore || 5) * 0.12 + candidate.availability * 0.1) * 10);
  return { score, recommendation: score >= 75 ? "Good test candidate" : score >= 55 ? "Maybe test with small unpaid/approved sample" : "Low priority", approvalRequired: true };
}

export function generateEditorOutreachDraft(candidate: EditorCandidate) {
  return { subject: "Editing test task inquiry", body: `Draft only: Hi ${candidate.editorName}, I am reviewing editors for possible Creator Logistics work. Are you open to a small test task and rate discussion?`, approvalRequired: true, noAutoSend: true };
}

export function generateEditorTestTask(candidate: EditorCandidate) {
  return { title: `Test task for ${candidate.editorName}`, instructions: ["Organize sample footage", "Create 3 clip opportunities", "Return notes and export sample"], paymentNote: "No payment promise without Cole approval.", approvalRequired: true };
}

export function reviewEditorTestSubmission(candidateId: string, review: Record<string, any>) {
  const candidate = findEditor(candidateId);
  candidate.testTaskStatus = "Reviewed";
  candidate.qualityScore = review.qualityScore || candidate.qualityScore;
  candidate.communicationScore = review.communicationScore || candidate.communicationScore;
  candidate.speedScore = review.speedScore || candidate.speedScore;
  candidate.reliabilityScore = review.reliabilityScore || candidate.reliabilityScore;
  return { candidate, score: scoreEditorCandidate(candidate) };
}

export function approveEditorContractor(candidateId: string, approval: { approvedByCole: boolean }) {
  if (!approval.approvedByCole) throw new Error("Cole approval required before approving contractor.");
  const candidate = findEditor(candidateId);
  candidate.status = "Approved Contractor";
  candidate.approvalStatus = "Approved";
  return candidate;
}

export function rejectEditorCandidate(candidateId: string, reason: string) {
  const candidate = findEditor(candidateId);
  candidate.status = "Rejected";
  candidate.notes = `${candidate.notes || ""} Rejected: ${reason}`.trim();
  return candidate;
}

function findEditor(candidateId: string): EditorCandidate {
  const candidate = editors.find((entry) => entry.id === candidateId);
  if (!candidate) throw new Error(`Editor ${candidateId} not found.`);
  return candidate;
}
