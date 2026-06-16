export type ApprovalItem = {
  id: string;
  title: string;
  riskLevel: "Low" | "Medium" | "High";
  createdAt: string;
  deadline?: string;
  type: string;
  status: string;
  moneyRelated?: boolean;
};

export function generateApprovalReminders(approvalItems: ApprovalItem[], currentDate: string) {
  const reminders = approvalItems.map((item) => {
    const ageHours = hoursBetween(item.createdAt, currentDate);
    const hoursToDeadline = item.deadline ? hoursBetween(currentDate, item.deadline) : undefined;
    const reminderPriority = getPriority(item, ageHours, hoursToDeadline);
    return {
      id: `reminder-${item.id}`,
      approvalItem: item,
      riskLevel: item.riskLevel,
      age: ageHours,
      deadline: item.deadline,
      reminderPriority,
      suggestedAction: reminderPriority === "Critical" ? "Review immediately." : reminderPriority === "Urgent" ? "Review today." : "Batch with other low-risk approvals.",
      status: "Open",
    };
  });

  return {
    criticalReminders: reminders.filter((item) => item.reminderPriority === "Critical"),
    urgentReminders: reminders.filter((item) => item.reminderPriority === "Urgent"),
    batchedLowRiskApprovals: reminders.filter((item) => item.reminderPriority === "Batch"),
    staleApprovals: reminders.filter((item) => item.age >= 72),
    suggestedActions: reminders.map((item) => item.suggestedAction),
    notificationsToCreate: reminders.filter((item) => item.reminderPriority !== "Batch").map((item) => ({ title: item.approvalItem.title, priority: item.reminderPriority })),
    logEntry: createLog("Approval Reminder", `Generated ${reminders.length} approval reminders.`),
  };
}

function getPriority(item: ApprovalItem, ageHours: number, hoursToDeadline?: number): "Critical" | "Urgent" | "Batch" {
  if (/client delivery/i.test(item.type) && hoursToDeadline !== undefined && hoursToDeadline <= 48) return "Critical";
  if (/grant submission/i.test(item.type) && hoursToDeadline !== undefined && hoursToDeadline <= 72) return "Critical";
  if (item.moneyRelated && ageHours > 12) return "Urgent";
  if (item.riskLevel === "High" && ageHours > 24) return "Urgent";
  return "Batch";
}

function hoursBetween(start: string, end: string): number {
  return Math.max(0, Math.round((new Date(end).getTime() - new Date(start).getTime()) / 3600000));
}

function createLog(loopName: string, summary: string) {
  return { loopName, timestamp: new Date().toISOString(), status: "Success", summary };
}
