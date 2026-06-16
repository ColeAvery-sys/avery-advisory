const assert = require("assert").strict;
const { exampleAtlasItems, scoreAtlasItem } = require("./scoreAtlasItem");

const priorities = new Set(["Critical", "High", "Medium", "Low"]);

assert.equal(exampleAtlasItems.length, 10);

for (const item of exampleAtlasItems) {
  const result = scoreAtlasItem(item);

  assert.equal(typeof result.score, "number", `${item.title} should return a number score`);
  assert.ok(result.score >= 0 && result.score <= 100, `${item.title} score should be 0-100`);
  assert.ok(priorities.has(result.priority), `${item.title} should return a valid priority`);
  assert.equal(typeof result.department, "string", `${item.title} should return a department`);
  assert.equal(typeof result.nextAction, "string", `${item.title} should return a next action`);
  assert.ok(Array.isArray(result.reasoning), `${item.title} should return reasoning lines`);
  assert.ok(result.reasoning.length >= 2, `${item.title} should include useful reasoning`);
}

assert.deepEqual(scoreAtlasItem(exampleAtlasItems[0]), {
  score: 77,
  priority: "High",
  department: "Operations",
  nextAction: "Create a one-page plan with scope, timeline, blockers, and first milestone.",
  reasoning: [
    "Weighted score is 77/100, which maps to High priority.",
    "Build difficulty subtracts 3 points, keeping friction visible without overpowering upside.",
    "Strongest signals: early profit, turnaround speed, longevity, urgency, personal importance.",
    "Fast turnaround plus strong early profit makes this useful for near-term momentum.",
  ],
});

assert.throws(
  () =>
    scoreAtlasItem({
      title: "Invalid",
      description: "Out of range number.",
      earlyProfit: 11,
      turnaroundSpeed: 5,
      longevity: 5,
      fundingPotential: 5,
      buildDifficulty: 5,
      urgency: 5,
      personalImportance: 5,
    }),
  /earlyProfit must be an integer from 1 to 10/,
);

console.log("All scoreAtlasItem tests passed.");
