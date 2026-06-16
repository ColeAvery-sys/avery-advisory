import { createConnectorRecord, getConnectorPermissions, generateConnectorSetupChecklist } from "./platformConnectorCommandEngine";
import { generateCopyPasteListingPacket } from "./etsyDraftListingConnector";
import { generateCopyPasteKdpForm } from "./kdpMetadataExporter";
import { exportTeespringUploadNotes } from "./teespringProductDraftPrep";
import { generateYouTubeUploadPackage, generateShortsPlan } from "./youtubeUploadPackageExporter";
import { generateDeliveryFolderStructure, createDriveFolderAfterApproval } from "./driveDeliveryFolderBuilder";
import { generateCustomerDraftFromOrder, createGmailCustomerDraftAfterApproval } from "./gmailCustomerDraftConnector";
import { generateStripeInvoiceDraftData, generateManualInvoiceNotes } from "./invoiceDraftConnector";
import { createFulfillmentScenario, generateFulfillmentPayload, triggerApprovedFulfillmentWebhook } from "./makeFulfillmentTriggerEngine";
import { recordConnectorError, suggestConnectorRecovery, createManualWorkaround } from "./platformConnectorErrorRecovery";

console.log("Platform Connector Command Center");
createConnectorRecord({ id: "youtube", platformName: "YouTube", permissionMode: "Draft Only" });
console.log(getConnectorPermissions("YouTube"));
console.log(generateConnectorSetupChecklist("YouTube"));

console.log("\nEtsy Draft Listing Connector");
console.log(generateCopyPasteListingPacket({ listingId: "etsy-demo", productName: "Creator Planner", title: "Creator Planner", description: "Practical planner", price: 9, rightsStatus: "Approved", QAStatus: "Passed", tags: ["creator"], category: "digital" }));

console.log("\nKDP Metadata Exporter");
console.log(generateCopyPasteKdpForm({ bookId: "book-demo", bookTitle: "Creator Workbook", authorName: "Cole Avery", description: "Practical creator planning workbook.", keywords: ["creator", "planner"], categories: ["Business"] }));

console.log("\nTeespring Product Draft Prep");
console.log(exportTeespringUploadNotes({ productId: "merch-demo", productName: "Torch Shirt", storeName: "AveryTech", productType: "shirt", designFile: "torch.png", price: 25, priceApproved: true, rightsStatus: "Approved", QAStatus: "Passed" }));

console.log("\nYouTube Upload Package Exporter");
const video = { videoId: "video-demo", channelName: "The New Prometheus", videoTitle: "Technology as Fire", selectedTitle: "Technology as Fire", description: "An essay about ethical technology.", tags: ["ethics"], rightsStatus: "Approved", approvalStatus: "Approved" };
console.log(generateYouTubeUploadPackage(video));
console.log(generateShortsPlan(video));

console.log("\nGoogle Drive Delivery Folder Builder");
const folder = generateDeliveryFolderStructure({ folderName: "Client Delivery", folderType: "client delivery", clientVisibleFiles: ["final.zip"], internalOnlyFiles: ["margin-notes.md"] });
console.log(folder);
console.log(createDriveFolderAfterApproval(folder, { approvedByCole: true }));

console.log("\nGmail Customer Draft Connector");
const draft = generateCustomerDraftFromOrder({ id: "order-demo", customerName: "Creator", customerEmail: "client@example.com", productOrService: "Clip package" });
console.log(createGmailCustomerDraftAfterApproval(draft, { approvedByCole: true }));

console.log("\nStripe / PayPal Invoice Draft Tracker");
const invoice = { invoiceId: "invoice-demo", clientName: "Creator", clientEmail: "client@example.com", serviceOrProduct: "Clip package", amount: 500, lineItems: ["clips"], approvalStatus: "Approved" };
console.log(generateStripeInvoiceDraftData(invoice));
console.log(generateManualInvoiceNotes(invoice));

console.log("\nMake.com Fulfillment Trigger Center");
const scenario = createFulfillmentScenario({ id: "scenario-demo", scenarioName: "Delivery packet approved", triggerType: "delivery packet approved" });
const payload = generateFulfillmentPayload(scenario, { id: "packet-demo" });
console.log(payload);
console.log(triggerApprovedFulfillmentWebhook(scenario, payload, { approvedByCole: true }));

console.log("\nPlatform Connector Error Recovery");
const error = recordConnectorError({ id: "error-demo", platform: "Etsy", connectorAction: "export listing", errorMessage: "401 unauthorized", retryCount: 0 });
console.log(suggestConnectorRecovery(error));
console.log(createManualWorkaround(error));

