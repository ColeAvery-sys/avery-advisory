export type CampaignRecord = {
  id: string;
  campaignName: string;
  campaignType: string;
  goal: string;
  targetAudience: string;
  offer: string;
  landingPage: string;
  coreMessage: string;
  contentPillars: string[];
  channels: string[];
  startDate: string;
  endDate: string;
  targetKPIs: string[];
  status: string;
  approvalStatus: "Needs Cole Approval" | "Approved";
};

const campaigns: CampaignRecord[] = [];

export function createCampaign(campaign: CampaignRecord): CampaignRecord {
  if (!/lead|credibility|funding|sales|demo|interest|trust|client|revenue/i.test(campaign.goal)) {
    throw new Error("Campaign goal should connect to leads, credibility, funding, or sales.");
  }
  campaigns.push({ ...campaign, approvalStatus: campaign.approvalStatus || "Needs Cole Approval" });
  return campaigns[campaigns.length - 1];
}

export function generateCampaignStrategy(campaign: CampaignRecord) {
  return {
    campaignName: campaign.campaignName,
    target: campaign.targetAudience,
    strategy: `Use ${campaign.channels.join(", ")} to move ${campaign.targetAudience} toward ${campaign.offer} at ${campaign.landingPage}.`,
    measurement: campaign.targetKPIs,
    safety: "Avoid hype claims without evidence. Public content requires Cole approval.",
    reasoning: [
      "Campaigns should drive leads, credibility, funding, or sales.",
      "The CTA is tied to a landing page so traffic can be measured.",
    ],
  };
}

export function generateContentPillars(campaign: CampaignRecord): string[] {
  return campaign.contentPillars.length ? campaign.contentPillars : ["Pain", "Proof", "Process", "Offer", "Founder POV"];
}

export function generateThirtyDayContentPlan(campaign: CampaignRecord) {
  const pillars = generateContentPillars(campaign);
  const channels = campaign.channels.length ? campaign.channels : ["LinkedIn"];
  return Array.from({ length: 30 }, (_, index) => ({
    day: index + 1,
    pillar: pillars[index % pillars.length],
    channel: channels[index % channels.length],
    title: `${campaign.campaignName} day ${index + 1}: ${pillars[index % pillars.length]}`,
    cta: campaign.landingPage,
    approvalRequired: true,
  }));
}

export function generateCtas(campaign: CampaignRecord): string[] {
  return [
    `Visit ${campaign.landingPage}`,
    `Request ${campaign.offer}`,
    "Ask AveryTech for a review",
    "Join the interest list",
  ];
}

export function createContentItemsFromCampaign(campaign: CampaignRecord) {
  const channels = campaign.channels.length ? campaign.channels : ["LinkedIn"];
  return generateContentPillars(campaign).map((pillar, index) => ({
    id: `${campaign.id}-content-${index + 1}`,
    title: `${campaign.campaignName}: ${pillar}`,
    campaign: campaign.campaignName,
    platform: channels[index % channels.length],
    callToAction: campaign.landingPage,
    approvalRequired: true,
    reviewLevel: /grant|disability|legal|finance|client/i.test(`${campaign.campaignType} ${pillar}`) ? "High Review" : "Standard",
  }));
}

export function clearCampaignsForDemo(): void {
  campaigns.length = 0;
}
