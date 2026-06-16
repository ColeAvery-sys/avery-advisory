export type CalendarItem = {
  id: string;
  title: string;
  type: "Internal Block" | "External Meeting" | "Deadline";
  relatedDepartment: string;
  startDate: string;
  startTime?: string;
  endDate: string;
  endTime?: string;
  priority: number;
  location?: string;
  notes?: string;
  relatedTask?: string;
  approvalRequired: boolean;
  status: "Suggested" | "Needs Cole Approval" | "Scheduled Manually";
};

const calendarItems: CalendarItem[] = [];

export function createCalendarSuggestion(item: Omit<CalendarItem, "approvalRequired" | "status">): CalendarItem {
  const approvalRequired = item.type === "External Meeting";
  const stored = { ...item, approvalRequired, status: approvalRequired ? "Needs Cole Approval" : "Suggested" } as CalendarItem;
  calendarItems.push(stored);
  return stored;
}

export function convertTaskToCalendarBlock(task: { id: string; title: string; department: string; date: string; priority: number }): CalendarItem {
  return createCalendarSuggestion({ id: `cal-${task.id}`, title: task.title, type: "Internal Block", relatedDepartment: task.department, startDate: task.date, endDate: task.date, priority: task.priority, relatedTask: task.id });
}

export function generateTodayCalendarPlan(tasks: Array<{ id: string; title: string; department: string; priority: number }>, deadlines: Array<{ title: string; date: string }>): CalendarItem[] {
  const today = new Date().toISOString().slice(0, 10);
  return [
    ...tasks.sort((a, b) => b.priority - a.priority).slice(0, 5).map((task) => convertTaskToCalendarBlock({ ...task, date: today })),
    ...deadlines.filter((deadline) => deadline.date === today).map((deadline, index) => createCalendarSuggestion({ id: `deadline-${index}`, title: deadline.title, type: "Deadline", relatedDepartment: "Operations", startDate: today, endDate: today, priority: 10 })),
  ];
}

export function getUpcomingDeadlines(dateRange: { startDate: string; endDate: string }): CalendarItem[] {
  return calendarItems.filter((item) => item.type === "Deadline" && item.startDate >= dateRange.startDate && item.startDate <= dateRange.endDate);
}

export function markScheduledManually(calendarItemId: string): CalendarItem {
  const item = calendarItems.find((entry) => entry.id === calendarItemId);
  if (!item) throw new Error(`Calendar item ${calendarItemId} not found.`);
  item.status = "Scheduled Manually";
  return item;
}

export function clearCalendarCommandsForDemo(): void {
  calendarItems.length = 0;
}
