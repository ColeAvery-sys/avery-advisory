import { createResearchGate, evidenceBeforeExpansionStatus, scoreMissionFit } from "./researchInstituteSafety";

const roadmaps: any[] = [];

export function createAssistiveTechRoadmap(roadmap: any) {
  const stored = { ...roadmap, id: roadmap.id || `assistive-roadmap-${roadmaps.length + 1}`, stage: roadmap.stage || "Research", evidenceStatus: evidenceBeforeExpansionStatus(roadmap), missionFitScore: scoreMissionFit(roadmap) };
  roadmaps.push(stored);
  return stored;
}

export function generateRoadmapStages(roadmapId: string) {
  const roadmap = findRoadmap(roadmapId);
  return {
    roadmapId,
    productName: roadmap.productName,
    stages: ["Research", "Prototype", "Pilot", "Evidence", "Grant Ready", "Scale"],
    currentStage: roadmap.stage,
    evidenceStatus: evidenceBeforeExpansionStatus(roadmap),
  };
}

export function recommendNextRoadmapAction(roadmapId: string) {
  const roadmap = findRoadmap(roadmapId);
  const status = evidenceBeforeExpansionStatus(roadmap);
  if (status.researchRequired) return "Complete research summary.";
  if (status.prototypeRequired) return "Build low-cost prototype.";
  if (status.pilotRequired) return "Recruit approved pilot participants.";
  if (status.outcomeMeasurementRequired) return "Measure observed outcomes.";
  if (status.grantReadinessRequired) return "Prepare grant readiness packet.";
  return "Consider scale only after Cole approval.";
}

export function rankAssistiveTechRoadmaps() {
  return roadmaps.slice().sort((a, b) => b.missionFitScore - a.missionFitScore).map((roadmap) => ({
    productName: roadmap.productName,
    stage: roadmap.stage,
    missionFitScore: roadmap.missionFitScore,
    nextAction: recommendNextRoadmapAction(roadmap.id),
    ...createResearchGate("Assistive technology roadmap recommendation", ["Scale and grant decisions require approval."]),
  }));
}

function findRoadmap(roadmapId: string) {
  const roadmap = roadmaps.find((entry) => entry.id === roadmapId);
  if (!roadmap) throw new Error(`Assistive technology roadmap ${roadmapId} not found.`);
  return roadmap;
}
