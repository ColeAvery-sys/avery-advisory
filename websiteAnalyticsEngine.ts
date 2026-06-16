export type WebsiteEvent = {
  eventType: string;
  page: string;
  timestamp: string;
  source?: string;
  campaign?: string;
  visitorId?: string;
  sessionId?: string;
  relatedForm?: string;
  conversionStatus?: string;
};

const events: WebsiteEvent[] = [];

export function recordWebsiteEvent(event: WebsiteEvent): WebsiteEvent {
  const sanitized = { ...event };
  delete (sanitized as any).visitorName;
  delete (sanitized as any).medicalDetails;
  events.push(sanitized);
  return sanitized;
}

export function getEventsByPage(page: string): WebsiteEvent[] {
  return events.filter((event) => event.page === page);
}

export function getEventsByType(eventType: string): WebsiteEvent[] {
  return events.filter((event) => event.eventType === eventType);
}

export function calculateConversionRate(pageOrForm: string): number {
  const relevant = events.filter((event) => event.page === pageOrForm || event.relatedForm === pageOrForm);
  const views = relevant.filter((event) => /viewed|started/i.test(event.eventType)).length;
  const conversions = relevant.filter((event) => /submitted|requested/i.test(event.eventType) || event.conversionStatus === "Converted").length;
  return views === 0 ? 0 : Math.round((conversions / views) * 100) / 100;
}

export function generateWebsiteAnalyticsSummary(dateRange: { start: string; end: string }) {
  const filtered = events.filter((event) => event.timestamp >= dateRange.start && event.timestamp <= dateRange.end);
  return { totalEvents: filtered.length, topPages: identifyBestConvertingPages(), dropOffPoints: identifyDropOffPoints() };
}

export function identifyBestConvertingPages(): Array<{ page: string; conversionRate: number }> {
  const pages = Array.from(new Set(events.map((event) => event.page)));
  return pages.map((page) => ({ page, conversionRate: calculateConversionRate(page) })).sort((a, b) => b.conversionRate - a.conversionRate);
}

export function identifyDropOffPoints(): Array<{ page: string; formStarts: number; formSubmits: number }> {
  const pages = Array.from(new Set(events.map((event) => event.page)));
  return pages
    .map((page) => ({
      page,
      formStarts: events.filter((event) => event.page === page && event.eventType === "form started").length,
      formSubmits: events.filter((event) => event.page === page && event.eventType === "form submitted").length,
    }))
    .filter((item) => item.formStarts > item.formSubmits);
}

export function clearWebsiteAnalyticsForDemo(): void {
  events.length = 0;
}
