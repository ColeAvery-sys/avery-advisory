export function generateFunderSummary(companyData: any) {
  return `${companyData.companyName || "AveryTech"} is building accessibility-first software concepts focused on organization, workflow support, and independent-living support. No funding outcomes are guaranteed.`;
}

export function generateFundingUseStatement(projectData: any) {
  return `Potential funding uses: ${(projectData.uses || []).join(", ")}. These are planned uses and do not imply approval, nonprofit status, or guaranteed outcomes.`;
}

export function validateFunderClaims(content: string) {
  const violations = [/nonprofit/i, /guarantee(d)?/i, /medical treatment/i, /approved partner/i].filter((pattern) => pattern.test(content)).map(String);
  return { valid: violations.length === 0, violations };
}

export function createFunderInquiryRecord(form: any) {
  return { name: form.contactName, organization: form.organizationName, email: form.email, status: "Needs Grant Officer Review" };
}

export function generateFunderReplyDraft(form: any) {
  return { body: `Hi ${form.contactName}, thanks for your interest in AveryTech. Cole will review before any follow-up or project claims are sent.`, approvalRequired: true };
}
