export type SafetyPauseKey =
  | "all"
  | "externalIntegrations"
  | "notifications"
  | "scheduledLoops"
  | "draftGeneration"
  | "approvalItemCreation";

export type SafetyState = {
  paused: Record<SafetyPauseKey, boolean>;
  localOnlyMode: boolean;
  reasons: Partial<Record<SafetyPauseKey | "localOnlyMode", string>>;
  updatedAt: string;
};

const safetyState: SafetyState = {
  paused: {
    all: false,
    externalIntegrations: false,
    notifications: false,
    scheduledLoops: false,
    draftGeneration: false,
    approvalItemCreation: false,
  },
  localOnlyMode: false,
  reasons: {},
  updatedAt: new Date().toISOString(),
};

export function pauseAll(reason: string): SafetyState {
  for (const key of Object.keys(safetyState.paused) as SafetyPauseKey[]) {
    safetyState.paused[key] = true;
    safetyState.reasons[key] = reason;
  }
  safetyState.updatedAt = new Date().toISOString();
  return getSafetyState();
}

export function pauseExternalIntegrations(reason: string): SafetyState {
  return pauseOne("externalIntegrations", reason);
}

export function pauseNotifications(reason: string): SafetyState {
  return pauseOne("notifications", reason);
}

export function pauseScheduledLoops(reason: string): SafetyState {
  return pauseOne("scheduledLoops", reason);
}

export function pauseDraftGeneration(reason: string): SafetyState {
  return pauseOne("draftGeneration", reason);
}

export function pauseApprovalItemCreation(reason: string): SafetyState {
  return pauseOne("approvalItemCreation", reason);
}

export function enterLocalOnlyMode(reason: string): SafetyState {
  safetyState.localOnlyMode = true;
  safetyState.reasons.localOnlyMode = reason;
  safetyState.paused.externalIntegrations = true;
  safetyState.updatedAt = new Date().toISOString();
  return getSafetyState();
}

export function resumeManualOnly(): SafetyState {
  for (const key of Object.keys(safetyState.paused) as SafetyPauseKey[]) {
    safetyState.paused[key] = false;
  }
  safetyState.localOnlyMode = false;
  safetyState.reasons = {};
  safetyState.updatedAt = new Date().toISOString();
  return getSafetyState();
}

export function getSafetyState(): SafetyState {
  return {
    paused: { ...safetyState.paused },
    localOnlyMode: safetyState.localOnlyMode,
    reasons: { ...safetyState.reasons },
    updatedAt: safetyState.updatedAt,
  };
}

export function isActionAllowedUnderSafetyState(action: string): boolean {
  const normalized = action.toLowerCase();

  if (safetyState.paused.all) return false;
  if (/send|submit|spend|publish|delete|hire|pay|contact/.test(normalized)) return false;

  if (safetyState.localOnlyMode) {
    if (/external api|webhook|drive|docs|sheets|gmail draft|external notification/.test(normalized)) return false;
    return /local note|local task|local log|local recommendation|local summary/.test(normalized);
  }

  if (safetyState.paused.externalIntegrations && /external|webhook|drive|docs|sheets|gmail/.test(normalized)) return false;
  if (safetyState.paused.notifications && /notification/.test(normalized)) return false;
  if (safetyState.paused.scheduledLoops && /scheduled loop|schedule/.test(normalized)) return false;
  if (safetyState.paused.draftGeneration && /draft/.test(normalized)) return false;
  if (safetyState.paused.approvalItemCreation && /approval item|approval queue/.test(normalized)) return false;

  return true;
}

function pauseOne(key: SafetyPauseKey, reason: string): SafetyState {
  safetyState.paused[key] = true;
  safetyState.reasons[key] = reason;
  safetyState.updatedAt = new Date().toISOString();
  return getSafetyState();
}
