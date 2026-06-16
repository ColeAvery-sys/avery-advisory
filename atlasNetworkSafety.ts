export function createNetworkGate(actionType: string, riskFlags: string[] = []) {
  return {
    actionType,
    riskFlags,
    approvalStatus: riskFlags.length ? "Cole Approval Required" : "Draft",
    recommendationOnly: true,
    cannotApproveHighRiskActions: true,
  };
}

export function detectNetworkRisks(item: any): string[] {
  const text = JSON.stringify(item || {}).toLowerCase();
  const risks: string[] = [];
  if (/payment|invoice|refund|price|spend|budget|financial|money/.test(text)) risks.push("Financial action requires Cole approval.");
  if (/legal|contract|lease|terms|compliance/.test(text)) risks.push("Legal/contract action requires Cole approval.");
  if (/hire|fire|discipline|compensation|hr|employee/.test(text)) risks.push("HR action requires Cole approval.");
  if (/publish|post|upload|public|customer-facing|client-facing|send email|message customer/.test(text)) risks.push("Publishing or customer-facing action requires Cole approval.");
  if (/submit grant|grant submission|research claim|clinical|medical/.test(text)) risks.push("Grant/research/medical claim requires Cole approval.");
  return risks;
}

export function singleSourceStatus(record: any) {
  return {
    coreSynced: Boolean(record.coreSynced || record.sourceOfTruth === "ATLAS Core"),
    sourceOfTruth: record.sourceOfTruth || "ATLAS Core",
    rule: "No department should store important information only inside itself. ATLAS Core is the authority.",
  };
}

export function networkLabel(item: any): string {
  return item.title || item.name || item.projectName || item.productName || item.brandName || item.personName || item.departmentName || item.id || "Untitled Network Item";
}

export function priorityWeight(priority: string): number {
  if (/critical/i.test(priority || "")) return 100;
  if (/high/i.test(priority || "")) return 75;
  if (/normal|medium/i.test(priority || "")) return 45;
  return 20;
}
