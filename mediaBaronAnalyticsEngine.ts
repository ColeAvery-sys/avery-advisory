const metrics: any[] = [];

export function recordPlatformMetric(metric: any) {
  const stored = { ...metric, id: metric.id || `metric-${metrics.length + 1}` };
  metrics.push(stored);
  return stored;
}

export function calculatePlatformPerformance(platform: string, dateRange: { start: string; end: string }) {
  const rows = metrics.filter((metric) => metric.platform === platform && metric.date >= dateRange.start && metric.date <= dateRange.end);
  return summarizeRows(platform, rows);
}

export function calculateRevenueByPlatform(data: any) {
  return (data.metrics || metrics).reduce((totals: Record<string, number>, metric: any) => {
    totals[metric.platform] = (totals[metric.platform] || 0) + (metric.revenue || 0);
    return totals;
  }, {});
}

export function identifyBestPlatform(data: any) {
  const rows = data.metrics || metrics;
  const summaries = unique(rows.map((row: any) => row.platform)).map((platform) => summarizeRows(platform, rows.filter((row: any) => row.platform === platform)));
  return summaries.sort((a, b) => b.revenue + b.leads * 50 - (a.revenue + a.leads * 50))[0];
}

export function identifyWorstPlatform(data: any) {
  const rows = data.metrics || metrics;
  const summaries = unique(rows.map((row: any) => row.platform)).map((platform) => summarizeRows(platform, rows.filter((row: any) => row.platform === platform)));
  return summaries.sort((a, b) => a.revenue + a.leads * 50 - (b.revenue + b.leads * 50))[0];
}

export function recommendNextPlatformMove(data: any): string {
  const best = identifyBestPlatform(data);
  if (!best) return "Collect more platform data before making a move.";
  return `Double down on ${best.platform} with approval-ready content, but do not over-credit weak evidence.`;
}

export function generateMediaEmpireReport(data: any) {
  const rows = data.metrics || metrics;
  return { revenueByPlatform: calculateRevenueByPlatform({ metrics: rows }), bestPlatform: identifyBestPlatform({ metrics: rows }), worstPlatform: identifyWorstPlatform({ metrics: rows }), recommendation: recommendNextPlatformMove({ metrics: rows }), attributionNote: "Separate revenue, leads, engagement, and vanity metrics. Evidence is directional unless conversion path is clear." };
}

export function saveFindingsToLessonsLearned(report: any) {
  return { lessonTitle: "Media Baron platform finding", summary: report.recommendation, confidence: report.bestPlatform && report.bestPlatform.leads + report.bestPlatform.revenue > 0 ? "Medium" : "Low" };
}

function summarizeRows(platform: string, rows: any[]) {
  return { platform, views: sum(rows, "views"), leads: sum(rows, "leads"), revenue: sum(rows, "revenue"), engagement: sum(rows, "engagement"), vanityMetrics: sum(rows, "likes") + sum(rows, "favorites") };
}

function sum(rows: any[], key: string): number {
  return rows.reduce((total, row) => total + (row[key] || 0), 0);
}

function unique(values: string[]): string[] {
  return values.filter((value, index) => values.indexOf(value) === index);
}
