import { approvalRequired, classifyPriorityTier, label, scoreExecutiveItem } from "./executiveSafety";

export function arbitratePriorities(input: any) {
  const items = [...(input.projects || []), ...(input.tasks || []), ...(input.goals || []), ...(input.opportunities || [])];
  const scored = items.map((item) => ({ ...item, score: scoreExecutiveItem(item), tier: classifyPriorityTier(item).tier, approvalRequired: approvalRequired(item) })).sort((a, b) => b.score - a.score);
  return {
    doNow: scored.filter((item) => item.score >= 85).slice(0, 3),
    doThisWeek: scored.filter((item) => item.score >= 65 && item.score < 85).slice(0, 7),
    scheduleLater: scored.filter((item) => item.score >= 35 && item.score < 65),
    archive: scored.filter((item) => item.score < 35),
    reasoning: scored.map((item) => `${label(item)} scored ${item.score} in tier ${item.tier}.`),
  };
}

export function generatePriorityDecision(item: any) {
  const score = scoreExecutiveItem(item);
  return { title: label(item), score, bucket: score >= 85 ? "Do Now" : score >= 65 ? "Do This Week" : score >= 35 ? "Schedule Later" : "Archive", tier: classifyPriorityTier(item), approvalRequired: approvalRequired(item) };
}

