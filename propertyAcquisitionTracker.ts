import { createHqGate, detectHqRisks, hqBeforeEmpireStatus, scorePropertyFit } from "./physicalHqSafety";

const properties: any[] = [];

export function createPropertyRecord(property: any) {
  const stored = { ...property, id: property.id || `property-${properties.length + 1}`, score: scorePropertyFit(property), expansionGate: hqBeforeEmpireStatus(property), riskFlags: detectHqRisks(property) };
  properties.push(stored);
  return stored;
}

export function scoreProperty(property: any) {
  return scorePropertyFit(property);
}

export function rankProperties() {
  return properties.slice().sort((a, b) => b.score - a.score).map((property) => ({
    propertyName: property.propertyName,
    address: property.address,
    score: property.score,
    expansionGate: hqBeforeEmpireStatus(property),
    approvalRequiredBeforeOfferOrLease: true,
  }));
}

export function generatePropertyDueDiligence(propertyId: string) {
  const property = findProperty(propertyId);
  return {
    propertyName: property.propertyName,
    checklist: ["Cash runway", "Accessibility", "Internet", "Parking", "Zoning", "Utilities", "Lease/purchase terms", "Buildout cost", "Emergency exits"],
    expansionGate: hqBeforeEmpireStatus(property),
    ...createHqGate("Property due diligence", detectHqRisks(property).concat(["Property decisions require Cole approval."])),
  };
}

function findProperty(propertyId: string) {
  const property = properties.find((entry) => entry.id === propertyId);
  if (!property) throw new Error(`Property ${propertyId} not found.`);
  return property;
}
