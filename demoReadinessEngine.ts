export type DemoPlan = { id: string; demoName: string; targetAudience: string; product: string; demoGoal: string; demoFlow: string[]; talkingPoints?: string[]; screenshotsNeeded?: string[]; sampleDataNeeded?: string[]; risksToAvoid?: string[]; liveDemoRisk?: string; backupPlan?: string; readinessScore?: number; approvalStatus?: string };
const demos: DemoPlan[] = [];

export function createDemoPlan(demo: DemoPlan): DemoPlan {
  const stored = { ...demo, approvalStatus: demo.approvalStatus || "Needs Cole Approval", readinessScore: demo.readinessScore || 0 };
  demos.push(stored);
  return stored;
}

export function calculateDemoReadiness(demo: DemoPlan, productData: Record<string, any>) {
  let score = 100;
  if (!demo.demoFlow.length) score -= 25;
  if ((demo.screenshotsNeeded || []).length) score -= 10;
  if ((demo.sampleDataNeeded || []).length) score -= 15;
  if (demo.liveDemoRisk) score -= 15;
  if ((productData.bugs || []).some((bug: any) => /Critical|High/.test(bug.severity || ""))) score -= 30;
  const readinessScore = Math.max(0, score);
  return { demoName: demo.demoName, readinessScore, approvalRequired: true, risks: demo.risksToAvoid || [], warning: "Use safe sample data only. Demo claims must match actual product state." };
}

export function generateDemoScript(demo: DemoPlan): string[] {
  return [`Open with ${demo.demoGoal}`, ...demo.demoFlow.map((step) => `Show: ${step}`), "Close with current status, known limits, and next step."];
}

export function generateDemoChecklist(demo: DemoPlan): string[] {
  return ["Cole approval", "No sensitive data", "Sample data ready", "Backup plan ready", "Known risks stated"].concat(demo.screenshotsNeeded || []);
}

export function generateSampleDataPlan(demo: DemoPlan) {
  return { demoName: demo.demoName, sampleData: demo.sampleDataNeeded || ["safe demo client", "safe demo grant", "safe demo task"], warning: "Do not use real private client, grant, health, legal, or finance data." };
}

export function generateBackupPlan(demo: DemoPlan): string {
  return demo.backupPlan || "Use screenshots or recorded walkthrough if live demo fails.";
}
