import { createResearchGate, detectResearchRisks } from "./researchInstituteSafety";

const participants: any[] = [];

export function createParticipantRecord(participant: any) {
  const riskFlags = detectResearchRisks(participant);
  if (JSON.stringify(participant).toLowerCase().indexOf("diagnosis") >= 0) riskFlags.push("Diagnosis tracking is not allowed in this local CRM.");
  const stored = { ...participant, id: participant.participantId || participant.id || `participant-${participants.length + 1}`, contactStatus: participant.contactStatus || "New", consentStatus: participant.consentStatus || "Not Collected", riskFlags };
  delete stored.diagnosis;
  delete stored.medicalRecords;
  participants.push(stored);
  return stored;
}

export function updateParticipantConsent(participantId: string, consentStatus: string, approval?: any) {
  const participant = findParticipant(participantId);
  participant.consentStatus = consentStatus;
  participant.approvalStatus = /approved|active/i.test(consentStatus) && approval?.approvedBy !== "Cole" ? "Needs Cole Approval" : "Draft";
  return participant;
}

export function matchParticipantsToPilot(interestArea: string) {
  return participants.filter((participant) => (participant.interestAreas || []).indexOf(interestArea) >= 0 && /approved|active/i.test(participant.consentStatus || "")).map((participant) => ({
    participantId: participant.id,
    displayName: participant.displayName,
    contactRequiresApproval: true,
  }));
}

export function generateParticipantSummary() {
  return {
    totalParticipants: participants.length,
    consented: participants.filter((participant) => /approved|active/i.test(participant.consentStatus || "")).length,
    interestAreas: Array.from(new Set(participants.reduce((areas: string[], participant: any) => areas.concat(participant.interestAreas || []), []))),
    ...createResearchGate("Participant CRM summary", ["Participant contact and consent processes require review."]),
  };
}

function findParticipant(participantId: string) {
  const participant = participants.find((entry) => entry.id === participantId);
  if (!participant) throw new Error(`Participant ${participantId} not found.`);
  return participant;
}
