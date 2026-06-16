export type ContentStatus =
  | "Idea"
  | "Brief"
  | "Drafting"
  | "Needs Assets"
  | "Needs Cole Review"
  | "Approved"
  | "Scheduled Manually"
  | "Published Manually"
  | "Archived";

export type ContentItem = {
  id: string;
  title: string;
  brand: string;
  platform: string;
  contentType: string;
  campaign?: string;
  status: ContentStatus;
  publishDate?: string;
  approvalStatus: "Not Required" | "Needs Cole Approval" | "Approved";
  scriptDraft?: string;
  captionDraft?: string;
  assetLinks: string[];
  callToAction: string;
  relatedProduct?: string;
  relatedOffer?: string;
  relatedLandingPage?: string;
  notes?: string;
  reviewLevel?: "Standard" | "High Review";
  riskFlags?: string[];
};

const contentItems: ContentItem[] = [];

export function createContentItem(item: ContentItem): ContentItem {
  const riskFlags = detectContentRiskFlags(item);
  const stored: ContentItem = {
    ...item,
    riskFlags,
    reviewLevel: riskFlags.length > 0 ? "High Review" : "Standard",
    approvalStatus: item.approvalStatus === "Approved" ? "Approved" : "Needs Cole Approval",
  };
  contentItems.push(stored);
  return stored;
}

export function updateContentStatus(itemId: string, status: ContentStatus): ContentItem {
  const item = findItem(itemId);
  if (status === "Published Manually" && item.approvalStatus !== "Approved") {
    throw new Error("Cole approval required before public content can be marked published.");
  }
  item.status = status;
  return item;
}

export function getContentByBrand(brand: string): ContentItem[] {
  return contentItems.filter((item) => item.brand === brand);
}

export function getContentByPlatform(platform: string): ContentItem[] {
  return contentItems.filter((item) => item.platform === platform);
}

export function getContentNeedingApproval(): ContentItem[] {
  return contentItems.filter((item) => item.approvalStatus !== "Approved" && item.status !== "Archived");
}

export function generateCalendarFromCampaign(campaign: Record<string, any>): ContentItem[] {
  const pillars: string[] = campaign.contentPillars || ["Problem", "Proof", "Offer"];
  const channels: string[] = campaign.channels || ["LinkedIn"];
  return pillars.map((pillar, index) =>
    createContentItem({
      id: `${slug(campaign.campaignName || "campaign")}-${index + 1}`,
      title: `${pillar} post`,
      brand: campaign.brand || "AveryTech",
      platform: channels[index % channels.length],
      contentType: channels[index % channels.length] === "Blog/SEO" ? "Blog Post" : "Social Post",
      campaign: campaign.campaignName,
      status: "Brief",
      approvalStatus: "Needs Cole Approval",
      assetLinks: [],
      callToAction: campaign.landingPage || campaign.offer || "Request a Demo",
      relatedLandingPage: campaign.landingPage,
      notes: "Generated from campaign. Publish manually only after Cole approval.",
    }),
  );
}

export function markPublishedManually(itemId: string): ContentItem {
  return updateContentStatus(itemId, "Published Manually");
}

export function clearContentCalendarForDemo(): void {
  contentItems.length = 0;
}

function detectContentRiskFlags(item: ContentItem): string[] {
  const text = `${item.title} ${item.scriptDraft || ""} ${item.captionDraft || ""} ${item.notes || ""} ${item.contentType}`.toLowerCase();
  const flags: string[] = [];
  if (/client|testimonial|case study/.test(text)) flags.push("client claim requires evidence and permission");
  if (/grant|funder|funding/.test(text)) flags.push("funding claim requires review");
  if (/disability|medical|clinical|therapy|diagnosis/.test(text)) flags.push("disability or medical-adjacent claim requires review");
  if (/legal|finance|tax|contract|invoice/.test(text)) flags.push("legal or financial content requires review");
  if (/politic|capitalism|leftist|class|labor/.test(text)) flags.push("political content requires review");
  return flags;
}

function findItem(itemId: string): ContentItem {
  const item = contentItems.find((entry) => entry.id === itemId);
  if (!item) throw new Error(`Content item ${itemId} not found.`);
  return item;
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
