import { createNetworkGate, priorityWeight } from "./atlasNetworkSafety";

const notifications: any[] = [];

export function createNotification(notification: any) {
  const stored = { ...notification, id: notification.id || `notification-${notifications.length + 1}`, priority: notification.priority || "Normal", status: notification.status || "Unread" };
  notifications.push(stored);
  return stored;
}

export function prioritizeNotifications() {
  return notifications.slice().sort((a, b) => priorityWeight(b.priority) - priorityWeight(a.priority));
}

export function markNotificationRead(notificationId: string) {
  const notification = findNotification(notificationId);
  notification.status = "Read";
  return notification;
}

export function generateNotificationDigest() {
  const prioritized = prioritizeNotifications();
  return {
    critical: prioritized.filter((item) => /critical/i.test(item.priority)).length,
    high: prioritized.filter((item) => /high/i.test(item.priority)).length,
    unread: prioritized.filter((item) => item.status === "Unread").length,
    topAlerts: prioritized.slice(0, 5).map((item) => item.title || item.message),
    ...createNetworkGate("Notification digest"),
  };
}

function findNotification(notificationId: string) {
  const notification = notifications.find((entry) => entry.id === notificationId);
  if (!notification) throw new Error(`Notification ${notificationId} not found.`);
  return notification;
}
