import { createRdGate, detectRdRisks, score10 } from "./rdSafety";

const roadmapFeatures: any[] = [];

export function createRoadmapFeature(feature: any) {
  const stored = { ...feature, id: feature.id || `feature-${roadmapFeatures.length + 1}`, roadmapScore: scoreRoadmapFeature(feature), recommendation: recommendFeature(feature) };
  roadmapFeatures.push(stored);
  return stored;
}

export function scoreRoadmapFeature(feature: any) {
  const mission = score10(feature.missionValue);
  const revenue = score10(feature.revenueValue);
  const accessibility = score10(feature.accessibilityValue);
  const complexity = score10(feature.complexity);
  const risk = score10(feature.risk);
  const time = score10(feature.developmentTime);
  const maintenance = score10(feature.maintenanceCost);
  return Math.max(0, Math.min(100, Math.round((mission * 2 + revenue * 1.4 + accessibility * 1.8 - complexity - risk - time * 0.8 - maintenance * 0.8) * 7)));
}

export function recommendFeature(feature: any): "Build Now" | "Build Later" | "Research First" | "Reject" {
  const score = scoreRoadmapFeature(feature);
  if (detectRdRisks(feature).length || score10(feature.risk) >= 8) return "Research First";
  if (score >= 70) return "Build Now";
  if (score >= 45) return "Build Later";
  if (score >= 30) return "Research First";
  return "Reject";
}

export function prioritizeFeatureRoadmap(features: any[]) {
  return features.map(createRoadmapFeature).sort((a, b) => b.roadmapScore - a.roadmapScore);
}

export function generateFeatureDecision(feature: any) {
  return { featureTitle: feature.featureTitle || feature.title, recommendation: recommendFeature(feature), score: scoreRoadmapFeature(feature), ...createRdGate("Feature roadmap decision", detectRdRisks(feature)) };
}
