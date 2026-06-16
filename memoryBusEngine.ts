import { syncCriticalInfoToCore } from "./atlasCoreEngine";
import { createNetworkGate, detectNetworkRisks } from "./atlasNetworkSafety";

const memoryEvents: any[] = [];

export function publishMemoryEvent(event: any) {
  const stored = { ...event, id: event.id || `memory-event-${memoryEvents.length + 1}`, status: "Published", riskFlags: detectNetworkRisks(event) };
  memoryEvents.push(stored);
  if (event.critical !== false) syncCriticalInfoToCore(event.sourceSystem || "Memory Bus", { ...stored, type: event.recordType || "Memory Event" });
  return stored;
}

export function routeMemoryEvent(eventId: string, targetSystems: string[]) {
  const event = findEvent(eventId);
  event.targetSystems = Array.from(new Set([...(event.targetSystems || []), ...targetSystems]));
  return targetSystems.map((system) => ({ eventId, targetSystem: system, routeStatus: "Queued", coreSynced: true }));
}

export function getMemoryEventsForSystem(system: string) {
  return memoryEvents.filter((event) => (event.targetSystems || []).indexOf(system) >= 0 || event.sourceSystem === system);
}

export function generateMemoryBusReport() {
  return {
    totalEvents: memoryEvents.length,
    coreSyncedEvents: memoryEvents.filter((event) => event.critical !== false).length,
    ...createNetworkGate("Memory bus report"),
  };
}

function findEvent(eventId: string) {
  const event = memoryEvents.find((entry) => entry.id === eventId);
  if (!event) throw new Error(`Memory event ${eventId} not found.`);
  return event;
}
