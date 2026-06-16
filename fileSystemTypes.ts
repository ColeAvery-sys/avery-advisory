export type FileSystemPermission = "Read" | "Write" | "Admin";
export type FileSystemItemType = "File" | "Folder";
export type FileSystemLinkTargetType = "Project" | "Task" | "Memory" | "Contact";
export type FileSystemOperationStatus = "Success" | "Failure";

export interface FileIndexLink {
  targetType: FileSystemLinkTargetType;
  targetId: string;
}

export interface FileIndexRecord {
  id: string;
  path: string;
  name: string;
  itemType: FileSystemItemType;
  fileType: string;
  fileSize: number;
  createdDate: string;
  modifiedDate: string;
  associatedProjectId?: string;
  associatedTaskIds: string[];
  associatedMemoryIds: string[];
  associatedContactIds: string[];
  links: FileIndexLink[];
}

export interface FileSystemState {
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;
  fileIndex: FileIndexRecord[];
}

export interface FileSystemPermissionContext {
  actor: string;
  permission: FileSystemPermission;
}

export interface FileSystemSearchFilters {
  itemType?: FileSystemItemType;
  fileType?: string;
  projectId?: string;
  dateFrom?: string;
  dateTo?: string;
}
