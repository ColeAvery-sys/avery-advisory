export function detectAveryOpsRisk(item: any): string[] {
  const text = JSON.stringify(item || {}).toLowerCase();
  const risks: string[] = [];
  if (/send email|email prospect|contact|dm|message|call|outreach/.test(text)) risks.push("Contacting people requires approval.");
  if (/spend|buy|purchase|payment|invoice|refund|ad budget|subscription/.test(text)) risks.push("Spending money or payment actions require approval.");
  if (/submit|form|application|grant/.test(text)) risks.push("Submitting forms or applications requires approval.");
  if (/publish|post|upload|public/.test(text)) risks.push("Publishing or public actions require approval.");
  if (/hire|fire|contract|compensation/.test(text)) risks.push("Hiring, firing, contract, or compensation actions require approval.");
  return risks;
}

export function createAveryApprovalGate(actionType: string, item: any = {}) {
  const riskFlags = detectAveryOpsRisk({ actionType, item });
  return {
    actionType,
    riskFlags,
    approvalStatus: riskFlags.length ? "Needs Cole Approval" : "Draft",
    safeToAutoExecute: riskFlags.length === 0,
  };
}

export function priorityWeight(priority: string): number {
  if (/critical/i.test(priority || "")) return 100;
  if (/high/i.test(priority || "")) return 75;
  if (/normal|medium/i.test(priority || "")) return 45;
  return 20;
}

export function label(item: any): string {
  return item.title || item.name || item.agentName || item.departmentName || item.projectName || item.clientName || item.id || "Untitled";
}
