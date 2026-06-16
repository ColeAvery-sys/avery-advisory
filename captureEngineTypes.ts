export type CaptureSource = "Text" | "Voice" | "Dashboard" | "Telegram" | "Discord" | "Email";
export type CaptureObjectType = "Task" | "Project" | "Goal" | "Memory" | "Journal Entry" | "Contact" | "Knowledge";
export type CapturePriority = "Critical" | "High" | "Medium" | "Low";
export type CaptureEntityType = "Person" | "Company" | "Project" | "Location";

export interface CaptureEntity {
  type: CaptureEntityType;
  value: string;
  linkedId: string;
}

export interface CaptureClassification {
  type: CaptureObjectType;
  priority: CapturePriority;
  category: string;
  title: string;
  confidence: number;
  summary: string;
  rationale: string[];
  entities: CaptureEntity[];
}

export interface CaptureRecord {
  id: string;
  source: CaptureSource;
  originalInput: string;
  timestamp: string;
  confidence: number;
  classification: CaptureClassification;
  createdMemoryId?: string;
  createdJournalId?: string;
  status: "Success" | "Failed";
  error?: string;
}

export interface CaptureEngineState {
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;
  captures: CaptureRecord[];
}
