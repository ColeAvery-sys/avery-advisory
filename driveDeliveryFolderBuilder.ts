import { connectorLog, ensureApproval, requireFields } from "./platformConnectorSafety";

const folders: any[] = [];

export function generateDeliveryFolderStructure(item: any) {
  return {
    folderName: item.folderName || `${item.relatedClient || item.relatedProduct || "ATLAS"} Delivery`,
    folderType: item.folderType || "client delivery",
    subfolders: ["01_Client_Visible", "02_Internal_Only", "03_Source_Files", "04_Delivery_Packet"],
    includedFiles: item.includedFiles || [],
    internalOnlyFiles: item.internalOnlyFiles || [],
    clientVisibleFiles: item.clientVisibleFiles || [],
    approvalStatus: "Needs Cole Approval",
  };
}

export function validateClientVisibleFiles(folder: any) {
  const risky = (folder.clientVisibleFiles || []).filter((file: string) => /internal|private|contractor|margin|profit|legal|finance/i.test(file));
  return { valid: risky.length === 0, riskyFiles: risky, approvalRequired: true };
}

export function createDriveFolderAfterApproval(folder: any, approval: { approvedByCole?: boolean }, driveClient?: any) {
  ensureApproval(approval, "Cole approval required before creating Drive folder.");
  const missing = requireFields(folder, ["folderName", "folderType"]);
  if (missing.length) throw new Error(`${missing.join(", ")} missing`);
  const visible = validateClientVisibleFiles(folder);
  if (!visible.valid) throw new Error("Client-visible files contain sensitive/internal items.");
  const stored = { ...folder, driveStatus: driveClient ? "Created by Client" : "Mock Created", driveLink: driveClient ? "external-drive-client-link" : `local-drive-placeholder://${folder.folderName}` };
  folders.push(stored);
  logDriveDeliveryAction({ action: "create drive folder", folderName: folder.folderName, status: stored.driveStatus });
  return stored;
}

export function attachDeliveryPacket(folderId: string, packetId: string) {
  const folder = findFolder(folderId);
  folder.deliveryPacketId = packetId;
  return folder;
}

export function markSharedManually(folderId: string, approval?: { approvedByCole?: boolean }) {
  ensureApproval(approval, "Cole approval required before logging external Drive sharing.");
  const folder = findFolder(folderId);
  folder.driveStatus = "Shared Manually";
  return folder;
}

export function logDriveDeliveryAction(action: any) {
  return connectorLog({ platform: "Google Drive", ...action });
}

function findFolder(folderId: string) {
  const folder = folders.find((entry) => entry.id === folderId || entry.folderId === folderId || entry.folderName === folderId);
  if (!folder) throw new Error(`Drive folder ${folderId} not found.`);
  return folder;
}

