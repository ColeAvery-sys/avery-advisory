import { createPlatformAction, detectRightsRisks, ensureApproved } from "./mediaBaronSafety";

const channels: any[] = [];
const videos: any[] = [];

export function createChannelRecord(channel: any) {
  const stored = { ...channel, status: channel.status || "Draft" };
  channels.push(stored);
  return stored;
}

export function createVideoRecord(video: any) {
  const stored = { ...video, approvalStatus: video.approvalStatus || "Needs Cole Approval", uploadStatus: "Draft", riskWarnings: detectRightsRisks(`${video.videoTitle} ${video.script || ""}`) };
  videos.push(stored);
  return stored;
}

export function generateUploadPackage(video: any) {
  return { titleOptions: generateSeoTitles(video), descriptionDraft: generateDescription(video), tags: generateTags(video), thumbnailBrief: generateThumbnailBrief(video), shorts: generateShortsFromVideo(video), ...createPlatformAction("YouTube upload package", detectRightsRisks(`${video.videoTitle} ${video.script || ""}`)) };
}

export function generateSeoTitles(video: any): string[] {
  return [`${video.videoTitle} | ${video.channelName}`, `Why ${video.targetAudience || "creators"} Need ${video.videoTitle}`, `${video.videoTitle}: Practical Guide`].filter((title) => !/guarantee|fake/i.test(title));
}

export function generateDescription(video: any): string {
  return `${video.videoTitle}. A practical, honest breakdown for ${video.targetAudience || "viewers"}. CTA: ${video.relatedLandingPage || "visit AveryTech"}.`;
}

export function generateTags(video: any): string[] {
  return unique([video.channelName, video.videoType, video.targetAudience, "AveryTech", "Creator Logistics", "ATLAS"].filter(Boolean));
}

export function generateThumbnailBrief(video: any) {
  return { brief: `Readable thumbnail for ${video.videoTitle}. No misleading claims.`, riskWarnings: detectRightsRisks(video.videoTitle || "") };
}

export function generateShortsFromVideo(video: any): any[] {
  return generateSeoTitles(video).map((title, index) => ({ id: `${video.id || "video"}-short-${index + 1}`, hook: title, approvalStatus: "Needs Cole Approval" }));
}

export function markUploadedManually(videoId: string) {
  const video = findVideo(videoId);
  ensureApproved(video.approvalStatus);
  video.uploadStatus = "Uploaded Manually";
  return video;
}

function findVideo(videoId: string) {
  const video = videos.find((entry) => entry.id === videoId);
  if (!video) throw new Error(`Video ${videoId} not found.`);
  return video;
}

function unique(values: string[]): string[] {
  return values.filter((value, index) => values.indexOf(value) === index);
}
