import { createRdGate, detectRdRisks, prototypeFirstStatus } from "./rdSafety";

const experiments: any[] = [];

export function createExperiment(experiment: any) {
  const stored = { ...experiment, id: experiment.id || `experiment-${experiments.length + 1}`, stage: experiment.stage || "Idea", prototypeFirst: prototypeFirstStatus(experiment) };
  experiments.push(stored);
  return stored;
}

export function updateExperimentStage(experimentId: string, stage: string, approval?: any) {
  const experiment = findExperiment(experimentId);
  if (/pilot|validated/i.test(stage) && approval?.approvedBy !== "Cole") {
    experiment.stage = "Needs Cole Approval";
    return experiment;
  }
  experiment.stage = stage;
  experiment.prototypeFirst = prototypeFirstStatus(experiment);
  return experiment;
}

export function generateExperimentPlan(experiment: any) {
  return {
    experimentName: experiment.experimentName || experiment.title,
    question: experiment.question || "What are we trying to learn?",
    stages: ["Idea", "Research", "Prototype", "Pilot", "Validated", "Rejected"],
    nextStep: experiment.stage === "Idea" ? "Research" : "Prototype",
    successCriteria: experiment.successCriteria || ["Clear learning outcome", "Low-cost prototype", "No unsafe claims"],
    ...createRdGate("Experiment plan", detectRdRisks(experiment)),
  };
}

export function validateExperimentForProduct(experimentId: string) {
  const experiment = findExperiment(experimentId);
  const valid = /validated/i.test(experiment.stage || "");
  return { experimentId, canBecomeProduct: valid, reason: valid ? "Validated experiment." : "Prototype First Rule requires validation before product development." };
}

function findExperiment(experimentId: string) {
  const experiment = experiments.find((item) => item.id === experimentId);
  if (!experiment) throw new Error(`Experiment ${experimentId} not found.`);
  return experiment;
}
