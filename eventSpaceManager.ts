import { createHqGate, detectHqRisks } from "./physicalHqSafety";

const events: any[] = [];

export function createEventRecord(event: any) {
  const stored = { ...event, id: event.id || `event-${events.length + 1}`, status: event.status || "Draft" };
  events.push(stored);
  return stored;
}

export function generateEventResourcePlan(eventId: string) {
  const event = findEvent(eventId);
  return {
    eventName: event.eventName,
    attendees: event.attendees || 0,
    resources: event.resources || ["Room", "Chairs", "AV", "Sign-in", "Accessibility accommodations"],
    budget: event.budget || 0,
    ...createHqGate("Event resource plan", detectHqRisks(event).concat(["Public events and event spending require approval."])),
  };
}

export function logEventFeedback(eventId: string, feedback: any) {
  const event = findEvent(eventId);
  event.feedback = [...(event.feedback || []), feedback];
  return event;
}

export function summarizeEventFeedback(eventId: string) {
  const event = findEvent(eventId);
  return {
    eventName: event.eventName,
    feedbackCount: (event.feedback || []).length,
    commonThemes: Array.from(new Set((event.feedback || []).map((item: any) => item.theme || "General"))),
  };
}

function findEvent(eventId: string) {
  const event = events.find((entry) => entry.id === eventId);
  if (!event) throw new Error(`Event ${eventId} not found.`);
  return event;
}
