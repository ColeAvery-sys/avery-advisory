import { createResearchGate, detectResearchRisks, evidenceBeforeExpansionStatus } from "./researchInstituteSafety";

const pilots: any[] = [];

export function createPilotProgram(program: any) {
  const stored = { ...program, id: program.id || `pilot-${pilots.length + 1}`, status: program.status || "Planning", evidenceStatus: evidenceBeforeExpansionStatus({ ...program, stage: "Pilot" }) };
  pilots.push(stored);
  return stored;
}

export function addParticipantToPilot(pilotId: string, participantId: string, approval?: any) {
  const pilot = findPilot(pilotId);
  if (approval?.approvedBy !== "Cole") return { pilotId, participantId, status: "Blocked - Cole Approval Required", ...createResearchGate("Pilot participant add", ["Participant enrollment requires consent and approval review."]) };
  pilot.participants = Array.from(new Set([...(pilot.participants || []), participantId]));
  return pilot;
}

export function generatePilotCheckIns(pilotId: string) {
  const pilot = findPilot(pilotId);
  return {
    pilotId,
    checkIns: pilot.checkIns || ["Baseline", "Week 1", "Midpoint", "Completion", "Follow-up"],
    feedbackPrompts: ["What helped?", "What was confusing?", "What should be easier?", "Would you use this again?"],
    noMedicalAdvice: true,
  };
}

export function summarizePilotResults(pilotId: string) {
  const pilot = findPilot(pilotId);
  return {
    pilotId,
    programName: pilot.programName,
    participantCount: (pilot.participants || []).length,
    goals: pilot.goals || [],
    results: pilot.results || "Results not measured yet.",
    claimsAllowed: false,
    ...createResearchGate("Pilot result summary", detectResearchRisks(pilot)),
  };
}

function findPilot(pilotId: string) {
  const pilot = pilots.find((entry) => entry.id === pilotId);
  if (!pilot) throw new Error(`Pilot ${pilotId} not found.`);
  return pilot;
}
