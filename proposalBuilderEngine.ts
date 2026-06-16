export type ProposalRecord = {
  id: string;
  proposalTitle: string;
  clientName: string;
  organization?: string;
  problemSummary: string;
  proposedSolution: string;
  deliverables: string[];
  timeline: string;
  pricingRange: string;
  revisionPolicy: string;
  responsibilities: string[];
  assumptions: string[];
  nextSteps: string[];
  approvalStatus: "Draft" | "Needs Cole Approval" | "Approved";
  riskWarnings?: string[];
};

const proposals: ProposalRecord[] = [];

export function createProposal(proposal: ProposalRecord): ProposalRecord {
  const approvalStatus: ProposalRecord["approvalStatus"] = proposal.approvalStatus === "Approved" ? "Approved" : "Needs Cole Approval";
  const stored: ProposalRecord = { ...proposal, approvalStatus, riskWarnings: validateProposalClaims(proposal).warnings };
  proposals.push(stored);
  return stored;
}

export function generateProposalDraft(proposal: ProposalRecord) {
  return {
    title: proposal.proposalTitle,
    draft: [
      `# ${proposal.proposalTitle}`,
      `Client: ${proposal.clientName}`,
      `Summary: ${proposal.problemSummary}`,
      `Proposed solution: ${proposal.proposedSolution}`,
      `Deliverables: ${proposal.deliverables.join(", ")}`,
      `Timeline: ${proposal.timeline}`,
      `Pricing estimate: ${proposal.pricingRange}`,
      `Revision policy: ${proposal.revisionPolicy}`,
      `What we need: ${proposal.responsibilities.join(", ")}`,
      `Next steps: ${proposal.nextSteps.join(", ")}`,
      "Final proposal requires Cole approval.",
    ].join("\n\n"),
    approvalRequired: true,
    validation: validateProposalClaims(proposal),
  };
}

export function validateProposalClaims(proposal: ProposalRecord) {
  const text = `${proposal.problemSummary} ${proposal.proposedSolution} ${proposal.deliverables.join(" ")} ${proposal.assumptions.join(" ")}`.toLowerCase();
  const warnings: string[] = [];
  if (/guarantee growth|guaranteed views|guaranteed revenue/.test(text)) warnings.push("Creator growth or revenue guarantee detected.");
  if (/medical|clinical|diagnose|treat|therapy/.test(text)) warnings.push("Medical outcome claim detected.");
  if (!proposal.revisionPolicy) warnings.push("Revision policy is missing.");
  if (!proposal.pricingRange || !/estimate|range|starting|approx/i.test(proposal.pricingRange)) warnings.push("Pricing should be marked as an estimate unless approved.");
  return { valid: warnings.length === 0, warnings, approvalRequired: true };
}

export function markProposalApproved(proposalId: string, approval: { approvedByCole: boolean }): ProposalRecord {
  if (!approval.approvedByCole) throw new Error("Cole approval required.");
  const proposal = findProposal(proposalId);
  proposal.approvalStatus = "Approved";
  return proposal;
}

export function createProposalChecklist(proposal: ProposalRecord): string[] {
  return ["Confirm scope", "Confirm estimate language", "Confirm revision policy", "Confirm client responsibilities", "Cole approval before sending"];
}

export function exportProposalMarkdown(proposalId: string): string {
  return generateProposalDraft(findProposal(proposalId)).draft;
}

export function clearProposalsForDemo(): void {
  proposals.length = 0;
}

function findProposal(proposalId: string): ProposalRecord {
  const proposal = proposals.find((entry) => entry.id === proposalId);
  if (!proposal) throw new Error(`Proposal ${proposalId} not found.`);
  return proposal;
}
