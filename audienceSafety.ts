export function createAudienceGate(actionType: string, riskFlags: string[] = []) {
  return {
    status: "Draft",
    approvalStatus: "Needs Cole Approval",
    riskFlags,
    draftOnly: true,
    noAutoMessaging: true,
    actionType,
  };
}

export function detectAudienceRisks(text: string): string[] {
  const value = text.toLowerCase();
  const risks: string[] = [];
  if (/mass dm|auto dm|spam|fake engagement|fake follower|bot|astroturf|impersonate/.test(value)) risks.push("Manipulation or fake engagement risk.");
  if (/refund|angry|harass|dox|threat|self harm|medical|legal|financial/.test(value)) risks.push("Sensitive or escalated community risk.");
  if (/guarantee|guaranteed|make money|cure|diagnose/.test(value)) risks.push("Unsupported claim risk.");
  return risks;
}

export function sentimentScore(text: string): number {
  const value = text.toLowerCase();
  let score = 0;
  if (/love|great|helpful|thanks|thank you|amazing|needed|useful|support/.test(value)) score += 2;
  if (/confused|question|how|why|what|when/.test(value)) score += 1;
  if (/bad|hate|angry|scam|wrong|refund|broken|complaint/.test(value)) score -= 2;
  return score;
}

export function engagementScore(data: any): number {
  const raw =
    (Number(data.commentFrequency) || 0) * 10 +
    (Number(data.shares) || 0) * 15 +
    (Number(data.purchases) || 0) * 20 +
    (Number(data.newsletterOpens) || 0) * 5 +
    (Number(data.communityActivity) || 0) * 10 +
    (Number(data.referrals) || 0) * 25;
  return Math.min(100, raw);
}

export function requireApprovalDraft(kind: string, recipient?: string) {
  return {
    kind,
    recipient,
    body: `Draft ${kind}. Do not send automatically. Cole approval required before any outreach.`,
    approvalRequired: true,
  };
}

export function countBy<T>(items: T[], getter: (item: T) => string): Record<string, number> {
  const counts: Record<string, number> = {};
  items.forEach((item) => {
    const key = getter(item) || "Unknown";
    counts[key] = (counts[key] || 0) + 1;
  });
  return counts;
}

