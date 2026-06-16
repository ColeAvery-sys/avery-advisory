import { createWorkforceGate, detectWorkforceRisks, score10, scoreWorkQuality } from "./workforceSafety";

const applicants: any[] = [];

export function createApplicantRecord(applicant: any) {
  const score = scoreApplicant(applicant);
  const stored = { ...applicant, id: applicant.id || `applicant-${applicants.length + 1}`, stage: applicant.stage || "Applied", candidateScore: score, atlasRecommendation: classifyApplicant(score), riskFlags: detectWorkforceRisks(applicant) };
  applicants.push(stored);
  return stored;
}

export function updateApplicantStage(applicantId: string, stage: string, approval?: any) {
  const applicant = findApplicant(applicantId);
  applicant.stage = stage;
  applicant.approvalStatus = /offer|accepted|hire/i.test(stage) && approval?.approvedBy !== "Cole" ? "Needs Cole Approval" : applicant.approvalStatus || "Draft";
  return applicant;
}

export function scoreApplicant(applicant: any): number {
  const portfolio = score10(applicant.portfolioQuality);
  const skills = score10(applicant.skillFit || applicant.skillsScore);
  const rate = score10(applicant.rateFit);
  const test = score10(applicant.testResults || applicant.testScore);
  return Math.round((portfolio * 0.3 + skills * 0.25 + rate * 0.15 + test * 0.3) * 10);
}

export function classifyApplicant(score: number): "Strong Candidate" | "Potential Candidate" | "Not Recommended" {
  if (score >= 80) return "Strong Candidate";
  if (score >= 55) return "Potential Candidate";
  return "Not Recommended";
}

export function generateApplicantRecommendation(applicantId: string) {
  const applicant = findApplicant(applicantId);
  return { applicantId, recommendation: applicant.atlasRecommendation, score: applicant.candidateScore, ...createWorkforceGate("Applicant recommendation", detectWorkforceRisks(applicant)) };
}

export function archiveApplicant(applicantId: string, reason: string) {
  const applicant = findApplicant(applicantId);
  applicant.stage = "Archived";
  applicant.archiveReason = reason;
  return applicant;
}

function findApplicant(applicantId: string) {
  const applicant = applicants.find((item) => item.id === applicantId);
  if (!applicant) throw new Error(`Applicant ${applicantId} not found.`);
  return applicant;
}
