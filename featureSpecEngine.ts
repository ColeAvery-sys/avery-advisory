export type FeatureSpec = {
  id: string;
  featureTitle: string;
  product: string;
  problemSolved: string;
  targetUser: string;
  userStory?: string;
  requirements: string[];
  acceptanceCriteria?: string[];
  edgeCases?: string[];
  dependencies?: string[];
  dataNeeded?: string[];
  UIRequirements?: string[];
  backendRequirements?: string[];
  approvalRequirements?: string[];
  priority: string;
  status?: string;
  riskLevel?: "Low" | "Medium" | "High";
};

const featureSpecs: FeatureSpec[] = [];

export function createFeatureSpec(input: FeatureSpec): FeatureSpec {
  const acceptanceCriteria = input.acceptanceCriteria && input.acceptanceCriteria.length ? input.acceptanceCriteria : generateAcceptanceCriteria(input);
  const risk = classifyFeatureRisk(input);
  const vague = input.problemSolved.length < 12 || input.requirements.length === 0;
  const stored = { ...input, acceptanceCriteria, riskLevel: risk.riskLevel, status: vague ? "Needs Review" : input.status || "Spec Draft", approvalRequirements: risk.approvalRequirements };
  featureSpecs.push(stored);
  return stored;
}

export function generateUserStories(feature: FeatureSpec): string[] {
  return [feature.userStory || `As ${feature.targetUser}, I want ${feature.featureTitle} so I can ${feature.problemSolved}.`];
}

export function generateAcceptanceCriteria(feature: FeatureSpec): string[] {
  return feature.requirements.map((requirement, index) => `AC${index + 1}: ${requirement} works and is testable.`).concat(["No sensitive data is exposed.", "Cole approval is required before public/client/funder release."]);
}

export function generateEdgeCases(feature: FeatureSpec): string[] {
  return feature.edgeCases && feature.edgeCases.length ? feature.edgeCases : ["Missing required data", "Permission denied", "Mobile viewport", "Empty state", "Invalid input"];
}

export function classifyFeatureRisk(feature: FeatureSpec) {
  const text = `${feature.featureTitle} ${feature.product} ${feature.problemSolved} ${feature.requirements.join(" ")}`.toLowerCase();
  const flags: string[] = [];
  if (/client|grant|legal|financial|invoice|payment|tax|health|disability|personal|privacy|security/.test(text)) flags.push("Risk review required");
  return { riskLevel: flags.length ? "High" as const : "Low" as const, approvalRequirements: flags.concat(["Cole approval before public/client/funder use"]) };
}

export function convertFeatureToCursorPrompt(feature: FeatureSpec): string {
  return `Build UI for ${feature.product}: ${feature.featureTitle}. Include acceptance criteria, empty states, responsive layout, and safety warnings.`;
}

export function convertFeatureToCodexPrompt(feature: FeatureSpec): string {
  return `Implement backend/test logic for ${feature.product}: ${feature.featureTitle}. Requirements: ${feature.requirements.join("; ")}. Include tests and risk gates.`;
}

export function convertFeatureToTestCases(feature: FeatureSpec) {
  return (feature.acceptanceCriteria || generateAcceptanceCriteria(feature)).map((criteria, index) => ({ id: `${feature.id}-test-${index + 1}`, testName: criteria, product: feature.product, feature: feature.featureTitle, priority: feature.riskLevel === "High" ? "High" : "Medium" }));
}
