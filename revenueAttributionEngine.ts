export type RevenueRecord = { revenueId: string; amount: number; source: string; campaign?: string; platform?: string; landingPage?: string; offer?: string; clientOrCustomer?: string; confidence?: string; date: string; notes?: string; linkedCampaignId?: string; revenueType?: string };
const revenueRecords: RevenueRecord[] = [];

export function createRevenueRecord(record: RevenueRecord): RevenueRecord {
  const stored = { ...record, confidence: record.confidence || calculateAttributionConfidence(record) };
  revenueRecords.push(stored);
  return stored;
}

export function linkRevenueToCampaign(revenueId: string, campaignId: string): RevenueRecord {
  const record = findRevenue(revenueId);
  record.linkedCampaignId = campaignId;
  return record;
}

export function calculateRevenueBySource(data: { records?: RevenueRecord[] }) {
  const records = data.records || revenueRecords;
  return records.reduce((totals: Record<string, number>, record) => {
    const key = record.revenueType === "Grant" ? "Grant/Funding" : record.source;
    totals[key] = (totals[key] || 0) + record.amount;
    return totals;
  }, {});
}

export function calculateAttributionConfidence(record: RevenueRecord): string {
  if (record.source && record.landingPage && record.offer && record.clientOrCustomer) return "Confirmed";
  if (record.source && (record.campaign || record.offer)) return "Likely";
  if (record.source) return "Possible";
  return "Unknown";
}

export function generateAttributionReport(dateRange: { start: string; end: string }) {
  const records = revenueRecords.filter((record) => record.date >= dateRange.start && record.date <= dateRange.end);
  return { dateRange, revenueBySource: calculateRevenueBySource({ records }), bestRevenueChannel: identifyBestRevenueChannel({ records }), vanityMetrics: identifyVanityMetrics({ records }), note: "Confirmed, likely, possible, and unknown attribution are separated. Grants are separate from sales revenue." };
}

export function identifyBestRevenueChannel(data: { records?: RevenueRecord[] }) {
  const totals = calculateRevenueBySource(data);
  return Object.keys(totals).map((source) => ({ source, amount: totals[source] })).sort((a, b) => b.amount - a.amount)[0];
}

export function identifyVanityMetrics(data: Record<string, any>) {
  const metrics = data.metrics || [];
  return metrics.filter((metric: any) => (metric.views || metric.likes || metric.comments) && !metric.revenue && !metric.leads).map((metric: any) => ({ platform: metric.platform, warning: "Engagement without revenue or leads is a vanity metric." }));
}

function findRevenue(revenueId: string): RevenueRecord {
  const record = revenueRecords.find((entry) => entry.revenueId === revenueId);
  if (!record) throw new Error(`Revenue ${revenueId} not found.`);
  return record;
}
