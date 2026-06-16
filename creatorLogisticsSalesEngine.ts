export type CreatorSalesLead = {
  name: string;
  email: string;
  platformLinks: string[];
  longVideos: number;
  shortClipsNeeded: number;
  needsTimestamps: boolean;
  needsUploadCalendar: boolean;
  budgetRange?: string;
  deadline?: string;
};

export function submitCreatorSalesLead(form: CreatorSalesLead) {
  validateCreatorSalesLead(form);
  const packageRecommendation = recommendPackage(form);
  return {
    packageRecommendation,
    priceRange: estimatePriceRange(form),
    summary: generateSalesSummary(form),
    proposalDraft: generateProposalDraft(form),
  };
}

export function validateCreatorSalesLead(form: CreatorSalesLead): void {
  if (!form.email) throw new Error("Creator sales lead requires email.");
}

export function recommendPackage(form: CreatorSalesLead): string {
  if (form.shortClipsNeeded >= 20 || form.needsUploadCalendar) return "Operator";
  if (form.shortClipsNeeded >= 10 || form.longVideos >= 2) return "Growth";
  return "Starter";
}

export function estimatePriceRange(form: CreatorSalesLead): string {
  const pkg = recommendPackage(form);
  if (pkg === "Starter") return "Starting at $250 to $500. Final pricing requires project review.";
  if (pkg === "Growth") return "Starting at $750 to $1,500. Final pricing requires project review.";
  return "Starting at $2,000 to $3,500/month. Final pricing requires project review.";
}

export function generateSalesSummary(form: CreatorSalesLead): string {
  return `${form.name} needs ${form.shortClipsNeeded} clips from ${form.longVideos} long videos. Do not guarantee growth. Package: ${recommendPackage(form)}.`;
}

export function generateProposalDraft(form: CreatorSalesLead) {
  return { body: `Hi ${form.name}, based on your content needs, ${recommendPackage(form)} may be a fit. Final pricing and scope require Cole review.`, approvalRequired: true };
}
