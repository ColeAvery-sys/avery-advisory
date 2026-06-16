export type WatchedFileRecord = {
  id: string;
  path: string;
  category: string;
  watchStatus: "Planned" | "Watching Placeholder" | "Changed" | "Archived";
  sensitivity: "Public" | "Internal" | "Client Confidential" | "Legal/Financial" | "Personal" | "High Risk";
  lastSeen?: string;
  notes?: string;
};

const watchedFiles: WatchedFileRecord[] = [];

export function createWatchedFileRecord(file: WatchedFileRecord): WatchedFileRecord {
  watchedFiles.push(file);
  return file;
}

export function markFileWatcherPlaceholderActive(id: string): WatchedFileRecord {
  const file = findWatchedFile(id);
  file.watchStatus = "Watching Placeholder";
  file.lastSeen = new Date().toISOString();
  return file;
}

export function recordLocalFileChange(id: string, notes: string): WatchedFileRecord {
  const file = findWatchedFile(id);
  file.watchStatus = "Changed";
  file.notes = notes;
  file.lastSeen = new Date().toISOString();
  return file;
}

export function getSensitiveWatchedFiles(): WatchedFileRecord[] {
  return watchedFiles.filter((file) => file.sensitivity !== "Public" && file.sensitivity !== "Internal");
}

export function clearLocalFileWatcherForDemo(): void {
  watchedFiles.length = 0;
}

function findWatchedFile(id: string): WatchedFileRecord {
  const file = watchedFiles.find((item) => item.id === id);
  if (!file) throw new Error(`Watched file ${id} not found.`);
  return file;
}
