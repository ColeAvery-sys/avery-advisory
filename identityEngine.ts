import { syncCriticalInfoToCore } from "./atlasCoreEngine";
import { createNetworkGate, detectNetworkRisks } from "./atlasNetworkSafety";

const identities: any[] = [];

export function createIdentity(identity: any) {
  const stored = { ...identity, id: identity.id || `identity-${identities.length + 1}`, connectedRecords: identity.connectedRecords || [], roles: identity.roles || [] };
  identities.push(stored);
  syncCriticalInfoToCore("Unified Identity System", { ...stored, type: "Identity" });
  return stored;
}

export function linkIdentityRecord(identityId: string, record: any) {
  const identity = findIdentity(identityId);
  identity.connectedRecords = [...(identity.connectedRecords || []), record];
  syncCriticalInfoToCore("Unified Identity System", { ...identity, type: "Identity" });
  return identity;
}

export function getIdentityNetwork(identityId: string) {
  const identity = findIdentity(identityId);
  return {
    identityId,
    displayName: identity.displayName || identity.personName,
    roles: identity.roles || [],
    connectedRecords: identity.connectedRecords || [],
    ...createNetworkGate("Identity network", detectNetworkRisks(identity)),
  };
}

export function findIdentitiesByRole(role: string) {
  return identities.filter((identity) => (identity.roles || []).indexOf(role) >= 0);
}

function findIdentity(identityId: string) {
  const identity = identities.find((entry) => entry.id === identityId);
  if (!identity) throw new Error(`Identity ${identityId} not found.`);
  return identity;
}
