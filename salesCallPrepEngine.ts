export type SalesCallPrepInput = {
  contact: string;
  organization?: string;
  website?: string;
  socialLinks?: string[];
  leadSource?: string;
  interestType: string;
  budget?: string;
  timeline?: string;
  priorMessages?: string[];
  notes?: string;
  callGoal: string;
};

export function generateSalesCallPrep(input: SalesCallPrepInput) {
  const isCreator = /creator|content|clips/i.test(input.interestType);
  return {
    callBrief: `${input.contact} is interested in ${input.interestType}. Goal: ${input.callGoal}. Confirm fit before proposing scope.`,
    likelyPainPoints: isCreator ? ["Content backlog", "No clip system", "Inconsistent posting"] : ["Unclear workflow", "Need safe pilot", "Need trust before commitment"],
    qualificationQuestions: ["What budget range should we respect?", "What timeline matters?", "Who approves the decision?", "What does success look like?"],
    offerRecommendation: isCreator ? "Creator Logistics discovery and package recommendation" : "Partner or consulting discovery",
    proofPoints: ["Process clarity", "Approval-gated external communication", "Scope-first proposal"],
    objectionPredictions: ["Need to think about it", "Budget concern", "Need proof"],
    closeOptions: ["Draft proposal for Cole approval", "Schedule follow-up", "Start with smaller diagnostic scope"],
    redFlags: detectCallRedFlags(input),
    postCallTaskChecklist: ["Log notes", "Update deal stage", "Draft follow-up for approval", "Create proposal or quote if qualified"],
    followUpDraft: {
      body: `Draft only: Thanks for the conversation. I will summarize scope, budget, timeline, and next steps for review.`,
      approvalRequired: true,
    },
  };
}

function detectCallRedFlags(input: SalesCallPrepInput): string[] {
  const text = `${input.notes || ""} ${input.interestType}`.toLowerCase();
  const flags: string[] = [];
  if (/medical|clinical|diagnosis|therapy/.test(text)) flags.push("Medical or clinical claims require review.");
  if (/legal|contract|tax|financial/.test(text)) flags.push("Legal or financial topic requires review.");
  if (!input.budget) flags.push("Budget unknown.");
  return flags;
}
