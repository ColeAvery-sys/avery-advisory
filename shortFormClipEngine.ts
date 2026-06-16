export type ClipIdea = {
  id: string;
  clipTitle: string;
  sourceContent: string;
  platform: string;
  hook: string;
  script: string;
  caption: string;
  visualDirection: string;
  CTA: string;
  status: string;
  approvalStatus: "Needs Cole Approval" | "Approved";
  relatedCampaign?: string;
  relatedLandingPage?: string;
  reviewLevel?: "Standard" | "High Review";
  riskFlags?: string[];
};

const clips: ClipIdea[] = [];

export function createClipIdea(input: Partial<ClipIdea>): ClipIdea {
  const clip: ClipIdea = {
    id: input.id || `clip-${clips.length + 1}`,
    clipTitle: input.clipTitle || "Untitled clip",
    sourceContent: input.sourceContent || "Manual idea",
    platform: input.platform || "YouTube Shorts",
    hook: input.hook || "The problem is not effort. It is the missing system.",
    script: input.script || "Name the pain, show the system, and point to the next step.",
    caption: input.caption || "Build the system before the panic.",
    visualDirection: input.visualDirection || "Dark AveryTech caption-first founder clip",
    CTA: input.CTA || input.relatedLandingPage || "Request a demo",
    status: input.status || "Draft",
    approvalStatus: input.approvalStatus || "Needs Cole Approval",
    relatedCampaign: input.relatedCampaign,
    relatedLandingPage: input.relatedLandingPage,
  };
  clip.riskFlags = detectClipRiskFlags(clip);
  clip.reviewLevel = clip.riskFlags.length > 0 ? "High Review" : "Standard";
  clips.push(clip);
  return clip;
}

export function generateClipBatch(sourceContent: string, count: number): ClipIdea[] {
  const safeCount = Math.max(1, Math.min(count, 25));
  return Array.from({ length: safeCount }, (_, index) =>
    createClipIdea({
      clipTitle: `Clip ${index + 1}: ${sourceContent}`,
      sourceContent,
      hook: generateHookVariations({ clipTitle: sourceContent } as ClipIdea)[index % 3],
      script: `Use ${sourceContent} to make one practical point, then invite the viewer to the next step.`,
      CTA: "Visit the related landing page",
    }),
  );
}

export function generateHookVariations(clip: ClipIdea): string[] {
  return [
    `You do not need more chaos. You need a system for ${clip.clipTitle}.`,
    `This is why ${clip.clipTitle} keeps getting stuck.`,
    `Here is the calmer way to handle ${clip.clipTitle}.`,
  ];
}

export function generateCaptionVariations(clip: ClipIdea): string[] {
  return [
    `${clip.clipTitle}. Drafted for approval before posting.`,
    `A practical system beats panic. ${clip.CTA}`,
    `Save this if ${clip.clipTitle.toLowerCase()} is on your list this week.`,
  ];
}

export function generateVisualDirections(clip: ClipIdea): string[] {
  return [
    "Talking head with dark AveryTech captions and one CTA end card",
    "Screen recording plus clean text overlays",
    "Founder note style with B-roll and restrained motion",
  ];
}

export function sendClipBatchToApproval(batch: ClipIdea[]) {
  return batch.map((clip) => ({
    id: `approval-${clip.id}`,
    title: `Approve public clip: ${clip.clipTitle}`,
    actionType: "Public content approval",
    approvalRequired: true,
    riskLevel: clip.reviewLevel === "High Review" ? "High" : "Medium",
    reason: "ATLAS cannot publish public content automatically.",
  }));
}

export function clearClipsForDemo(): void {
  clips.length = 0;
}

function detectClipRiskFlags(clip: ClipIdea): string[] {
  const text = `${clip.clipTitle} ${clip.script} ${clip.caption}`.toLowerCase();
  const flags: string[] = [];
  if (/client|testimonial|case study/.test(text)) flags.push("client claim");
  if (/disability|medical|therapy|diagnosis|clinical/.test(text)) flags.push("disability or medical-adjacent claim");
  if (/grant|funding|money|revenue|guarantee/.test(text)) flags.push("money or funding claim");
  if (/politic|capitalism|class|labor|leftist/.test(text)) flags.push("political claim");
  return flags;
}
