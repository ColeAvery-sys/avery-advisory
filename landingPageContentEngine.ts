export function generateAveryTechHeroCopy() {
  return {
    headline: "AveryTech builds accessibility-first AI systems for life, work, content, and independence.",
    subheadline: "Tools for overwhelmed, disabled, neurodivergent, creative, and high-output people who need clearer systems and safer support.",
    ctas: ["Request a Demo", "Join Product Interest List", "Partner With Us", "Hire Creator Logistics", "Contact AveryTech"],
  };
}

export function generateAtlasAssistCopy() {
  return {
    headline: "ATLAS Assist is an organizational and accessibility-support tool.",
    features: ["daily command center", "task support", "routine support", "appointment organization", "document organization", "overwhelm mode", "weekly summaries"],
    disclaimer: "ATLAS Assist is not a medical device, diagnosis tool, therapy replacement, or emergency service. It is an organizational and accessibility-support tool.",
  };
}

export function generateCreatorLogisticsCopy() {
  return {
    headline: "Content infrastructure for creators who are too busy to organize their own growth.",
    painPoints: ["too much footage", "no clip system", "inconsistent posting", "no timestamps", "editing backlog", "ideas scattered everywhere"],
    revisionPolicy: "Includes 3 revisions by default. Final scope and pricing require review.",
  };
}

export function generateFunderCredibilityCopy() {
  return {
    summary: "AveryTech is developing accessibility-first software concepts with local economic, workforce, and independent-living relevance.",
    fundingUses: ["prototype development", "accessibility research", "user testing", "pilot program", "software development", "documentation", "outreach", "contractor support"],
  };
}

export function generatePartnerPageCopy() {
  return {
    headline: "Partner with AveryTech on accessibility technology, organization systems, and support workflows.",
    safety: "AveryTech does not provide medical care, therapy, diagnosis, or emergency support.",
  };
}

export function generateFaqItems(pageType: string) {
  return [
    { question: `Is ${pageType} guaranteed to produce outcomes?`, answer: "No. AveryTech does not guarantee growth, funding, medical, legal, or financial outcomes." },
    { question: "What happens after I submit a form?", answer: "ATLAS creates an internal record and draft reply for Cole review. Nothing is sent automatically." },
  ];
}

export function validatePublicClaims(content: string) {
  const banned = [/guarantee(d)? funding/i, /guarantee(d)? growth/i, /medical treatment/i, /diagnos(is|e)/i, /therapy replacement/i, /official partner/i, /approved by/i, /cure/i];
  const violations = banned.filter((pattern) => pattern.test(content)).map((pattern) => pattern.toString());
  return { valid: violations.length === 0, violations, sanitized: content.replace(/—/g, "-") };
}
