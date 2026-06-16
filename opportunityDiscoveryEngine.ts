import { confidenceFromEvidence, countBy, createIntelligenceGate } from "./companyIntelligenceSafety";

export function discoverOpportunities(data: any) {
  const requests = [...(data.clientRequests || []), ...(data.comments || []), ...(data.salesNotes || []), ...(data.supportMessages || [])];
  return {
    revenueOpportunities: discoverByKeyword(requests, "thumbnail", "Create Thumbnail Service"),
    grantOpportunities: discoverByKeyword(requests, "accessibility", "Use repeated accessibility demand as grant evidence"),
    contentOpportunities: discoverByTopic(requests),
    automationOpportunities: discoverByKeyword(requests, "status update", "Automate client status updates"),
    hiringOpportunities: discoverByKeyword(requests, "editing backlog", "Consider editor capacity"),
    ...createIntelligenceGate("Opportunity discovery", confidenceFromEvidence(requests.length)),
  };
}

export function identifyRevenueOpportunities(data: any) {
  return discoverOpportunities(data).revenueOpportunities;
}

export function identifyGrantOpportunities(data: any) {
  return discoverOpportunities(data).grantOpportunities;
}

export function identifyContentOpportunities(data: any) {
  return discoverOpportunities(data).contentOpportunities;
}

export function identifyAutomationOpportunities(data: any) {
  return discoverOpportunities(data).automationOpportunities;
}

export function identifyHiringOpportunities(data: any) {
  return discoverOpportunities(data).hiringOpportunities;
}

export function rankOpportunities(opportunities: any[]) {
  return opportunities.slice().sort((a, b) => (b.frequency || 0) * (b.value || 1) - (a.frequency || 0) * (a.value || 1));
}

function discoverByKeyword(records: any[], keyword: string, recommendation: string) {
  const matches = records.filter((record) => JSON.stringify(record).toLowerCase().indexOf(keyword) >= 0);
  return matches.length ? [{ recommendation, frequency: matches.length, evidence: matches.map((record) => record.id || record.title || record.text || "record") }] : [];
}

function discoverByTopic(records: any[]) {
  return Object.entries(countBy(records, (record: any) => record.topic || record.category)).filter(([, count]) => count >= 2).map(([topic, count]) => ({ recommendation: `Create content about ${topic}`, frequency: count, topic }));
}
