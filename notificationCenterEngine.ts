export type NotificationRecord = {
  id: string;
  title: string;
  message: string;
  department: string;
  priority: "Low" | "Medium" | "High";
  notificationType: "Approval Needed" | "Deadline" | "Integration" | "Follow-Up" | "System";
  relatedItem?: string;
  status: "Unread" | "Read" | "Archived";
  createdAt: string;
};

const notifications: NotificationRecord[] = [];

export function createNotification(input: Omit<NotificationRecord, "status" | "createdAt">): NotificationRecord {
  const record: NotificationRecord = { ...input, status: "Unread", createdAt: new Date().toISOString() };
  notifications.push(record);
  return record;
}

export function getUnreadNotifications(): NotificationRecord[] {
  return notifications.filter((item) => item.status === "Unread");
}

export function markNotificationRead(id: string): NotificationRecord {
  const notification = findNotification(id);
  notification.status = "Read";
  return notification;
}

export function archiveNotification(id: string): NotificationRecord {
  const notification = findNotification(id);
  notification.status = "Archived";
  return notification;
}

export function clearNotificationCenterForDemo(): void {
  notifications.length = 0;
}

function findNotification(id: string): NotificationRecord {
  const notification = notifications.find((item) => item.id === id);
  if (!notification) throw new Error(`Notification ${id} not found.`);
  return notification;
}
