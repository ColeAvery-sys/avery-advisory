export type DeadlineItem = {
  id: string;
  title: string;
  dueDate: string;
  relatedItem?: string;
  riskLevel?: "Low" | "Medium" | "High";
};

export type DeadlineSources = Record<
  "grants" | "clientDeliveries" | "invoices" | "contractorTasks" | "productSprints" | "collegeAdmin" | "calendarDrafts" | "followUps" | "legalFinance" | "personalAdmin",
  DeadlineItem[]
>;

export function scanDeadlines(data: DeadlineSources, currentDate: string) {
  const flattened = Object.entries(data).reduce<any[]>((all, [source, items]) => {
    const mapped = items.map((item) => {
      const daysRemaining = daysBetween(currentDate, item.dueDate);
      return {
        ...item,
        source,
        daysRemaining,
        status: getSeverity(daysRemaining),
        nextAction: `Prepare next action for ${item.title}.`,
        notificationStatus: daysRemaining <= 14 ? "Notification recommended" : "No notification needed",
      };
    });
    return all.concat(mapped);
  }, []);

  return {
    critical: flattened.filter((item) => item.status === "Critical"),
    urgent: flattened.filter((item) => item.status === "Urgent"),
    upcoming: flattened.filter((item) => item.status === "Upcoming"),
    normal: flattened.filter((item) => item.status === "Normal"),
    overdue: flattened.filter((item) => item.status === "Overdue"),
    tasksToCreate: flattened.filter((item) => item.daysRemaining <= 14).map((item) => ({ title: item.nextAction, relatedItem: item.id })),
    notificationsToCreate: flattened.filter((item) => item.daysRemaining <= 7).map((item) => ({ title: item.title, priority: item.status })),
    calendarDraftsToCreate: flattened.filter((item) => item.daysRemaining >= 0 && item.daysRemaining <= 14).map((item) => ({ title: item.title, date: item.dueDate })),
    actionItems: flattened.filter((item) => item.riskLevel === "High" || /grants|clientDeliveries|legalFinance/.test(item.source)),
    logEntry: createLog("Deadline Monitor", `Scanned ${flattened.length} deadlines.`),
  };
}

function getSeverity(days: number): "Critical" | "Urgent" | "Upcoming" | "Normal" | "Overdue" {
  if (days < 0) return "Overdue";
  if (days <= 2) return "Critical";
  if (days <= 7) return "Urgent";
  if (days <= 14) return "Upcoming";
  return "Normal";
}

function daysBetween(start: string, end: string): number {
  const ms = new Date(`${end}T00:00:00`).getTime() - new Date(`${start}T00:00:00`).getTime();
  return Math.ceil(ms / 86400000);
}

function createLog(loopName: string, summary: string) {
  return { loopName, timestamp: new Date().toISOString(), status: "Success", summary };
}
