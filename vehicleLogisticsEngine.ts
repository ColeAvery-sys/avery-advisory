import { createHqGate, detectHqRisks } from "./physicalHqSafety";

const vehicles: any[] = [];
const trips: any[] = [];

export function createVehicleRecord(vehicle: any) {
  const stored = { ...vehicle, id: vehicle.id || `vehicle-${vehicles.length + 1}`, status: vehicle.status || "Tracked" };
  vehicles.push(stored);
  return stored;
}

export function logVehicleTrip(vehicleId: string, trip: any) {
  const vehicle = findVehicle(vehicleId);
  const stored = { ...trip, id: trip.id || `trip-${trips.length + 1}`, vehicleId };
  trips.push(stored);
  vehicle.mileage = Number(vehicle.mileage || 0) + Number(trip.miles || 0);
  return stored;
}

export function generateVehicleMaintenancePlan(vehicleId: string) {
  const vehicle = findVehicle(vehicleId);
  return {
    vehicleName: vehicle.vehicleName,
    mileage: vehicle.mileage || 0,
    checklist: ["Oil/service interval", "Tires", "Insurance", "Registration", "Cargo safety", "Emergency kit"],
    ...createHqGate("Vehicle maintenance plan", detectHqRisks(vehicle)),
  };
}

export function summarizeLogistics() {
  return { vehicleCount: vehicles.length, tripCount: trips.length, totalMiles: trips.reduce((sum, trip) => sum + Number(trip.miles || 0), 0) };
}

function findVehicle(vehicleId: string) {
  const vehicle = vehicles.find((entry) => entry.id === vehicleId);
  if (!vehicle) throw new Error(`Vehicle ${vehicleId} not found.`);
  return vehicle;
}
