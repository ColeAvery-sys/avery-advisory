export type FileRecord = {
  id: string;
  fileName: string;
  fileType: string;
  category: string;
  recommendedPath: string;
  sensitive: boolean;
  status: "Tracked" | "Missing" | "Verified";
  relatedGrant?: string;
  relatedClient?: string;
  relatedEvidence?: string;
};

const files: FileRecord[] = [];

export function generateFolderStructure(companyName: string): string[] {
  return ["00_Inbox", "01_Action_Center", "02_Grants", "03_Clients", "04_Products", "05_Finance", "06_Legal", "07_Evidence_Locker", "08_Archive"].map((folder) => `${companyName}/${folder}`);
}

export function createFileRecord(file: Omit<FileRecord, "sensitive" | "status"> & Partial<Pick<FileRecord, "sensitive" | "status">>): FileRecord {
  const sensitive = file.sensitive ?? /legal|finance|financial|client|personal|tax|contract/i.test(`${file.category} ${file.fileName}`);
  const record = { ...file, sensitive, status: file.status || "Tracked" };
  files.push(record);
  return record;
}

export function attachFileToGrant(fileId: string, grantId: string): FileRecord {
  return updateFile(fileId, { relatedGrant: grantId });
}

export function attachFileToClient(fileId: string, clientId: string): FileRecord {
  return updateFile(fileId, { relatedClient: clientId });
}

export function attachFileToEvidenceLocker(fileId: string, evidenceId: string): FileRecord {
  return updateFile(fileId, { relatedEvidence: evidenceId });
}

export function markFileMissing(fileId: string): FileRecord {
  return updateFile(fileId, { status: "Missing" });
}

export function markFileVerified(fileId: string): FileRecord {
  return updateFile(fileId, { status: "Verified" });
}

export function getSensitiveFiles(): FileRecord[] {
  return files.filter((file) => file.sensitive);
}

export function clearFileDriveManagerForDemo(): void {
  files.length = 0;
}

function updateFile(fileId: string, updates: Partial<FileRecord>): FileRecord {
  const file = files.find((item) => item.id === fileId);
  if (!file) throw new Error(`File ${fileId} not found.`);
  Object.assign(file, updates);
  return file;
}
