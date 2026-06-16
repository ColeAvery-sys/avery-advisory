export type Approval = { approvedByCole?: boolean };

export function createStudioGate(actionType: string, riskFlags: string[] = []) {
  return {
    status: "Draft",
    approvalStatus: "Needs Cole Approval",
    riskFlags,
    manualActionOnly: true,
    actionType,
  };
}

export function detectContentRisks(text: string): string[] {
  const value = text.toLowerCase();
  const risks: string[] = [];
  if (/guarantee|guaranteed|cure|diagnose|therapy|medical treatment|legal advice|financial advice|make money|income|funding guaranteed|viral/.test(value)) risks.push("Unsupported or prohibited claim.");
  if (/politic|leftist|capitalism|legal|financial|health|medical|disability|client|sponsor|affiliate|grant/.test(value)) risks.push("Claims or sensitive topic require review.");
  if (/disney|marvel|pokemon|nintendo|star wars|harry potter|copyright|trademark/.test(value)) risks.push("Potential copyright/trademark risk.");
  if (/internal|private|confidential|profit margin|contractor note/.test(value)) risks.push("Sensitive internal information risk.");
  return risks;
}

export function rightsClear(status?: string): boolean {
  return /clear|approved|owned|licensed|royalty free|public domain/i.test(status || "");
}

export function approved(status?: string): boolean {
  return /approved/i.test(status || "");
}

export function ensureApproval(approval?: Approval, message = "Cole approval required."): void {
  if (!approval || approval.approvedByCole !== true) throw new Error(message);
}

export function readinessScore(checks: boolean[]): number {
  if (checks.length === 0) return 0;
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export function estimateWords(script: string): number {
  return script.trim() ? script.trim().split(/\s+/).length : 0;
}

