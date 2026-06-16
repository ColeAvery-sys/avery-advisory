import { connectorLog, detectConnectorRisks, ensureApproval, requireFields, rightsClear } from "./platformConnectorSafety";

const videos: any[] = [];
const youtubeLogs: any[] = [];

export function validateYouTubeUploadPackage(video: any) {
  const missing = requireFields(video, ["videoId", "channelName", "videoTitle", "description"]);
  const risks = detectConnectorRisks(`${video.videoTitle} ${video.description || ""} ${(video.tags || []).join(" ")}`);
  const errors = missing.map((field) => `${field} missing`).concat(risks);
  if (!rightsClear(video.rightsStatus)) errors.push("rights/copyright risk must be cleared");
  if (video.approvalStatus !== "Approved") errors.push("public upload requires Cole approval");
  if (/shocking|must watch|guaranteed/i.test(video.selectedTitle || video.videoTitle)) errors.push("title may be misleading");
  return { valid: errors.length === 0, errors, approvalRequired: true };
}

export function generateYouTubeUploadPackage(video: any) {
  const validation = validateYouTubeUploadPackage(video);
  if (!validation.valid) throw new Error(validation.errors.join("; "));
  const packet = { ...video, exportStatus: "Upload Package Ready", manualUploadOnly: true };
  videos.push(packet);
  logYouTubePackageAction({ videoId: video.videoId, action: "generate upload package", status: "Ready" });
  return packet;
}

export function exportDescriptionTxt(video: any) {
  return generateYouTubeUploadPackage(video).description;
}

export function exportTagsTxt(video: any) {
  return (generateYouTubeUploadPackage(video).tags || []).join(", ");
}

export function generateShortsPlan(video: any) {
  return { videoId: video.videoId, shorts: (video.shortsToExtract || ["hook", "best quote", "CTA"]).map((item: string, index: number) => ({ title: `Short ${index + 1}: ${item}`, approvalRequired: true })) };
}

export function markYouTubeUploadedManually(videoId: string, url: string, approval?: { approvedByCole?: boolean }) {
  ensureApproval(approval, "Cole approval required before logging YouTube manual upload.");
  const video = videos.find((entry) => entry.videoId === videoId);
  if (!video) throw new Error(`YouTube video ${videoId} package not exported.`);
  video.uploadedUrl = url;
  video.exportStatus = "Uploaded Manually";
  return video;
}

export function logYouTubePackageAction(action: any) {
  const log = connectorLog({ platform: "YouTube", ...action });
  youtubeLogs.push(log);
  return log;
}

