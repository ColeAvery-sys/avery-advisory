export type VideoProject = {
  id: string;
  videoTitle: string;
  channel: string;
  concept: string;
  targetAudience: string;
  purpose: string;
  status: string;
  hook?: string;
  outline?: string[];
  scriptDraft?: string;
  bRollIdeas?: string[];
  sponsorSlot?: string;
  thumbnailIdeas?: string[];
  titleOptions?: string[];
  descriptionDraft?: string;
  tags?: string[];
  pinnedCommentDraft?: string;
  shortsToExtract?: string[];
  approvalStatus: "Needs Cole Approval" | "Approved";
  landingPage?: string;
};

const videos: VideoProject[] = [];

export function createVideoProject(video: VideoProject): VideoProject {
  videos.push({ ...video, approvalStatus: video.approvalStatus || "Needs Cole Approval" });
  return videos[videos.length - 1];
}

export function generateVideoOutline(video: VideoProject): string[] {
  return [
    "Hook",
    `Problem: ${video.concept}`,
    `Why ${video.targetAudience} should care`,
    "Practical framework",
    "Evidence or example without exaggeration",
    `CTA: ${video.landingPage || "Request a demo"}`,
  ];
}

export function generateHookOptions(video: VideoProject): string[] {
  return [
    `Most people misunderstand ${video.concept}.`,
    `The real problem with ${video.concept} is not effort. It is missing systems.`,
    `Here is the practical version of ${video.concept}.`,
  ];
}

export function generateTitleOptions(video: VideoProject): string[] {
  return [
    `${video.concept}: A Practical Breakdown`,
    `Why ${video.targetAudience} Need Better Systems`,
    `${video.videoTitle} | AveryTech`,
  ];
}

export function generateThumbnailConcepts(video: VideoProject): string[] {
  return [
    `Dark tech background with a clear ${video.concept} phrase`,
    "Founder portrait plus one restrained claim",
    "Greek-tech visual metaphor with one readable title line",
  ];
}

export function generateUploadPackage(video: VideoProject) {
  return {
    titleOptions: generateTitleOptions(video),
    descriptionDraft: `${video.purpose}. CTA: ${video.landingPage || "Request a demo"}. Claims should be checked before publishing.`,
    tags: [video.channel, video.targetAudience, "AveryTech"],
    pinnedCommentDraft: `Learn more: ${video.landingPage || "AveryTech demo request"}`,
    approvalRequired: true,
    approvalStatus: "Needs Cole Approval",
    publishStatus: "Do Not Publish Automatically",
  };
}

export function generateShortsFromVideo(video: VideoProject): string[] {
  return generateHookOptions(video).map((hook, index) => `${index + 1}. ${hook} CTA: ${video.landingPage || "learn more"}`);
}

export function clearVideoProjectsForDemo(): void {
  videos.length = 0;
}
