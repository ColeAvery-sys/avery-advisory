export type AtlasAgentRouterInput = {
  rawInput: string;
  source?: string;
  urgency?: number;
  moneyRelated?: boolean;
  legalRelated?: boolean;
  clientRelated?: boolean;
  grantRelated?: boolean;
  productRelated?: boolean;
  personalRelated?: boolean;
};

export type AtlasAgentRouterResult = {
  detectedDepartment: string;
  assignedAgent: string;
  confidence: number;
  requiresColeApproval: boolean;
  reason: string;
  suggestedNextAction: string;
  tags: string[];
};

type RouteDefinition = {
  department: string;
  agent: string;
  keywords: string[];
  flag?: keyof AtlasAgentRouterInput;
  suggestedNextAction: string;
};

const ROUTES: RouteDefinition[] = [
  {
    department: "Grants and Funding",
    agent: "ATLAS Grant Officer",
    flag: "grantRelated",
    keywords: ["grant", "grants", "funding", "application", "applications", "eligibility", "wv", "sba", "disability funding"],
    suggestedNextAction: "Collect eligibility details, deadline, required documents, and draft the grant work plan.",
  },
  {
    department: "Creator Logistics",
    agent: "Creator Logistics Manager",
    flag: "clientRelated",
    keywords: ["client", "clients", "creator", "creators", "video", "videos", "clip", "clips", "timestamp", "timestamps", "package", "packages", "revision", "revisions", "delivery"],
    suggestedNextAction: "Confirm deliverables, owner, deadline, revision status, and the next client-safe update.",
  },
  {
    department: "Product and Engineering",
    agent: "Product Manager",
    flag: "productRelated",
    keywords: ["app", "feature", "bug", "api", "dashboard", "database", "automation"],
    suggestedNextAction: "Define the user outcome, acceptance criteria, technical owner, and smallest shippable step.",
  },
  {
    department: "Sales",
    agent: "Sales Assistant",
    keywords: ["email", "emails", "outreach", "lead", "leads", "sales", "pricing", "follow-up", "follow up"],
    suggestedNextAction: "Draft the outreach or follow-up, identify the recipient, and prepare Cole approval if sending externally.",
  },
  {
    department: "Legal and Finance",
    agent: "Legal/Finance Reviewer",
    flag: "legalRelated",
    keywords: ["contract", "contracts", "invoice", "invoices", "business credit", "loan", "loans", "tax", "taxes", "disclaimer", "disclaimers", "risk"],
    suggestedNextAction: "Summarize the decision, dollar impact, risk, and required review before any commitment.",
  },
  {
    department: "Personal Operations",
    agent: "Chief of Staff",
    flag: "personalRelated",
    keywords: ["personal", "college", "appointment", "appointments", "family", "schedule", "overwhelm", "daily plan"],
    suggestedNextAction: "Clarify the desired outcome, deadline, and whether this belongs on today's plan.",
  },
];

const APPROVAL_KEYWORDS = [
  "pay",
  "payment",
  "transfer",
  "wire",
  "purchase",
  "spend",
  "send money",
  "refund",
  "submit grant",
  "submit application",
  "apply for",
  "hire",
  "hiring",
  "contract",
  "contracts",
  "sign",
  "signature",
  "delete",
  "deleting",
  "remove data",
  "drop database",
  "publish",
  "public post",
  "post publicly",
  "send to client",
  "send client",
  "email client",
  "send email",
  "invoice",
  "loan",
  "business credit",
  "tax",
  "legal decision",
  "financial decision",
];

/**
 * Routes an incoming ATLAS command to the best department and agent.
 */
export function atlasAgentRouter(input: AtlasAgentRouterInput): AtlasAgentRouterResult {
  validateRouterInput(input);

  const normalizedInput = normalize(input.rawInput);
  const routeScores = ROUTES.map((route, index) => {
    const matchedKeywords = route.keywords.filter((keyword) => includesKeyword(normalizedInput, keyword));
    const flagMatched = route.flag ? input[route.flag] === true : false;
    const score = matchedKeywords.length + (flagMatched ? 2 : 0);

    return {
      route,
      score,
      matchedKeywords,
      flagMatched,
      index,
    };
  });

  routeScores.sort((a, b) => b.score - a.score || a.index - b.index);

  const bestMatch = routeScores[0];
  const isUnclear = bestMatch.score === 0;
  const selectedRoute = isUnclear ? getFallbackRoute() : bestMatch.route;
  const matchedKeywords = isUnclear ? [] : bestMatch.matchedKeywords;
  const requiresColeApproval = getRequiresColeApproval(input, normalizedInput);
  const confidence = getConfidence(bestMatch.score, matchedKeywords.length, isUnclear, input.urgency);
  const tags = getTags(input, selectedRoute, matchedKeywords, requiresColeApproval, isUnclear);

  return {
    detectedDepartment: selectedRoute.department,
    assignedAgent: selectedRoute.agent,
    confidence,
    requiresColeApproval,
    reason: getReason(selectedRoute, matchedKeywords, isUnclear, bestMatch.flagMatched),
    suggestedNextAction: selectedRoute.suggestedNextAction,
    tags,
  };
}

function validateRouterInput(input: AtlasAgentRouterInput): void {
  if (!input || typeof input !== "object") {
    throw new TypeError("Router input must be an object.");
  }

  if (!input.rawInput || typeof input.rawInput !== "string") {
    throw new TypeError("rawInput must be a non-empty string.");
  }

  if (input.urgency !== undefined && (!Number.isInteger(input.urgency) || input.urgency < 1 || input.urgency > 10)) {
    throw new RangeError("urgency must be an integer from 1 to 10 when provided.");
  }
}

function getFallbackRoute(): RouteDefinition {
  return {
    department: "Personal Operations",
    agent: "Chief of Staff",
    keywords: [],
    suggestedNextAction: "Review manually, classify the command, and decide the first concrete next step.",
  };
}

function getRequiresColeApproval(input: AtlasAgentRouterInput, normalizedInput: string): boolean {
  const keywordTriggered = APPROVAL_KEYWORDS.some((keyword) => includesKeyword(normalizedInput, keyword));
  const externalGrantSubmission = input.grantRelated === true && /\b(submit|apply|send|file)\b/.test(normalizedInput);
  const publicOrClientMessage =
    input.clientRelated === true && /\b(send|email|publish|post|reply|message|deliver)\b/.test(normalizedInput);
  const legalOrFinancialDecision = input.legalRelated === true || input.moneyRelated === true;

  return keywordTriggered || externalGrantSubmission || publicOrClientMessage || legalOrFinancialDecision;
}

function getConfidence(score: number, matchedKeywordCount: number, isUnclear: boolean, urgency?: number): number {
  if (isUnclear) return 0.35;

  const urgencyBoost = urgency !== undefined && urgency >= 8 ? 0.05 : 0;
  const confidence = 0.55 + Math.min(score, 5) * 0.08 + Math.min(matchedKeywordCount, 3) * 0.03 + urgencyBoost;

  return roundToTwoDecimals(Math.min(confidence, 0.98));
}

function getReason(route: RouteDefinition, matchedKeywords: string[], isUnclear: boolean, flagMatched: boolean): string {
  if (isUnclear) {
    return "No strong routing keywords were found, so the command needs Chief of Staff review.";
  }

  const keywordReason = matchedKeywords.length > 0 ? `matched ${matchedKeywords.join(", ")}` : "matched an explicit input flag";
  const flagReason = flagMatched ? " and an explicit input flag" : "";

  return `Routed to ${route.agent} because the command ${keywordReason}${flagReason}.`;
}

function getTags(
  input: AtlasAgentRouterInput,
  route: RouteDefinition,
  matchedKeywords: string[],
  requiresColeApproval: boolean,
  isUnclear: boolean,
): string[] {
  const tags = new Set<string>();

  tags.add(slugify(route.department));

  if (input.source) tags.add(`source:${slugify(input.source)}`);
  if (input.urgency !== undefined) tags.add(input.urgency >= 8 ? "urgent" : "non-urgent");
  if (requiresColeApproval) tags.add("needs-cole-approval");
  if (isUnclear) tags.add("needs-review");

  for (const keyword of matchedKeywords.slice(0, 5)) {
    tags.add(slugify(keyword));
  }

  return Array.from(tags);
}

function normalize(value: string): string {
  return value.toLowerCase().replace(/[^\w\s-]/g, " ").replace(/\s+/g, " ").trim();
}

function includesKeyword(normalizedInput: string, keyword: string): boolean {
  const normalizedKeyword = normalize(keyword);
  const escapedKeyword = normalizedKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  return new RegExp(`\\b${escapedKeyword}\\b`).test(normalizedInput);
}

function slugify(value: string): string {
  return normalize(value).replace(/\s+/g, "-");
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}
