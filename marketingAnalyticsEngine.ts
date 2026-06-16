export type MarketingEvent = {
  id?: string;
  eventType: string;
  campaignId?: string;
  contentId?: string;
  page?: string;
  platform?: string;
  timestamp: string;
  leadId?: string;
  conversionStatus?: string;
  evidenceStrength?: "Low" | "Medium" | "High";
};

const events: MarketingEvent[] = [];

export function recordMarketingEvent(event: MarketingEvent): MarketingEvent {
  const stored = { ...event, id: event.id || `marketing-event-${events.length + 1}` };
  events.push(stored);
  return stored;
}

export function calculateCampaignPerformance(campaignId: string) {
  const campaignEvents = events.filter((event) => event.campaignId === campaignId);
  const visits = countEvents(campaignEvents, ["page viewed"]);
  const leads = countEvents(campaignEvents, ["form submitted", "demo requested", "creator lead submitted", "partner lead submitted", "email captured"]);
  return {
    campaignId,
    eventCount: campaignEvents.length,
    visits,
    leads,
    conversionRate: visits === 0 ? 0 : round(leads / visits),
    contentDrafted: countEvents(campaignEvents, ["content drafted"]),
    contentApproved: countEvents(campaignEvents, ["content approved"]),
    contentPublishedManually: countEvents(campaignEvents, ["content published manually"]),
    attributionNote: leads < 3 ? "Low evidence. Do not over-credit this campaign yet." : "Moderate evidence. Review source quality before scaling.",
  };
}

export function identifyBestPerformingContent(data: { events?: MarketingEvent[] } = {}) {
  const source = data.events || events;
  const grouped = groupBy(source.filter((event) => event.contentId), "contentId");
  return Object.keys(grouped)
    .map((contentId) => ({
      contentId,
      conversions: countEvents(grouped[contentId], ["form submitted", "demo requested", "creator lead submitted", "partner lead submitted", "email captured"]),
      evidenceStrength: grouped[contentId].length >= 5 ? "Medium" : "Low",
    }))
    .sort((a, b) => b.conversions - a.conversions);
}

export function identifyWeakCampaigns(data: { campaignIds?: string[] } = {}) {
  const campaignIds = data.campaignIds || unique(events.map((event) => event.campaignId).filter(Boolean) as string[]);
  return campaignIds
    .map((campaignId) => calculateCampaignPerformance(campaignId))
    .filter((performance) => performance.visits >= 5 && performance.conversionRate < 0.05)
    .map((performance) => ({
      campaignId: performance.campaignId,
      reason: "Traffic exists but lead conversion is weak.",
      recommendation: "Review CTA, landing page match, and offer clarity before increasing posting volume.",
    }));
}

export function calculateContentToLeadAttribution(data: { events?: MarketingEvent[] } = {}) {
  const source = data.events || events;
  const leadEvents = source.filter((event) => event.leadId && event.contentId);
  return leadEvents.map((event) => ({
    leadId: event.leadId,
    contentId: event.contentId,
    campaignId: event.campaignId,
    evidenceStrength: event.evidenceStrength || "Low",
    attributionNote: event.evidenceStrength === "High" ? "Direct attribution recorded." : "Tentative attribution. Do not over-credit without more evidence.",
  }));
}

export function generateMarketingReport(dateRange: { start: string; end: string }) {
  const inRange = events.filter((event) => event.timestamp >= dateRange.start && event.timestamp <= dateRange.end);
  const metrics = {
    contentDrafted: countEvents(inRange, ["content drafted"]),
    contentApproved: countEvents(inRange, ["content approved"]),
    contentPublishedManually: countEvents(inRange, ["content published manually"]),
    pageVisits: countEvents(inRange, ["page viewed"]),
    formSubmissions: countEvents(inRange, ["form submitted"]),
    demoRequests: countEvents(inRange, ["demo requested"]),
    creatorLeads: countEvents(inRange, ["creator lead submitted"]),
    partnerLeads: countEvents(inRange, ["partner lead submitted"]),
    emailCaptures: countEvents(inRange, ["email captured"]),
  };
  const conversions = metrics.formSubmissions + metrics.demoRequests + metrics.creatorLeads + metrics.partnerLeads + metrics.emailCaptures;
  return {
    dateRange,
    metrics,
    conversionRate: metrics.pageVisits === 0 ? 0 : round(conversions / metrics.pageVisits),
    bestContent: identifyBestPerformingContent({ events: inRange }).slice(0, 5),
    honestAttributionNote: "Marketing analytics are directional. Do not over-credit content without enough conversion evidence.",
    lessonsLearnedCandidates: conversions > 0 ? ["Save winning topics with clear lead evidence to Lessons Learned."] : ["Need more lead evidence before drawing conclusions."],
  };
}

export function clearMarketingAnalyticsForDemo(): void {
  events.length = 0;
}

function countEvents(source: MarketingEvent[], types: string[]): number {
  return source.filter((event) => types.indexOf(event.eventType) >= 0).length;
}

function groupBy(source: MarketingEvent[], field: "contentId"): Record<string, MarketingEvent[]> {
  return source.reduce((grouped: Record<string, MarketingEvent[]>, event) => {
    const key = String(event[field]);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(event);
    return grouped;
  }, {});
}

function unique(values: string[]): string[] {
  return values.filter((value, index) => values.indexOf(value) === index);
}

function round(value: number): number {
  return Math.round(value * 1000) / 1000;
}
