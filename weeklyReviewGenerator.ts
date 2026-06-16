export type ReviewItem = {
  title: string;
  score?: number;
  status?: string;
  deadline?: string;
  requiresColeApproval?: boolean;
  blocked?: boolean;
};

export type WeeklyReviewInput = {
  tasks: ReviewItem[];
  moneyPipeline: ReviewItem[];
  grants: ReviewItem[];
  clients: ReviewItem[];
  products: ReviewItem[];
  approvals: ReviewItem[];
  completedItems: ReviewItem[];
  blockedItems: ReviewItem[];
};

export type WeeklyReviewResult = {
  revenueProgress: string;
  grantProgress: string;
  productProgress: string;
  clientProgress: string;
  completedSummary: string;
  blockedSummary: string;
  missedOpportunities: string[];
  nextWeekTopFive: string[];
  atlasRecommendation: string;
  killOrPauseSuggestions: string[];
};

export function generateWeeklyReview(data: WeeklyReviewInput): WeeklyReviewResult {
  const nextWeekTopFive = rankNextWeekItems(data).slice(0, 5).map((item) => item.title);

  return {
    revenueProgress: summarize("Revenue", data.moneyPipeline),
    grantProgress: summarize("Grants", data.grants),
    productProgress: summarize("Products", data.products),
    clientProgress: summarize("Clients", data.clients),
    completedSummary: summarize("Completed", data.completedItems),
    blockedSummary: summarize("Blocked", data.blockedItems),
    missedOpportunities: getMissedOpportunities(data),
    nextWeekTopFive,
    atlasRecommendation: getAtlasRecommendation(data, nextWeekTopFive),
    killOrPauseSuggestions: getKillOrPauseSuggestions(data),
  };
}

function summarize(label: string, items: ReviewItem[]): string {
  if (items.length === 0) return `${label}: no tracked items this week.`;
  const top = [...items].sort((a, b) => (b.score || 0) - (a.score || 0))[0];
  return `${label}: ${items.length} tracked, top item is ${top.title}.`;
}

function rankNextWeekItems(data: WeeklyReviewInput): ReviewItem[] {
  return [
    ...data.moneyPipeline.map((item) => ({ ...item, score: (item.score || 0) + 20 })),
    ...data.grants.map((item) => ({ ...item, score: (item.score || 0) + 15 })),
    ...data.clients.map((item) => ({ ...item, score: (item.score || 0) + 15 })),
    ...data.products.map((item) => ({ ...item, score: (item.score || 0) + (item.title.toLowerCase().includes("automation") ? 12 : 5) })),
    ...data.approvals.map((item) => ({ ...item, score: (item.score || 0) + 18 })),
  ].sort((a, b) => (b.score || 0) - (a.score || 0));
}

function getMissedOpportunities(data: WeeklyReviewInput): string[] {
  return [...data.moneyPipeline, ...data.grants, ...data.clients]
    .filter((item) => item.status === "Missed" || item.blocked)
    .map((item) => item.title);
}

function getAtlasRecommendation(data: WeeklyReviewInput, topFive: string[]): string {
  if (data.approvals.length > 0) return `Clear Cole approvals first, then focus on ${topFive[0] || "the top revenue task"}.`;
  if (data.moneyPipeline.length > 0) return `Prioritize cash flow first: ${topFive[0] || data.moneyPipeline[0].title}.`;
  return "Use next week to tighten intake, routing, and product infrastructure.";
}

function getKillOrPauseSuggestions(data: WeeklyReviewInput): string[] {
  return [...data.tasks, ...data.products, ...data.clients]
    .filter((item) => (item.score || 0) < 40 || item.status === "Stale")
    .map((item) => item.title);
}
