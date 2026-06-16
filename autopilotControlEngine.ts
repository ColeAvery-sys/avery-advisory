export type AutopilotMode = "Off" | "Manual Only" | "Draft Mode" | "Notify Mode" | "Approval Queue Mode" | "Limited Autopilot";
export type AutopilotOutput = "log only" | "tasks" | "drafts" | "notifications" | "approval items" | "calendar drafts" | "reports";

export type AutopilotStatus = {
  mode: AutopilotMode;
  paused: boolean;
  pauseReason?: string;
  allowedOutputs: AutopilotOutput[];
  updatedAt: string;
};

const blockedOutputs = ["send email", "submit grant", "spend money", "publish content", "delete files", "pay contractor", "contact person"];

let status: AutopilotStatus = {
  mode: "Manual Only",
  paused: false,
  allowedOutputs: getAllowedOutputsForMode("Manual Only"),
  updatedAt: new Date().toISOString(),
};

export function getAutopilotStatus(): AutopilotStatus {
  return { ...status, allowedOutputs: [...status.allowedOutputs] };
}

export function setAutopilotMode(mode: AutopilotMode): AutopilotStatus {
  status = {
    mode,
    paused: false,
    allowedOutputs: getAllowedOutputsForMode(mode),
    updatedAt: new Date().toISOString(),
  };
  return getAutopilotStatus();
}

export function getAllowedOutputsForMode(mode: AutopilotMode): AutopilotOutput[] {
  if (mode === "Off") return [];
  if (mode === "Manual Only") return ["log only"];
  if (mode === "Draft Mode") return ["log only", "tasks", "drafts"];
  if (mode === "Notify Mode") return ["log only", "tasks", "drafts", "notifications"];
  if (mode === "Approval Queue Mode") return ["log only", "tasks", "drafts", "notifications", "approval items"];
  return ["log only", "tasks", "drafts", "notifications", "approval items", "calendar drafts", "reports"];
}

export function canLoopRun(loopName: string, mode: AutopilotMode): boolean {
  if (status.paused || mode === "Off") return false;
  if (mode === "Manual Only") return !/scheduled|auto/i.test(loopName);
  return true;
}

export function canCreateOutput(outputType: string, mode: AutopilotMode): boolean {
  const normalized = outputType.toLowerCase();
  if (blockedOutputs.some((blocked) => normalized.includes(blocked))) return false;
  return getAllowedOutputsForMode(mode).some((allowed) => normalized.includes(allowed));
}

export function pauseAllAutopilot(reason: string): AutopilotStatus {
  status = { ...status, paused: true, pauseReason: reason, updatedAt: new Date().toISOString() };
  return getAutopilotStatus();
}

export function resumeAutopilot(mode: AutopilotMode): AutopilotStatus {
  return setAutopilotMode(mode);
}
