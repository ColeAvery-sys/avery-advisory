export type PolicyNote = {
  id: string;
  platform: string;
  policyCategory: string;
  plainLanguageSummary: string;
  riskyActions?: string[];
  prohibitedActions?: string[];
  requiredDisclosures?: string[];
  linkToPolicy?: string;
  lastReviewed?: string;
  status?: string;
  workflows?: string[];
};

const policies: PolicyNote[] = [];

export function createPolicyNote(policy: PolicyNote): PolicyNote {
  const stored = { ...policy, status: policy.status || "Active" };
  policies.push(stored);
  return stored;
}

export function getPoliciesByPlatform(platform: string): PolicyNote[] {
  return policies.filter((policy) => policy.platform === platform && policy.status !== "Deprecated");
}

export function generatePlatformRiskChecklist(platform: string): string[] {
  const notes = getPoliciesByPlatform(platform);
  if (!notes.length) return ["Policy unknown. Manual review required."];
  return notes.reduce((items: string[], note) => items.concat(note.riskyActions || [], note.prohibitedActions || [], note.requiredDisclosures || []), ["Policy tracker is guidance, not legal advice."]);
}

export function attachPolicyToWorkflow(policyId: string, workflowId: string): PolicyNote {
  const policy = findPolicy(policyId);
  policy.workflows = (policy.workflows || []).concat(workflowId);
  return policy;
}

export function flagRiskyPostOrListing(item: Record<string, any>, platform: string) {
  const checklist = generatePlatformRiskChecklist(platform);
  const text = JSON.stringify(item).toLowerCase();
  const flags = checklist.filter((rule) => text.indexOf(rule.toLowerCase()) >= 0 || /unknown|manual review/i.test(rule));
  return { platform, flags, approvalRequired: true, manualReviewRequired: flags.length > 0 || checklist[0].indexOf("unknown") >= 0 };
}

export function markPolicyNeedsReview(policyId: string): PolicyNote {
  const policy = findPolicy(policyId);
  policy.status = "Needs Review";
  return policy;
}

function findPolicy(policyId: string): PolicyNote {
  const policy = policies.find((entry) => entry.id === policyId);
  if (!policy) throw new Error(`Policy ${policyId} not found.`);
  return policy;
}
