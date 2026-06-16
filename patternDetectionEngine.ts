import { confidenceFromEvidence, countBy, createIntelligenceGate } from "./companyIntelligenceSafety";

export function detectCompanyPatterns(data: any) {
  const patterns = [
    ...detectRevenuePatterns(data.revenue || []),
    ...detectContentPatterns(data.content || []),
    ...detectClientPatterns(data.clients || []),
    ...detectGrantPatterns(data.grants || []),
  ];
  return { patterns, recommendedActions: patterns.map((pattern) => pattern.recommendation), ...createIntelligenceGate("Pattern detection", confidenceFromEvidence(patterns.length)) };
}

export function detectRevenuePatterns(records: any[]) {
  const bySource = countBy(records, (record: any) => record.source || record.channel);
  return Object.entries(bySource).filter(([, count]) => count >= 2).map(([source, count]) => ({ patternTitle: `Revenue repeats from ${source}`, frequency: count, confidence: confidenceFromEvidence(count), recommendation: `Increase attention on ${source}.` }));
}

export function detectContentPatterns(records: any[]) {
  const winners = records.filter((record) => Number(record.views || record.leads || 0) > Number(record.baseline || 0));
  const byTopic = countBy(winners, (record: any) => record.topic || record.contentType);
  return Object.entries(byTopic).filter(([, count]) => count >= 2).map(([topic, count]) => ({ patternTitle: `Content topic performing: ${topic}`, frequency: count, confidence: confidenceFromEvidence(count), recommendation: `Make more content around ${topic}.` }));
}

export function detectClientPatterns(records: any[]) {
  return records.filter((record) => /complaint|slow communication|missing update/i.test(record.notes || "")).length >= 2
    ? [{ patternTitle: "Client complaints mention communication speed", frequency: 2, confidence: 0.65, recommendation: "Add automated status update drafts to client workflow." }]
    : [];
}

export function detectGrantPatterns(records: any[]) {
  return records.filter((record) => /budget|narrative|missing/i.test(record.notes || "")).length >= 2
    ? [{ patternTitle: "Grant work stalls on missing docs", frequency: 2, confidence: 0.65, recommendation: "Create grant packet completeness checklist before drafting." }]
    : [];
}

