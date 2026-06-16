export type Approval = { approvedByCole?: boolean };

export function createConnectorGate(actionType: string, riskWarnings: string[] = []) {
  return {
    connectorStatus: "Staged",
    approvalStatus: "Needs Cole Approval",
    permissionMode: "Local Export Only",
    manualActionOnly: true,
    actionType,
    riskWarnings,
  };
}

export function ensureApproval(approval?: Approval, message = "Cole approval required before connector action."): void {
  if (!approval || approval.approvedByCole !== true) throw new Error(message);
}

export function rightsClear(status?: string): boolean {
  return /clear|approved|owned|commercial/i.test(status || "");
}

export function qaPassed(status?: string): boolean {
  return /passed|ready|approved/i.test(status || "");
}

export function paymentSafe(status?: string): boolean {
  return /paid|verified|confirmed/i.test(status || "");
}

export function detectConnectorRisks(text: string): string[] {
  const value = text.toLowerCase();
  const risks: string[] = [];
  if (/guarantee|guaranteed|viral|income|make money|cure|diagnose|therapy|medical treatment|legal advice|financial advice/.test(value)) risks.push("Forbidden or high-risk claim.");
  if (/disney|marvel|pokemon|nintendo|star wars|harry potter|trademark|copyright/.test(value)) risks.push("Potential copyright/trademark risk.");
  if (/refund|dispute|chargeback|legal|medical|financial/.test(value)) risks.push("Sensitive customer or regulated-topic risk.");
  return risks;
}

export function connectorLog(action: any) {
  return {
    ...action,
    loggedAt: action.loggedAt || new Date(0).toISOString(),
    logged: true,
  };
}

export function requireFields(item: any, fields: string[]): string[] {
  return fields.filter((field) => item[field] === undefined || item[field] === null || item[field] === "");
}

