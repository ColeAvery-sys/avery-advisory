import { createStudioGate, readinessScore } from "./contentStudioSafety";

const captions: any[] = [];

export function createCaptionProject(caption: any) {
  const stored = { ...caption, ...createStudioGate("Captions/subtitles"), status: caption.status || "Draft", QAStatus: caption.QAStatus || "Not Run" };
  captions.push(stored);
  return stored;
}

export function importTranscript(captionId: string, transcript: string) {
  const caption = findCaption(captionId);
  caption.transcript = transcript;
  caption.status = "Transcript Imported";
  return caption;
}

export function generateSrtPlaceholder(captionId: string) {
  const caption = findCaption(captionId);
  const text = caption.transcript || "Caption text pending.";
  return `1\n00:00:00,000 --> 00:00:04,000\n${text.slice(0, 80)}\n`;
}

export function generateShortFormCaptionText(captionId: string) {
  const caption = findCaption(captionId);
  return String(caption.transcript || "").split(/[.!?]/).filter(Boolean).slice(0, 3).map((line) => line.trim());
}

export function runCaptionQa(captionId: string) {
  const caption = findCaption(captionId);
  const text = String(caption.transcript || "");
  const issues: string[] = [];
  if (!text) issues.push("transcript missing");
  if (/internal|private|confidential|profit margin/i.test(text)) issues.push("sensitive internal info");
  if (text.length > 2200 && /instagram|short|tiktok/i.test(caption.platform || "")) issues.push("platform length risk");
  if (text.split(/\s+/).some((word) => word.length > 28)) issues.push("readability risk");
  caption.QAStatus = issues.length ? "Failed" : "Passed";
  return { captionId, QAStatus: caption.QAStatus, issues, readabilityScore: readinessScore([!!text, issues.length === 0, text.length < 5000]) };
}

export function exportCaptionFile(captionId: string, format: string) {
  const caption = findCaption(captionId);
  if (caption.QAStatus !== "Passed") throw new Error("Caption QA must pass before export.");
  return { fileName: `${caption.projectTitle || captionId}.${format.toLowerCase()}`, format, content: format.toUpperCase() === "SRT" ? generateSrtPlaceholder(captionId) : caption.transcript };
}

export function sendCaptionsToEditPlanner(captionId: string) {
  const caption = findCaption(captionId);
  return { projectTitle: caption.projectTitle, captionStatus: caption.QAStatus, fileFormat: caption.fileFormat || "SRT", approvalRequired: true };
}

function findCaption(captionId: string) {
  const caption = captions.find((entry) => entry.id === captionId || entry.captionId === captionId);
  if (!caption) throw new Error(`Caption project ${captionId} not found.`);
  return caption;
}

