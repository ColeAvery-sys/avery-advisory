export type InteractionRecord = {
  id: string;
  audienceType: string;
  contactOrOrganization: string;
  messageUsed: string;
  offerUsed: string;
  response: string;
  outcome: string;
  responseTime?: number;
  objections: string[];
  interests: string[];
  nextBestMessage?: string;
  whatWorked: string;
  whatDidNotWork: string;
  tags: string[];
};

const interactions: InteractionRecord[] = [];

export function addInteractionRecord(record: InteractionRecord): InteractionRecord {
  interactions.push(record);
  return record;
}

export function analyzeAudienceResponses(records: InteractionRecord[]) {
  const sampleSize = records.length;
  return {
    sampleSize,
    confidence: sampleSize >= 5 ? 0.75 : 0.35,
    warning: sampleSize < 5 ? "Low confidence: do not overgeneralize from this sample." : undefined,
    responseRate: sampleSize === 0 ? 0 : records.filter((record) => /reply|yes|interested|positive/i.test(record.response)).length / sampleSize,
    winningAngles: identifyWinningAngles(records),
    objections: identifyCommonObjections(records),
  };
}

export function identifyWinningAngles(records: InteractionRecord[]): string[] {
  const values = records.reduce<string[]>((all, record) => all.concat(record.interests, record.whatWorked ? [record.whatWorked] : []), []);
  return countTerms(values);
}

export function identifyCommonObjections(records: InteractionRecord[]): string[] {
  const values = records.reduce<string[]>((all, record) => all.concat(record.objections, record.whatDidNotWork ? [record.whatDidNotWork] : []), []);
  return countTerms(values);
}

export function generateNextBestMessage(contact: { name: string; audienceType: string }, intelligence: any): { draft: string; approvalRequired: boolean; reasoning: string } {
  const angle = intelligence.winningAngles?.[0] || "a clear practical next step";
  return {
    draft: `Hi ${contact.name}, I prepared a short follow-up around ${angle}. Cole approval is required before this is sent.`,
    approvalRequired: true,
    reasoning: "All outbound messages require Cole approval. Suggested angle is based on recorded response intelligence.",
  };
}

export function updateOutreachStrategy(intelligence: any) {
  return {
    recommendedChange: `Lead with ${intelligence.winningAngles?.[0] || "the clearest proven offer"} and pre-answer ${intelligence.objections?.[0] || "the most common objection"}.`,
    confidence: intelligence.confidence || 0.35,
    approvalRequired: true,
    reason: "Outreach strategy changes affect external communication and should be approved.",
  };
}

export function clearInteractionsForDemo(): void {
  interactions.length = 0;
}

function countTerms(values: string[]): string[] {
  const counts = new Map<string, number>();
  for (const value of values.filter(Boolean)) counts.set(value, (counts.get(value) || 0) + 1);
  return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).map(([value]) => value);
}
