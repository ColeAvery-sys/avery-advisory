export function createFactoryGate(actionType: string, riskWarnings: string[] = []) {
  return {
    draftStatus: "Draft",
    approvalStatus: "Needs Cole Approval",
    riskWarnings,
    customerFacing: true,
    manualActionOnly: true,
    actionType,
  };
}

export function detectProductRisks(text: string): string[] {
  const value = text.toLowerCase();
  const warnings: string[] = [];
  if (/guarantee|guaranteed|viral|income|make money|funding guaranteed|cure|diagnose|therapy|medical treatment|legal advice|financial advice/.test(value)) {
    warnings.push("Forbidden or high-risk claim needs review.");
  }
  if (/disney|marvel|pokemon|nintendo|star wars|harry potter|trademark|copyright/.test(value)) {
    warnings.push("Potential trademark/copyright risk.");
  }
  if (/client asset|private client|confidential|unknown rights/.test(value)) {
    warnings.push("Asset rights or confidentiality risk.");
  }
  return warnings;
}

export function rightsAreClear(status?: string): boolean {
  return /clear|approved|owned|commercial/i.test(status || "");
}

export function paymentVerified(status?: string): boolean {
  return /verified|paid|confirmed/i.test(status || "");
}

export function ensureColeApproval(approval?: { approvedByCole?: boolean }, message = "Cole approval required."): void {
  if (!approval || approval.approvedByCole !== true) throw new Error(message);
}

export function readinessScore(checks: boolean[]): number {
  if (checks.length === 0) return 0;
  const passed = checks.filter(Boolean).length;
  return Math.round((passed / checks.length) * 100);
}

