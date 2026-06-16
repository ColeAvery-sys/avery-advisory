export type CreatorLeadForm = {
  creatorName: string;
  email: string;
  platformLinks: string[];
  contentType: string;
  biggestProblem: string;
  numberOfLongVideos: number;
  numberOfShortClipsNeeded: number;
  editingHelpNeeded: boolean;
  timestampHelpNeeded: boolean;
  captionHelpNeeded: boolean;
  uploadCalendarNeeded: boolean;
  monthlyBudgetRange: string;
  deadline?: string;
  notes?: string;
};

export function submitCreatorLead(form: CreatorLeadForm) {
  validateCreatorLead(form);
  const score = scoreCreatorLead(form);
  const recommendation = recommendCreatorPackage(form);
  return {
    crmContact: createCrmContactFromLead(form),
    clientPipelineLead: createClientPipelineLead(form, score),
    score,
    recommendation,
    internalSummary: generateInternalLeadSummary(form, score),
    draftReply: generateDraftReply(form, recommendation),
    notification: { agent: "ATLAS Sales Operator", title: `New creator lead: ${form.creatorName}` },
  };
}

export function validateCreatorLead(form: CreatorLeadForm): void {
  if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) throw new Error("Creator lead requires a valid email.");
  if (!form.creatorName) throw new Error("Creator lead requires a creator name.");
}

export function scoreCreatorLead(form: CreatorLeadForm): number {
  let score = 30;
  score += Math.min(25, form.numberOfShortClipsNeeded);
  score += form.numberOfLongVideos * 3;
  if (form.editingHelpNeeded) score += 10;
  if (form.timestampHelpNeeded) score += 8;
  if (form.uploadCalendarNeeded) score += 6;
  if (/\$?750|\$?1000|\$?1500|\$?2000|high/i.test(form.monthlyBudgetRange)) score += 20;
  if (/urgent|asap|soon/i.test(`${form.deadline} ${form.notes}`)) score += 8;
  return Math.min(100, score);
}

export function recommendCreatorPackage(form: CreatorLeadForm): string {
  if (form.numberOfShortClipsNeeded >= 20 || form.uploadCalendarNeeded) return "Operator";
  if (form.numberOfShortClipsNeeded >= 10 || /\$?750|\$?1000|\$?1500/i.test(form.monthlyBudgetRange)) return "Growth";
  return "Starter";
}

export function createCrmContactFromLead(form: CreatorLeadForm) {
  return { name: form.creatorName, email: form.email, relationshipType: "Lead", tags: ["creator", form.contentType], notes: form.biggestProblem };
}

export function createClientPipelineLead(form: CreatorLeadForm, score: number) {
  return { name: form.creatorName, platform: form.platformLinks.join(", "), budget: form.monthlyBudgetRange, leadScore: score, status: "Needs Cole Approval Before Proposal" };
}

export function generateInternalLeadSummary(form: CreatorLeadForm, score: number): string {
  return `${form.creatorName} scored ${score}/100. Main problem: ${form.biggestProblem}. Package recommendation: ${recommendCreatorPackage(form)}. No pricing or acceptance is promised.`;
}

export function generateDraftReply(form: CreatorLeadForm, recommendation: string) {
  return {
    subject: `Creator Logistics follow-up for ${form.creatorName}`,
    body: `Hi ${form.creatorName}, thanks for reaching out. Based on what you shared, ${recommendation} may be a fit. Cole will review before any proposal or pricing is sent.`,
    approvalRequired: true,
  };
}
