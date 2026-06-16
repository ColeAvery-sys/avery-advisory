export type IntegrationTestRecord = {
  id: string;
  integrationName: string;
  testName: string;
  dryRunOnly: boolean;
  expectedOutcome: string;
  resultStatus: "Not Run" | "Passed" | "Failed";
  resultNotes?: string;
  createdAt: string;
  updatedAt: string;
};

const tests: IntegrationTestRecord[] = [];

export function createIntegrationTest(input: Omit<IntegrationTestRecord, "resultStatus" | "createdAt" | "updatedAt">): IntegrationTestRecord {
  const now = new Date().toISOString();
  const record: IntegrationTestRecord = { ...input, dryRunOnly: true, resultStatus: "Not Run", createdAt: now, updatedAt: now };
  tests.push(record);
  return record;
}

export function runDryIntegrationTest(id: string): IntegrationTestRecord {
  const test = findTest(id);
  test.resultStatus = test.dryRunOnly ? "Passed" : "Failed";
  test.resultNotes = test.dryRunOnly ? `Dry run passed: ${test.expectedOutcome}` : "Live tests are not allowed in Batch 5.";
  test.updatedAt = new Date().toISOString();
  return test;
}

export function getIntegrationTestResults(): IntegrationTestRecord[] {
  return [...tests];
}

export function clearIntegrationTestConsoleForDemo(): void {
  tests.length = 0;
}

function findTest(id: string): IntegrationTestRecord {
  const test = tests.find((item) => item.id === id);
  if (!test) throw new Error(`Integration test ${id} not found.`);
  return test;
}
