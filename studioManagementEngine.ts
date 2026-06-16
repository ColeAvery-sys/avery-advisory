import { createHqGate, detectHqRisks } from "./physicalHqSafety";

const studios: any[] = [];

export function createStudioRecord(studio: any) {
  const stored = { ...studio, id: studio.id || `studio-${studios.length + 1}`, bookings: studio.bookings || [] };
  studios.push(stored);
  return stored;
}

export function bookStudio(studioId: string, booking: any) {
  const studio = findStudio(studioId);
  studio.bookings = [...(studio.bookings || []), booking];
  return studio;
}

export function generateStudioSchedule(studioId: string) {
  const studio = findStudio(studioId);
  return { studioName: studio.studioName, bookings: studio.bookings || [], maintenance: studio.maintenance || [] };
}

export function generateStudioMaintenancePlan(studioId: string) {
  const studio = findStudio(studioId);
  return {
    studioName: studio.studioName,
    equipment: studio.equipment || [],
    checklist: ["Cables", "Audio test", "Camera test", "Lighting", "Storage", "Safety", "Clean reset"],
    ...createHqGate("Studio maintenance plan", detectHqRisks(studio)),
  };
}

function findStudio(studioId: string) {
  const studio = studios.find((entry) => entry.id === studioId);
  if (!studio) throw new Error(`Studio ${studioId} not found.`);
  return studio;
}
