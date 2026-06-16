export type ArticlePlan = {
  id: string;
  title: string;
  keyword: string;
  searchIntent: string;
  audience: string;
  funnelStage: string;
  relatedOffer: string;
  relatedLandingPage: string;
  outline?: string[];
  draft?: string;
  status: string;
  approvalStatus: "Needs Cole Approval" | "Approved";
};

export function generateKeywordIdeas(category: string): string[] {
  const map: Record<string, string[]> = {
    "creator content systems": ["creator content workflow", "turn long video into clips", "youtube content organization"],
    "executive dysfunction planning": ["executive dysfunction planner", "overwhelm planning system", "daily planning for neurodivergent adults"],
    "accessibility AI": ["accessibility first AI", "AI organization tool", "assistive workflow software"],
    "grant readiness": ["grant readiness checklist", "accessibility tech funding", "small business grant documents"],
  };
  return map[category.toLowerCase()] || [`${category} guide`, `${category} checklist`, `${category} workflow`];
}

export function createArticlePlan(input: Partial<ArticlePlan>): ArticlePlan {
  if (!input.title || !input.keyword) throw new Error("Article title and keyword are required.");
  return {
    id: input.id || `article-${Date.now()}`,
    title: input.title,
    keyword: input.keyword,
    searchIntent: input.searchIntent || "Informational",
    audience: input.audience || "AveryTech visitor",
    funnelStage: input.funnelStage || "Awareness",
    relatedOffer: input.relatedOffer || "Demo request",
    relatedLandingPage: input.relatedLandingPage || "/demo",
    status: input.status || "Outline",
    approvalStatus: input.approvalStatus || "Needs Cole Approval",
  };
}

export function generateArticleOutline(article: ArticlePlan): string[] {
  return [
    `Define the problem behind ${article.keyword}`,
    `Explain who needs this: ${article.audience}`,
    "Give a practical framework",
    `Connect the framework to ${article.relatedOffer}`,
    `Send readers to ${article.relatedLandingPage}`,
    "Safety disclaimer and no exaggerated promises",
  ];
}

export function generateMetaDescription(article: ArticlePlan): string {
  return `A practical guide to ${article.keyword} for ${article.audience}, with clear next steps and no exaggerated claims.`;
}

export function generateInternalLinks(article: ArticlePlan, sitePages: string[]) {
  return sitePages
    .filter((page) => page === article.relatedLandingPage || /demo|creator|atlas|partner|pricing/i.test(page))
    .slice(0, 5)
    .map((page) => ({ page, reason: `Supports ${article.relatedOffer} or product interest.` }));
}

export function validateSeoDraft(article: ArticlePlan) {
  const text = `${article.title} ${article.keyword} ${article.outline || ""} ${article.draft || ""}`.toLowerCase();
  const warnings: string[] = [];
  if (/cure|diagnose|treat|medical device|therapy replacement/.test(text)) warnings.push("medical claim detected");
  if (/guarantee growth|guaranteed funding|guaranteed revenue/.test(text)) warnings.push("guaranteed outcome claim detected");
  if (!article.relatedOffer || !article.relatedLandingPage) warnings.push("missing offer or landing page connection");
  return {
    valid: warnings.length === 0,
    warnings,
    approvalRequired: true,
    publishingStatus: "Draft Only",
  };
}
