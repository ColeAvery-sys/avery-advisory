export type ProofItem = {
  id: string;
  title: string;
  proofType: string;
  summary: string;
  permissionGranted: boolean;
  coleApprovedPublicUse: boolean;
  sensitiveInfo?: string;
  prototype?: boolean;
  status: "Internal Only" | "Approved for Public Use" | "Needs Permission" | "Archived";
};

export type PublicCaseStudy = {
  id: string;
  title: string;
  problem: string;
  solution: string;
  outcome: string;
  evidenceLinks: string[];
  permissionGranted: boolean;
  coleApprovedPublicUse: boolean;
  prototype?: boolean;
};

const proofItems: ProofItem[] = [];

export function createProofItem(item: ProofItem): ProofItem {
  item.status = item.permissionGranted && item.coleApprovedPublicUse ? "Approved for Public Use" : "Needs Permission";
  proofItems.push(item);
  return item;
}

export function validateProofForPublicUse(item: ProofItem): { valid: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (!item.permissionGranted) reasons.push("permission required");
  if (!item.coleApprovedPublicUse) reasons.push("Cole approval required");
  if (item.sensitiveInfo) reasons.push("sensitive info must be removed");
  return { valid: reasons.length === 0, reasons };
}

export function createPublicCaseStudyDraft(data: PublicCaseStudy) {
  return sanitizePublicCaseStudy(data);
}

export function sanitizePublicCaseStudy(caseStudy: PublicCaseStudy) {
  return {
    ...caseStudy,
    problem: sanitize(caseStudy.problem),
    solution: sanitize(caseStudy.solution),
    outcome: `${sanitize(caseStudy.outcome)}${caseStudy.prototype ? " Prototype concept." : ""}`,
    publicUseReady: caseStudy.permissionGranted && caseStudy.coleApprovedPublicUse,
  };
}

export function getApprovedPublicProofItems(): ProofItem[] {
  return proofItems.filter((item) => item.status === "Approved for Public Use");
}

export function getInternalOnlyProofItems(): ProofItem[] {
  return proofItems.filter((item) => item.status !== "Approved for Public Use");
}

export function clearProofItemsForDemo(): void {
  proofItems.length = 0;
}

function sanitize(value: string): string {
  return value.replace(/private data|medical detail|client secret/gi, "[removed sensitive detail]").replace(/guaranteed/gi, "reported");
}
