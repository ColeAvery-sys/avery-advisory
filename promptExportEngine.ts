export type PromptExportRecord = {
  id: string;
  target: "Cursor" | "Codex";
  title: string;
  department: string;
  sourceTask: string;
  prompt: string;
  exportStatus: "Draft" | "Exported";
  createdAt: string;
  updatedAt: string;
};

const promptExports: PromptExportRecord[] = [];

export function createPromptExport(input: Omit<PromptExportRecord, "prompt" | "exportStatus" | "createdAt" | "updatedAt"> & { requirements: string[] }): PromptExportRecord {
  const now = new Date().toISOString();
  const prompt = [
    "North Star: ATLAS HQ is the operating system for Avery Industries LLC.",
    `Target: ${input.target}`,
    `Department: ${input.department}`,
    `Task: ${input.sourceTask}`,
    "Requirements:",
    ...input.requirements.map((item) => `- ${item}`),
    "Keep risky actions behind Cole approval.",
  ].join("\n");
  const record: PromptExportRecord = { id: input.id, target: input.target, title: input.title, department: input.department, sourceTask: input.sourceTask, prompt, exportStatus: "Draft", createdAt: now, updatedAt: now };
  promptExports.push(record);
  return record;
}

export function markPromptExported(id: string): PromptExportRecord {
  const record = findPrompt(id);
  record.exportStatus = "Exported";
  record.updatedAt = new Date().toISOString();
  return record;
}

export function getPromptExportsByTarget(target: "Cursor" | "Codex"): PromptExportRecord[] {
  return promptExports.filter((record) => record.target === target);
}

export function clearPromptExportsForDemo(): void {
  promptExports.length = 0;
}

function findPrompt(id: string): PromptExportRecord {
  const record = promptExports.find((item) => item.id === id);
  if (!record) throw new Error(`Prompt export ${id} not found.`);
  return record;
}
