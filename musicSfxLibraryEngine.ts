import { createStudioGate, rightsClear } from "./contentStudioSafety";

const audioRecords: any[] = [];

export function createAudioRecord(audio: any) {
  const stored = { ...audio, ...createStudioGate("Music/SFX audio"), status: audio.status || "Available" };
  audioRecords.push(stored);
  return stored;
}

export function checkAudioRights(audioId: string) {
  const audio = findAudio(audioId);
  const allowed = rightsClear(audio.licenseType) && audio.commercialUseAllowed !== false && !audio.publicUseBlocked;
  return { audioId, allowed, attributionRequired: !!audio.attributionRequired, rightsProof: audio.rightsProof || "Missing", reason: allowed ? "Audio appears usable with listed terms." : "Unknown or restricted rights block public/commercial use." };
}

export function generateAudioUsageNotes(audioId: string) {
  const audio = findAudio(audioId);
  return { audioName: audio.audioName, mood: audio.mood, BPM: audio.BPM, attribution: audio.attributionRequired ? "Attribution required and must be visible." : "No attribution marked.", clientSafe: checkAudioRights(audioId).allowed };
}

export function attachAudioToProject(audioId: string, projectId: string) {
  const audio = findAudio(audioId);
  if (!checkAudioRights(audioId).allowed) throw new Error("Audio rights must be clear before attaching to public/client project.");
  audio.relatedProject = projectId;
  return audio;
}

export function flagUnknownAudioRights(audioId: string) {
  const audio = findAudio(audioId);
  audio.licenseType = "Unknown";
  audio.publicUseBlocked = true;
  return audio;
}

export function blockPublicAudioUse(audioId: string) {
  const audio = findAudio(audioId);
  audio.publicUseBlocked = true;
  audio.status = "Blocked for Public Use";
  return audio;
}

function findAudio(audioId: string) {
  const audio = audioRecords.find((entry) => entry.id === audioId || entry.audioId === audioId);
  if (!audio) throw new Error(`Audio ${audioId} not found.`);
  return audio;
}

