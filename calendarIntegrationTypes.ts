export type CalendarEventStatus = "Scheduled" | "Cancelled";
export type CalendarEventKind = "Event" | "Reminder" | "Recurring";
export type CalendarLinkTargetType = "Project" | "Task" | "Memory";

export interface CalendarLinkRecord {
  targetType: CalendarLinkTargetType;
  targetId: string;
}

export interface CalendarEventRecord {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  kind: CalendarEventKind;
  participants: string[];
  location?: string;
  notes?: string;
  recurrenceRule?: string;
  status: CalendarEventStatus;
  linkedProjectIds: string[];
  linkedTaskIds: string[];
  linkedMemoryIds: string[];
  links: CalendarLinkRecord[];
  memoryId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CalendarState {
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;
  events: CalendarEventRecord[];
}

export interface CalendarConflictRecord {
  eventId: string;
  conflictType: "Overlap" | "Double Booking" | "Missing Deadline";
  conflictingEventId?: string;
  message: string;
}

export interface CalendarPermissionContext {
  actor: string;
}

export interface CalendarSearchFilters {
  date?: string;
  participant?: string;
}

export interface CalendarEventInput {
  id?: string;
  title: string;
  date: string;
  startTime?: string;
  endTime?: string;
  kind?: CalendarEventKind;
  participants?: string[];
  location?: string;
  notes?: string;
  recurrenceRule?: string;
  linkedProjectIds?: string[];
  linkedTaskIds?: string[];
  linkedMemoryIds?: string[];
  actor?: string;
}

export interface CalendarEventPatch {
  title?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  participants?: string[];
  location?: string;
  notes?: string;
  recurrenceRule?: string;
  linkedProjectIds?: string[];
  linkedTaskIds?: string[];
  linkedMemoryIds?: string[];
}
