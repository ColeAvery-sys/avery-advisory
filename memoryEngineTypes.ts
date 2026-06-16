export type MemoryStatus = "Active" | "Deleted";
export type JournalStatus = "Active" | "Deleted";
export type MemoryLinkTargetType = "Project" | "Task" | "Contact";
export type MemoryActionType =
  | "Memory Created"
  | "Memory Retrieved"
  | "Memory Searched"
  | "Memory Updated"
  | "Memory Deleted"
  | "Memory Tagged"
  | "Memory Tag Removed"
  | "Memory Linked"
  | "Memory Link Removed"
  | "Journal Created"
  | "Journal Retrieved"
  | "Journal Searched"
  | "Journal Linked"
  | "Tool Registered"
  | "Tool Enabled"
  | "Tool Disabled"
  | "Tool Executed"
  | "Tool Failed"
  | "File Created"
  | "File Read"
  | "File Updated"
  | "File Deleted"
  | "File Moved"
  | "File Copied"
  | "File Renamed"
  | "File Searched"
  | "File Linked"
  | "File Metadata Retrieved"
  | "Calendar Event Created"
  | "Calendar Event Updated"
  | "Calendar Event Deleted"
  | "Calendar Event Read"
  | "Calendar Event Searched"
  | "Calendar Conflict Detected"
  | "Email Drafted"
  | "Email Updated"
  | "Email Deleted"
  | "Email Sent"
  | "Email Received"
  | "Email Replied"
  | "Email Forwarded"
  | "Email Read"
  | "Email Searched"
  | "Email Classified"
  | "Email Follow-Up Detected"
  | "Validation Failed";

export interface MemoryRecord {
  id: string;
  title: string;
  summary: string;
  body: string;
  memoryType: string;
  source: string;
  confidence: number;
  status: MemoryStatus;
  visibility: string;
  createdAt: string;
  updatedAt: string;
  archivedAt?: string | null;
}

export interface MemoryTagRecord {
  id: string;
  memoryId: string;
  tag: string;
  createdAt: string;
}

export interface MemoryLinkRecord {
  id: string;
  memoryId: string;
  linkedObjectType: MemoryLinkTargetType;
  linkedObjectId: string;
  linkType: string;
  createdAt: string;
}

export interface JournalRecord {
  id: string;
  entryDate: string;
  title: string;
  summary: string;
  body: string;
  mood: string;
  energy: string;
  status: JournalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface JournalLinkRecord {
  id: string;
  journalId: string;
  linkedObjectType: "Memory" | MemoryLinkTargetType | "Knowledge" | "Goal";
  linkedObjectId: string;
  linkType: string;
  createdAt: string;
}

export interface MemoryActionRecord {
  id: string;
  actionType: MemoryActionType;
  objectType: "Memory" | "Journal" | "Tag" | "Link" | "Tool" | "File" | "Calendar" | "Email";
  objectId: string;
  actor: string;
  status: "Success" | "Failed";
  details: string;
  createdAt: string;
}

export interface MemoryEngineDatabase {
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;
  memories: MemoryRecord[];
  memoryTags: MemoryTagRecord[];
  memoryLinks: MemoryLinkRecord[];
  journalEntries: JournalRecord[];
  journalLinks: JournalLinkRecord[];
  memoryActions: MemoryActionRecord[];
}

export interface MemoryView extends MemoryRecord {
  tags: string[];
  links: MemoryLinkRecord[];
}

export interface JournalView extends JournalRecord {
  links: JournalLinkRecord[];
}

export interface MemorySearchFilters {
  tags?: string[];
  memoryType?: string;
  status?: MemoryStatus;
  linkedObjectType?: MemoryLinkTargetType;
  linkedObjectId?: string;
}

export interface JournalSearchFilters {
  status?: JournalStatus;
  linkedObjectType?: string;
  linkedObjectId?: string;
}
