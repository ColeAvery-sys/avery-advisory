export type BrandRecord = {
  id: string;
  brandName: string;
  parentCompany?: string;
  brandType: string;
  mission: string;
  audience: string;
  tone?: string;
  visualStyle?: string;
  mainOffers?: string[];
  platforms?: string[];
  products?: string[];
  relatedLandingPages?: string[];
  relatedContentPillars?: string[];
  monetizationPaths?: string[];
  riskFlags?: string[];
  priorityLevel?: string;
  status?: string;
};

const brands: BrandRecord[] = [];

export function createBrandRecord(brand: BrandRecord): BrandRecord {
  const stored = { ...brand, status: brand.status || "Active", priorityLevel: brand.priorityLevel || "Medium" };
  brands.push(stored);
  return stored;
}

export function updateBrandRecord(brandId: string, updates: Partial<BrandRecord>): BrandRecord {
  const brand = findBrand(brandId);
  Object.assign(brand, updates);
  return brand;
}

export function generateBrandBrief(brandId: string) {
  const brand = findBrand(brandId);
  return {
    brandName: brand.brandName,
    mission: brand.mission,
    audience: brand.audience,
    tone: brand.tone || "Direct and useful",
    offers: brand.mainOffers || [],
    safetyNote: "Public-facing brand changes require Cole approval.",
  };
}

export function generatePlatformPlan(brandId: string) {
  const brand = findBrand(brandId);
  return (brand.platforms || ["Website"]).map((platform) => ({
    platform,
    purpose: platformPurpose(platform, brand),
    approvalRequired: true,
  }));
}

export function generateOfferMap(brandId: string) {
  const brand = findBrand(brandId);
  return (brand.mainOffers || []).map((offer) => ({ offer, landingPages: brand.relatedLandingPages || [], monetizationPaths: brand.monetizationPaths || [] }));
}

export function generateContentPillars(brandId: string): string[] {
  const brand = findBrand(brandId);
  return brand.relatedContentPillars && brand.relatedContentPillars.length
    ? brand.relatedContentPillars
    : ["problem", "process", "proof", "offer", "mission"];
}

export function scoreBrandPriority(brandId: string, data: Record<string, any>) {
  const brand = findBrand(brandId);
  const revenue = data.revenue || 0;
  const strategicValue = data.strategicValue || 5;
  const distractionRisk = data.distractionRisk || (brand.brandType === "Experimental Brand" ? 8 : 4);
  const experimentalPenalty = brand.brandType === "Experimental Brand" && !data.coleApprovedPriority ? 25 : 0;
  const score = Math.max(0, Math.min(100, Math.round(revenue / 100 + strategicValue * 8 - distractionRisk * 4 - experimentalPenalty)));
  return {
    score,
    priorityLabel: score >= 65 ? "High" : score >= 45 ? "Medium" : "Low",
    reason: "Brands are ranked by revenue, strategic value, and distraction risk. Experimental brands need approval to outrank cash-flow brands.",
  };
}

function findBrand(brandId: string): BrandRecord {
  const brand = brands.find((entry) => entry.id === brandId);
  if (!brand) throw new Error(`Brand ${brandId} not found.`);
  return brand;
}

function platformPurpose(platform: string, brand: BrandRecord): string {
  if (/youtube/i.test(platform)) return "authority and content discovery";
  if (/etsy|amazon|merch|teespring/i.test(platform)) return "product sales";
  if (/website|landing/i.test(platform)) return "conversion and trust";
  return `${brand.brandName} audience development`;
}
