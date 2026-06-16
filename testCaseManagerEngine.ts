export type TestCase = {
  id: string;
  testName: string;
  product: string;
  feature: string;
  testType: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  preconditions?: string[];
  steps: string[];
  expectedResult: string;
  actualResult?: string;
  status?: string;
  lastRun?: string;
  passed?: boolean;
  failedReason?: string;
  relatedBug?: string;
};

const tests: TestCase[] = [];

export function createTestCase(test: TestCase): TestCase {
  const stored = { ...test, status: test.status || "Not Run" };
  tests.push(stored);
  return stored;
}

export function generateTestCasesForFeature(feature: Record<string, any>): TestCase[] {
  return (feature.acceptanceCriteria || ["Primary flow works"]).map((criteria: string, index: number) => createTestCase({ id: `${feature.id || "feature"}-tc-${index + 1}`, testName: criteria, product: feature.product, feature: feature.featureTitle, testType: "Workflow", priority: feature.riskLevel === "High" ? "High" : "Medium", steps: ["Open feature", "Complete required action", "Verify result"], expectedResult: criteria }));
}

export function generateRegressionSuite(product: string): TestCase[] {
  const flows = ["command intake to task", "task to agent assignment", "approval flow", "client lead intake", "invoice workflow", "scheduler/autopilot mode restrictions", "safety switch", "local-only mode"];
  return flows.map((flow, index) => createTestCase({ id: `${slug(product)}-reg-${index + 1}`, testName: flow, product, feature: flow, testType: "Regression", priority: "High", steps: ["Run workflow", "Check safety gates", "Check saved output"], expectedResult: `${flow} completes without unsafe external action.` }));
}

export function recordManualTestResult(testId: string, result: { passed: boolean; actualResult?: string; failedReason?: string }): TestCase {
  const test = findTest(testId);
  test.passed = result.passed;
  test.status = result.passed ? "Passed" : "Failed";
  test.actualResult = result.actualResult;
  test.failedReason = result.failedReason;
  test.lastRun = new Date().toISOString();
  return test;
}

export function createBugFromFailedTest(testId: string) {
  const test = findTest(testId);
  if (test.passed !== false) throw new Error("Only failed tests can create bug reports.");
  return { id: `bug-from-${testId}`, bugTitle: `Failed test: ${test.testName}`, product: test.product, severity: test.priority === "Critical" ? "Critical" : "High", expectedBehavior: test.expectedResult, actualBehavior: test.actualResult || test.failedReason || "Test failed", relatedFeature: test.feature };
}

export function getFailingTests(product: string): TestCase[] {
  return tests.filter((test) => test.product === product && test.passed === false);
}

export function getUntestedCriticalFlows(product: string): TestCase[] {
  return tests.filter((test) => test.product === product && test.priority === "Critical" && test.status === "Not Run");
}

export function clearTestsForDemo(): void {
  tests.length = 0;
}

function findTest(testId: string): TestCase {
  const test = tests.find((entry) => entry.id === testId);
  if (!test) throw new Error(`Test ${testId} not found.`);
  return test;
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}
