export type FolderSensitivity = "Public" | "Internal" | "Client Confidential" | "Legal/Financial" | "Personal" | "High Risk";
export type DriveFolderRecord = {
  id: string;
  folderName: string;
  parentFolder?: string;
  category: string;
  purpose: string;
  sensitivity: FolderSensitivity;
  recommendedPath: string;
  driveStatus: "Recommended" | "Placeholder Created" | "Created Manually" | "Attached";
  approvalStatus: "Not Required" | "Needs Cole Approval" | "Approved";
  createdAt: string;
  updatedAt: string;
};

const folders: DriveFolderRecord[] = [];
const templates = ["Avery Industries LLC HQ", "AveryTech", "ATLAS HQ", "ATLAS Assist", "Creator Logistics", "Clients", "Grants and Funding", "Legal and Finance", "College and Admin", "Pitch Materials", "Evidence Locker", "Product Demos", "Contractor Work", "Content Pipeline", "Templates and SOPs"];

export function generateFullFolderMap(): DriveFolderRecord[] {
  return templates.map((folderName, index) => createFolderRecord({ id: `folder-${index + 1}`, folderName, category: folderName, purpose: `Recommended workspace for ${folderName}.`, sensitivity: getSensitivity(folderName), parentFolder: index === 0 ? undefined : "Avery Industries LLC HQ" }));
}

export function createFolderRecord(input: Omit<DriveFolderRecord, "recommendedPath" | "driveStatus" | "approvalStatus" | "createdAt" | "updatedAt">): DriveFolderRecord {
  const now = new Date().toISOString();
  const recommendedPath = input.parentFolder ? `${input.parentFolder}/${input.folderName}` : input.folderName;
  const approvalStatus = isSensitive(input.sensitivity) ? "Needs Cole Approval" : "Not Required";
  const record: DriveFolderRecord = { ...input, recommendedPath, driveStatus: "Recommended", approvalStatus, createdAt: now, updatedAt: now };
  folders.push(record);
  return record;
}

export function generateMissingFolderList(existingPaths: string[]): DriveFolderRecord[] {
  return folders.filter((folder) => !existingPaths.includes(folder.recommendedPath));
}

export function markFolderApproved(id: string): DriveFolderRecord {
  return updateFolder(id, { approvalStatus: "Approved" });
}

export function markFolderCreatedManually(id: string): DriveFolderRecord {
  return updateFolder(id, { driveStatus: "Created Manually" });
}

export function attachFolderToEvidenceLocker(id: string): DriveFolderRecord {
  return updateFolder(id, { driveStatus: "Attached", parentFolder: "Evidence Locker", recommendedPath: `Evidence Locker/${findFolder(id).folderName}` });
}

export function clearDriveStructureForDemo(): void {
  folders.length = 0;
}

function findFolder(id: string): DriveFolderRecord {
  const folder = folders.find((item) => item.id === id);
  if (!folder) throw new Error(`Folder ${id} not found.`);
  return folder;
}

function updateFolder(id: string, updates: Partial<DriveFolderRecord>): DriveFolderRecord {
  const folder = findFolder(id);
  Object.assign(folder, updates, { updatedAt: new Date().toISOString() });
  return folder;
}

function getSensitivity(name: string): FolderSensitivity {
  if (/client/i.test(name)) return "Client Confidential";
  if (/legal|finance/i.test(name)) return "Legal/Financial";
  if (/college/i.test(name)) return "Personal";
  if (/evidence/i.test(name)) return "High Risk";
  return "Internal";
}

function isSensitive(sensitivity: FolderSensitivity): boolean {
  return sensitivity !== "Public" && sensitivity !== "Internal";
}
