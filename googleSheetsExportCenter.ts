export type SheetExportRecord = {
  id: string;
  exportName: string;
  tableType: string;
  dateRange?: string;
  filters: string[];
  columns: string[];
  rows: Array<Record<string, string | number | boolean>>;
  approvalStatus: "Draft" | "Needs Cole Approval" | "Approved" | "Exported Manually";
  sheetsStatus: "Not Created" | "Preview Generated" | "Placeholder Created" | "Exported";
  createdAt: string;
  updatedAt: string;
};

const exportsList: SheetExportRecord[] = [];

export function createSheetExport(input: Omit<SheetExportRecord, "approvalStatus" | "sheetsStatus" | "createdAt" | "updatedAt">): SheetExportRecord {
  const now = new Date().toISOString();
  const approvalStatus = /client|legal|financial|personal|invoice|contractor/i.test(input.tableType) ? "Needs Cole Approval" : "Draft";
  const record: SheetExportRecord = { ...input, approvalStatus, sheetsStatus: "Not Created", createdAt: now, updatedAt: now };
  exportsList.push(record);
  return record;
}

export function generateCsv(id: string): string {
  const record = findExport(id);
  return [record.columns.join(","), ...record.rows.map((row) => record.columns.map((column) => JSON.stringify(row[column] ?? "")).join(","))].join("\n");
}

export function generateSheetPreview(id: string): Array<Record<string, string | number | boolean>> {
  const record = findExport(id);
  record.sheetsStatus = "Preview Generated";
  return record.rows.slice(0, 5);
}

export function markSheetExportApproved(id: string): SheetExportRecord {
  return updateExport(id, { approvalStatus: "Approved" });
}

export function createGoogleSheetPlaceholder(id: string): SheetExportRecord {
  const record = findExport(id);
  if (record.approvalStatus === "Needs Cole Approval") throw new Error("Cole approval required before creating Google Sheet placeholder.");
  return updateExport(id, { sheetsStatus: "Placeholder Created" });
}

export function clearSheetsExportCenterForDemo(): void {
  exportsList.length = 0;
}

function findExport(id: string): SheetExportRecord {
  const record = exportsList.find((item) => item.id === id);
  if (!record) throw new Error(`Sheet export ${id} not found.`);
  return record;
}

function updateExport(id: string, updates: Partial<SheetExportRecord>): SheetExportRecord {
  const record = findExport(id);
  Object.assign(record, updates, { updatedAt: new Date().toISOString() });
  return record;
}
