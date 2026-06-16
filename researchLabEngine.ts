import { createRdGate, detectRdRisks } from "./rdSafety";

const researchNotes: any[] = [];

export function createResearchNote(note: any) {
  const stored = { ...note, id: note.id || `research-${researchNotes.length + 1}`, status: note.status || "Draft", riskFlags: detectRdRisks(note) };
  researchNotes.push(stored);
  return stored;
}

export function generateResearchSummary(category: string) {
  const notes = researchNotes.filter((note) => String(note.category).toLowerCase() === category.toLowerCase());
  return {
    category,
    noteCount: notes.length,
    keyFindings: notes.map((note) => note.finding || note.summary || note.title),
    caution: "Research summaries are internal planning notes, not approved public or clinical claims.",
    ...createRdGate("Research summary", notes.reduce((risks: string[], note: any) => risks.concat(detectRdRisks(note)), [])),
  };
}

export function identifyResearchOpportunities(category: string) {
  return researchNotes.filter((note) => String(note.category).toLowerCase() === category.toLowerCase()).map((note) => ({
    category,
    opportunity: note.opportunity || `Explore product or grant angle from ${note.title}`,
    approvalRequiredBeforePublicClaim: true,
  }));
}

export function generateGrantOpportunitiesFromResearch(category: string) {
  return identifyResearchOpportunities(category).map((item) => ({ ...item, grantAngle: `${category} evidence and pilot-readiness package` }));
}

export function generateFutureProductIdeas(category: string) {
  return identifyResearchOpportunities(category).map((item) => ({ productIdea: item.opportunity, stage: "Research", prototypeFirstRequired: true }));
}
