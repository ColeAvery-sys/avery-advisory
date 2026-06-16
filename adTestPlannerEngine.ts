export type AdTest = { id: string; campaignName: string; platform: string; offer: string; audience: string; budget: number; duration: string; creativeAsset?: string; headline?: string; copy?: string; CTA?: string; landingPage?: string; successMetric?: string; riskLevel?: string; approvalStatus?: string; spendStatus?: string; results?: Record<string, any> };
const adTests: AdTest[] = [];

export function createAdTest(test: AdTest): AdTest {
  const stored = { ...test, approvalStatus: "Needs Cole Approval", spendStatus: "Not Launched", riskLevel: test.riskLevel || classifyAdRisk(test) };
  adTests.push(stored);
  return stored;
}

export function generateAdCopy(test: AdTest) {
  return { headline: test.headline || `${test.offer} for ${test.audience}`, copy: test.copy || `A practical offer for ${test.audience}. No exaggerated claims.`, CTA: test.CTA || "Learn more", approvalRequired: true };
}

export function generateCreativeBrief(test: AdTest) {
  return { campaignName: test.campaignName, creativeAsset: test.creativeAsset || "Needs asset", direction: "Clear benefit, honest claim, one CTA.", approvalRequired: true };
}

export function generateTargetingIdeas(test: AdTest): string[] {
  return [test.audience, `${test.audience} interested in ${test.offer}`, "remarketing audience if available"];
}

export function generateBudgetRecommendation(test: AdTest) {
  return { recommendedBudget: Math.min(test.budget || 25, 50), approvalRequired: true, warning: "ATLAS cannot spend ad money automatically." };
}

export function sendSpendToApproval(testId: string) {
  const test = findAdTest(testId);
  test.approvalStatus = "Spend Approval Needed";
  return { testId, budget: test.budget, approvalRequired: true };
}

export function markLaunchedManually(testId: string): AdTest {
  const test = findAdTest(testId);
  if (test.approvalStatus !== "Approved") throw new Error("Budget and launch approval required.");
  test.spendStatus = "Launched Manually";
  return test;
}

export function logAdResults(testId: string, results: Record<string, any>): AdTest {
  const test = findAdTest(testId);
  test.results = results;
  return test;
}

function classifyAdRisk(test: AdTest): string {
  return /guarantee|income|medical|funding|cure/i.test(`${test.offer} ${test.copy || ""}`) ? "High" : "Medium";
}

function findAdTest(testId: string): AdTest {
  const test = adTests.find((entry) => entry.id === testId);
  if (!test) throw new Error(`Ad test ${testId} not found.`);
  return test;
}
