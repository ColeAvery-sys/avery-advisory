export type CrossPromoRecord = {
  id: string;
  sourceBrand: string;
  sourcePlatform: string;
  sourceContent?: string;
  targetBrand: string;
  targetOffer: string;
  targetLandingPage: string;
  CTA: string;
  audienceFit: number;
  riskLevel?: string;
  expectedValue: number;
  status?: string;
};

const crossPromos: CrossPromoRecord[] = [];

export function createCrossPromoRecord(record: CrossPromoRecord): CrossPromoRecord {
  const stored = { ...record, status: record.status || "Draft", riskLevel: record.riskLevel || identifyBrandConfusionRisk([record]).riskLevel };
  crossPromos.push(stored);
  return stored;
}

export function generateCrossPromoPlan(brandOrCampaign: Record<string, any>) {
  const sourceBrand = brandOrCampaign.brandName || brandOrCampaign.campaignName || "AveryTech";
  return {
    sourceBrand,
    routes: crossPromos.filter((record) => record.sourceBrand === sourceBrand || record.targetBrand === sourceBrand).sort((a, b) => b.expectedValue - a.expectedValue),
    approvalRequired: true,
  };
}

export function generateCTASet(targetOffer: string): string[] {
  return [`Start with ${targetOffer}`, `Learn more about ${targetOffer}`, `Request ${targetOffer} info`];
}

export function identifyBestTrafficRoute(data: { records?: CrossPromoRecord[] }) {
  const records = data.records || crossPromos;
  return records.slice().sort((a, b) => b.expectedValue * b.audienceFit - a.expectedValue * a.audienceFit)[0];
}

export function identifyBrandConfusionRisk(plan: CrossPromoRecord[]) {
  const brandCount = unique(plan.reduce((brands: string[], item) => brands.concat(item.sourceBrand, item.targetBrand), []));
  const ctaCount = unique(plan.map((item) => item.CTA));
  return { riskLevel: brandCount.length > 3 || ctaCount.length > 3 ? "High" : "Low", reason: "Avoid confusing audiences or pushing too many offers at once." };
}

export function createContentCalendarItemsFromPlan(plan: CrossPromoRecord[]) {
  return plan.map((item, index) => ({ id: `cross-promo-content-${index + 1}`, title: `${item.sourceBrand} to ${item.targetOffer}`, CTA: item.CTA, platform: item.sourcePlatform, approvalRequired: true }));
}

function unique(values: string[]): string[] {
  return values.filter((value, index) => values.indexOf(value) === index);
}
