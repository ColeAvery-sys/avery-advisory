export function detectCrisisTriggers(data: any): string[] {
  const triggers: string[] = [];
  if (data.cashDays !== undefined && data.cashDays < 14) triggers.push("Cash emergency");
  if ((data.clientEmergencies || 0) > 0) triggers.push("Client emergency");
  if ((data.grantDeadlineDays || 999) <= 3) triggers.push("Grant deadline");
  if ((data.overwhelmScore || 0) >= 80) triggers.push("Burnout risk");
  if ((data.missedDeadlines || 0) > 0) triggers.push("Missed deadlines");
  if ((data.technicalFailures || 0) > 0) triggers.push("Technical failure");
  if ((data.legalComplianceIssues || 0) > 0) triggers.push("Legal/compliance issue");
  return triggers;
}

export function activateCrisisMode(data: any) {
  const triggers = detectCrisisTriggers(data);
  return {
    active: triggers.length > 0,
    triggers,
    emergencyPriorities: generateEmergencyPriorities(triggers),
    taskFreeze: triggers.length > 0,
    recoveryPlan: triggers.map((trigger) => `Stabilize: ${trigger}`),
    dailyCheckIns: triggers.length > 0,
    approvalRequired: triggers.some((trigger) => /cash|legal|client/i.test(trigger)),
  };
}

export function generateEmergencyPriorities(triggers: string[]): string[] {
  if (!triggers.length) return ["No crisis mode needed."];
  return ["Stop new work", "Protect client/cash/legal deadlines", "Clear one decision at a time", "Create 24-hour recovery plan"];
}

