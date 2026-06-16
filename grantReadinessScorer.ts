import { clamp, daysUntil, round } from "./atlasUtils";

export type GrantReadinessInput = {
  grantName: string;
  amount: number;
  deadline?: string;
  eligibilityFit: number;
  projectFit: number;
  disabilityAidFit: number;
  requiredDocuments: string[];
  completedDocuments: string[];
  businessStageFit: number;
  locationFit: number;
  timeRequiredHours: number;
};

export type GrantReadinessResult = {
  readinessScore: number;
  probabilityLabel: string;
  missingDocuments: string[];
  strongestAngle: string;
  weakestRisk: string;
  nextThreeSteps: string[];
  applyNow: boolean;
};

export function scoreGrantReadiness(grant: GrantReadinessInput): GrantReadinessResult {
  const missingDocuments = grant.requiredDocuments.filter((doc) => !grant.completedDocuments.includes(doc));
  const docScore = grant.requiredDocuments.length === 0 ? 100 : ((grant.requiredDocuments.length - missingDocuments.length) / grant.requiredDocuments.length) * 100;
  const deadlineDays = daysUntil(grant.deadline);
  const deadlineScore = getDeadlineScore(deadlineDays, grant.timeRequiredHours);
  const fitScore =
    grant.eligibilityFit * 0.25 +
    grant.projectFit * 0.2 +
    grant.disabilityAidFit * 0.2 +
    grant.businessStageFit * 0.15 +
    grant.locationFit * 0.2;
  const readinessScore = round(clamp(fitScore * 10 * 0.65 + docScore * 0.25 + deadlineScore * 0.1, 0, 100));
  const weakestRisk = getWeakestRisk(grant, missingDocuments, deadlineDays);

  return {
    readinessScore,
    probabilityLabel: getProbabilityLabel(readinessScore),
    missingDocuments,
    strongestAngle: getStrongestAngle(grant),
    weakestRisk,
    nextThreeSteps: getNextThreeSteps(missingDocuments, weakestRisk),
    applyNow: readinessScore >= 70 && missingDocuments.length <= 2 && weakestRisk !== "deadline too soon",
  };
}

function getDeadlineScore(days: number | undefined, hours: number): number {
  if (days === undefined) return 60;
  if (days < 0) return 0;
  if (days * 2 < hours) return 25;
  if (days <= 7) return 55;
  if (days <= 30) return 85;
  return 75;
}

function getStrongestAngle(grant: GrantReadinessInput): string {
  const angles = [
    { label: "disability aid", score: grant.disabilityAidFit },
    { label: "accessibility technology", score: (grant.disabilityAidFit + grant.projectFit) / 2 },
    { label: "AI-assisted independent living", score: (grant.disabilityAidFit + grant.projectFit + grant.businessStageFit) / 3 },
    { label: "workforce readiness", score: grant.projectFit },
    { label: "West Virginia small business", score: grant.locationFit },
    { label: "local economic development", score: (grant.locationFit + grant.businessStageFit) / 2 },
  ];

  return angles.sort((a, b) => b.score - a.score)[0].label;
}

function getWeakestRisk(grant: GrantReadinessInput, missingDocuments: string[], deadlineDays?: number): string {
  if (deadlineDays !== undefined && deadlineDays <= 3) return "deadline too soon";
  if (grant.eligibilityFit <= 5) return "unclear eligibility";
  if (missingDocuments.some((doc) => doc.toLowerCase().includes("budget"))) return "missing budget";
  if (missingDocuments.some((doc) => doc.toLowerCase().includes("business plan"))) return "no business plan";
  if (missingDocuments.some((doc) => doc.toLowerCase().includes("prototype"))) return "no prototype";
  return missingDocuments.length > 0 ? "missing documents" : "low risk";
}

function getProbabilityLabel(score: number): string {
  if (score >= 80) return "Strong";
  if (score >= 65) return "Promising";
  if (score >= 45) return "Needs Work";
  return "Weak";
}

function getNextThreeSteps(missingDocuments: string[], weakestRisk: string): string[] {
  const steps = ["Confirm eligibility requirements and submission deadline."];

  if (missingDocuments.length > 0) {
    steps.push(`Prepare missing documents: ${missingDocuments.slice(0, 3).join(", ")}.`);
  } else {
    steps.push("Draft the project narrative around the strongest fit angle.");
  }

  steps.push(weakestRisk === "low risk" ? "Create Cole approval packet before submission." : `Reduce risk: ${weakestRisk}.`);

  return steps.slice(0, 3);
}
