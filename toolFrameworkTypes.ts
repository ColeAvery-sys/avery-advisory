export type ToolPermission = "Allowed" | "Denied" | "Read Only" | "Admin";
export type ToolCategory = "File" | "Memory" | "System";
export type ToolStatus = "Enabled" | "Disabled";
export type ToolExecutionStatus = "Success" | "Failure";
export type ToolFailureCode = "Missing Tool" | "Invalid Arguments" | "Timeout" | "Exception" | "Permission Denied";

export interface ToolContext {
  actor: string;
  permission: ToolPermission;
  timeoutMs?: number;
}

export interface ToolDefinition<TArgs = any, TResult = any> {
  name: string;
  description: string;
  category: ToolCategory;
  permission: ToolPermission;
  enabled: boolean;
  version: string;
  argsSchema?: string;
  execute: (args: TArgs, context: ToolContext) => Promise<TResult> | TResult;
  validate?: (args: TArgs) => void;
}

export interface ToolMetadata {
  name: string;
  description: string;
  category: ToolCategory;
  permission: ToolPermission;
  enabled: boolean;
  version: string;
  argsSchema?: string;
}

export interface ToolRegistryState {
  schemaVersion: number;
  createdAt: string;
  updatedAt: string;
  tools: ToolMetadata[];
}

export interface ToolExecutionResult {
  toolName: string;
  status: ToolExecutionStatus;
  durationMs: number;
  result?: unknown;
  error?: {
    code: ToolFailureCode;
    message: string;
  };
}
