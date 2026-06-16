import { createResearchGate, detectResearchRisks } from "./researchInstituteSafety";

export function createPublicationDraft(input: any) {
  return {
    title: input.title,
    publicationType: input.publicationType || "Research Summary",
    sections: generatePublicationSections(input.publicationType),
    sourceMaterials: input.sourceMaterials || [],
    claimsReviewRequired: true,
    ...createResearchGate("Research publication draft", detectResearchRisks(input).concat(["Publication claims require review."])),
  };
}

export function generateExecutiveSummary(input: any) {
  return {
    title: input.title,
    summary: input.summary || "AveryTech research summary draft pending measured outcomes.",
    limitations: input.limitations || ["Internal draft", "Not medical advice", "No clinical claims"],
    approvalRequiredBeforeSharing: true,
  };
}

export function generateSlideDeckOutline(input: any) {
  return ["Mission", "Problem", "Prototype", "Pilot design", "Observed outcomes", "Limitations", "Grant/partner opportunity"].map((slide, index) => ({ slide: index + 1, title: slide, notes: input.title }));
}

export function generatePublicationSections(type: string) {
  if (/white paper/i.test(type || "")) return ["Abstract", "Background", "Problem", "Prototype", "Method", "Observed Outcomes", "Limitations", "Next Steps"];
  if (/case study/i.test(type || "")) return ["Context", "Participant-safe scenario", "Tool used", "Observed outcome", "Limitations", "Future work"];
  return ["Purpose", "Research notes", "Pilot plan", "Observed outcomes", "Limitations", "Recommendations"];
}
