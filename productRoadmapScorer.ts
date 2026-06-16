import { clamp, round, scoreFromDays } from "./atlasUtils";

export type ProductIdea = {
  productName: string;
  earlyRevenuePotential: number;
  grantPotential: number;
  buildDifficulty: number;
  personalUsefulness: number;
  longTermValue: number;
  marketClarity: number;
  demoPotential: number;
  timeToMVPDays: number;
};

export type ProductRoadmapScore = {
  roadmapScore: number;
  buildRecommendation: string;
  category: string;
  nextBuildStep: string;
  reason: string;
};

export function scoreProductIdea(product: ProductIdea): ProductRoadmapScore {
  const speedScore = scoreFromDays(product.timeToMVPDays, 7, 120);
  const difficultyPenalty = product.buildDifficulty * 4;
  const northStarBoost = getNorthStarBoost(product.productName);
  const roadmapScore = round(
    clamp(
      product.earlyRevenuePotential * 10 * 0.25 +
        product.grantPotential * 10 * 0.15 +
        product.personalUsefulness * 10 * 0.15 +
        product.longTermValue * 10 * 0.2 +
        product.marketClarity * 10 * 0.15 +
        product.demoPotential * 10 * 0.1 +
        speedScore * 0.1 -
        difficultyPenalty +
        northStarBoost,
      0,
      100,
    ),
  );
  const category = getCategory(product, roadmapScore);

  return {
    roadmapScore,
    buildRecommendation: getBuildRecommendation(category),
    category,
    nextBuildStep: getNextBuildStep(product, category),
    reason: getReason(product, roadmapScore, category),
  };
}

function getNorthStarBoost(name: string): number {
  if (/atlas hq|atlas intake|creator logistics portal|atlas assist/i.test(name)) return 12;
  return 0;
}

function getCategory(product: ProductIdea, score: number): string {
  if (/aphantasia.*vr/i.test(product.productName)) return "Moonshot";
  if (score >= 75 && product.earlyRevenuePotential >= 7) return "Revenue-Ready";
  if (score >= 72) return "Build Now";
  if (product.grantPotential >= 8 && score >= 60) return "Funding-Ready";
  if (product.longTermValue >= 8 && product.buildDifficulty >= 8) return "Moonshot";
  if (score >= 45) return "Research Later";
  return "Pause";
}

function getBuildRecommendation(category: string): string {
  if (category === "Build Now" || category === "Revenue-Ready") return "Scope and build the MVP next.";
  if (category === "Funding-Ready") return "Prepare a grant-aligned demo and project brief.";
  if (category === "Moonshot") return "Preserve the concept but do not let it block immediate cash systems.";
  if (category === "Research Later") return "Validate demand before building.";
  return "Pause until the strategy changes.";
}

function getNextBuildStep(product: ProductIdea, category: string): string {
  if (category === "Moonshot") return "Write a one-page concept and identify the cheapest possible proof of concept.";
  if (category === "Funding-Ready") return "Create a demo outline, grant angle, and required feature list.";
  if (category === "Revenue-Ready") return "Define the paid user, offer, and first sellable workflow.";
  return `Define the smallest useful version of ${product.productName}.`;
}

function getReason(product: ProductIdea, score: number, category: string): string {
  return `${product.productName} scored ${score}/100 and is categorized as ${category} based on revenue, funding, usefulness, long-term value, clarity, demo potential, speed, and difficulty.`;
}
