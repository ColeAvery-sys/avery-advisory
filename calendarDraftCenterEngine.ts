export type CalendarDraftStatus = "Suggested" | "Needs Cole Approval" | "Approved for Calendar" | "Calendar Draft Created" | "Scheduled Manually" | "Archived";
export type CalendarDraftType = "Work Block" | "Grant Deadline" | "Client Delivery Deadline" | "Follow-Up Reminder" | "Build Sprint" | "College/Admin Task" | "Personal Stability Block" | "Recovery/Buffer Block" | "Meeting Draft";

export type CalendarDraftRecord = {
  id: string;
  title: string;
  type: CalendarDraftType;
  department: string;
  startDate: string;
  startTime?: string;
  endDate: string;
  endTime?: string;
  description: string;
  location?: string;
  relatedTask?: string;
  relatedClient?: string;
  relatedGrant?: string;
  approvalStatus: CalendarDraftStatus;
  calendarStatus: "Not Created" | "Placeholder Created" | "Scheduled Manually";
  createdAt: string;
  updatedAt: string;
};

const calendarDrafts: CalendarDraftRecord[] = [];

export function createCalendarDraft(input: Omit<CalendarDraftRecord, "approvalStatus" | "calendarStatus" | "createdAt" | "updatedAt">): CalendarDraftRecord {
  const now = new Date().toISOString();
  const needsApproval = input.type === "Meeting Draft" || Boolean(input.relatedClient || input.relatedGrant);
  const record: CalendarDraftRecord = { ...input, approvalStatus: needsApproval ? "Needs Cole Approval" : "Suggested", calendarStatus: "Not Created", createdAt: now, updatedAt: now };
  calendarDrafts.push(record);
  return record;
}

export function generateCalendarPlan(items: Array<Omit<CalendarDraftRecord, "approvalStatus" | "calendarStatus" | "createdAt" | "updatedAt">>): CalendarDraftRecord[] {
  return items.map(createCalendarDraft).sort((a, b) => getPriorityWeight(b.type) - getPriorityWeight(a.type));
}

export function markCalendarDraftApproved(id: string): CalendarDraftRecord {
  return updateCalendarDraft(id, { approvalStatus: "Approved for Calendar" });
}

export function createCalendarPlaceholder(id: string): CalendarDraftRecord {
  const draft = findCalendarDraft(id);
  if (draft.approvalStatus === "Needs Cole Approval") throw new Error("Cole approval required before creating calendar placeholder.");
  return updateCalendarDraft(id, { approvalStatus: "Calendar Draft Created", calendarStatus: "Placeholder Created" });
}

export function markCalendarScheduledManually(id: string): CalendarDraftRecord {
  return updateCalendarDraft(id, { approvalStatus: "Scheduled Manually", calendarStatus: "Scheduled Manually" });
}

export function clearCalendarDraftCenterForDemo(): void {
  calendarDrafts.length = 0;
}

function findCalendarDraft(id: string): CalendarDraftRecord {
  const draft = calendarDrafts.find((item) => item.id === id);
  if (!draft) throw new Error(`Calendar draft ${id} not found.`);
  return draft;
}

function updateCalendarDraft(id: string, updates: Partial<CalendarDraftRecord>): CalendarDraftRecord {
  const draft = findCalendarDraft(id);
  Object.assign(draft, updates, { updatedAt: new Date().toISOString() });
  return draft;
}

function getPriorityWeight(type: CalendarDraftType): number {
  if (/Grant|Client/i.test(type)) return 5;
  if (/Work Block|Build Sprint/i.test(type)) return 4;
  if (/Personal|Recovery/i.test(type)) return 3;
  return 2;
}
