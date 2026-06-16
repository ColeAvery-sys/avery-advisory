import { createConnectorRecord, getConnectorPermissions, checkConnectorActionAllowed, disableConnector } from "./platformConnectorCommandEngine";
import { validateEtsyListingForExport, generateEtsyListingExport, markEtsyListingCreatedManually } from "./etsyDraftListingConnector";
import { validateKdpMetadata, generateKdpMetadataPacket, markKdpPublishedManually } from "./kdpMetadataExporter";
import { validateMerchProductForPrep, generateTeespringProductPacket, markTeespringPublishedManually } from "./teespringProductDraftPrep";
import { validateYouTubeUploadPackage, generateYouTubeUploadPackage, markYouTubeUploadedManually } from "./youtubeUploadPackageExporter";
import { generateDeliveryFolderStructure, validateClientVisibleFiles, createDriveFolderAfterApproval, markSharedManually } from "./driveDeliveryFolderBuilder";
import { validateCustomerDraft, createGmailCustomerDraftAfterApproval, generateRefundConcernDraft, markCustomerEmailSentManually } from "./gmailCustomerDraftConnector";
import { validateInvoiceDraft, generateStripeInvoiceDraftData, markInvoiceCreatedManually, markInvoiceSentManually } from "./invoiceDraftConnector";
import { createFulfillmentScenario, generateFulfillmentPayload, validateFulfillmentPayload, triggerApprovedFulfillmentWebhook, disableFulfillmentScenario } from "./makeFulfillmentTriggerEngine";
import { recordConnectorError, classifyConnectorError, shouldRetryConnectorAction, createManualWorkaround, generateCodexDebugPrompt, markConnectorErrorResolved } from "./platformConnectorErrorRecovery";

const connector = createConnectorRecord({ id: "etsy", platformName: "Etsy" });
assertEqual(connector.permissionMode, "Local Export Only");
assertEqual(getConnectorPermissions("Etsy").blockedActions.indexOf("publish") >= 0, true);
assertEqual(checkConnectorActionAllowed("Etsy", "publish listing").allowed, false);
assertEqual(disableConnector("Etsy", "API unavailable").permissionMode, "Disabled");

const badEtsy = { listingId: "etsy-1", productName: "Planner", title: "Planner", description: "Nice", price: 9, rightsStatus: "Unknown", QAStatus: "Passed" };
assertEqual(validateEtsyListingForExport(badEtsy).valid, false);
const goodEtsy = { listingId: "etsy-2", productName: "Creator Planner", title: "Creator Planner", description: "Practical planner", price: 9, rightsStatus: "Approved", QAStatus: "Passed", tags: ["creator"], category: "digital" };
assertEqual(generateEtsyListingExport(goodEtsy).connectorStatus, "Export Ready");
assertThrows(() => markEtsyListingCreatedManually("etsy-2", "https://etsy.example/listing"));
assertEqual(markEtsyListingCreatedManually("etsy-2", "https://etsy.example/listing", { approvedByCole: true }).connectorStatus, "Created Manually");

const badBook = { bookId: "book-1", bookTitle: "Cure Planner", authorName: "Cole", description: "guaranteed cure", keywords: ["a", "b", "c", "d", "e", "f", "g", "h"] };
assertEqual(validateKdpMetadata(badBook).valid, false);
const goodBook = { bookId: "book-2", bookTitle: "Creator Workbook", authorName: "Cole Avery", description: "Practical creator planning workbook.", keywords: ["creator", "planner"], categories: ["Business"] };
assertEqual(generateKdpMetadataPacket(goodBook).exportStatus, "Metadata Ready");
assertThrows(() => markKdpPublishedManually("book-2", "https://amazon.example/book"));
assertEqual(markKdpPublishedManually("book-2", "https://amazon.example/book", { approvedByCole: true }).logged, true);

const merch = { productId: "merch-1", productName: "Torch Shirt", storeName: "AveryTech", productType: "shirt", designFile: "torch.png", price: 25, priceApproved: true, rightsStatus: "Approved", QAStatus: "Passed" };
assertEqual(validateMerchProductForPrep(merch).valid, true);
assertEqual(generateTeespringProductPacket(merch).prepStatus, "Upload Notes Ready");
assertThrows(() => markTeespringPublishedManually("merch-1", "https://spring.example/product"));
assertEqual(markTeespringPublishedManually("merch-1", "https://spring.example/product", { approvedByCole: true }).logged, true);

const badVideo = { videoId: "video-1", channelName: "AveryTech", videoTitle: "Guaranteed viral AI", description: "watch", rightsStatus: "Unknown", approvalStatus: "Approved" };
assertEqual(validateYouTubeUploadPackage(badVideo).valid, false);
const video = { videoId: "video-2", channelName: "The New Prometheus", videoTitle: "Technology as Fire", selectedTitle: "Technology as Fire", description: "An essay about ethical technology.", tags: ["ethics"], rightsStatus: "Approved", approvalStatus: "Approved" };
assertEqual(generateYouTubeUploadPackage(video).exportStatus, "Upload Package Ready");
assertThrows(() => markYouTubeUploadedManually("video-2", "https://youtube.example/video"));
assertEqual(markYouTubeUploadedManually("video-2", "https://youtube.example/video", { approvedByCole: true }).exportStatus, "Uploaded Manually");

const folder = generateDeliveryFolderStructure({ folderName: "Client Delivery", folderType: "client delivery", clientVisibleFiles: ["final.zip"], internalOnlyFiles: ["margin-notes.md"] });
assertEqual(validateClientVisibleFiles(folder).valid, true);
assertThrows(() => createDriveFolderAfterApproval(folder, {}));
const createdFolder = createDriveFolderAfterApproval(folder, { approvedByCole: true });
assertEqual(createdFolder.driveStatus, "Mock Created");
assertThrows(() => markSharedManually("Client Delivery"));
assertEqual(markSharedManually("Client Delivery", { approvedByCole: true }).driveStatus, "Shared Manually");

const refundDraft = generateRefundConcernDraft({ id: "issue-1", email: "buyer@example.com" });
assertEqual(validateCustomerDraft(refundDraft).escalationRequired, true);
assertThrows(() => createGmailCustomerDraftAfterApproval(refundDraft, { approvedByCole: true }));
const draft = { draftId: "draft-1", recipientEmail: "client@example.com", subject: "Delivery update", body: "Your delivery packet is ready for review.", messageType: "customer update" };
assertEqual(createGmailCustomerDraftAfterApproval(draft, { approvedByCole: true }).gmailDraftStatus, "Mock Draft Created");
assertThrows(() => markCustomerEmailSentManually("draft-1"));
assertEqual(markCustomerEmailSentManually("draft-1", { approvedByCole: true }).gmailDraftStatus, "Sent Manually");

const invoice = { invoiceId: "inv-1", clientName: "Creator", clientEmail: "client@example.com", serviceOrProduct: "Clip package", amount: 500, lineItems: ["clips"], approvalStatus: "Approved" };
assertEqual(validateInvoiceDraft(invoice).valid, true);
assertEqual(generateStripeInvoiceDraftData(invoice).requestPaymentAutomatically, false);
assertThrows(() => markInvoiceCreatedManually("inv-1", "https://stripe.example/invoice"));
assertEqual(markInvoiceCreatedManually("inv-1", "https://stripe.example/invoice", { approvedByCole: true }).status, "Created Manually");
assertThrows(() => markInvoiceSentManually("inv-1"));
assertEqual(markInvoiceSentManually("inv-1", { approvedByCole: true }).sentStatus, "Sent Manually");

const scenario = createFulfillmentScenario({ id: "scenario-1", scenarioName: "Delivery packet approved", triggerType: "delivery packet approved" });
const payload = generateFulfillmentPayload(scenario, { id: "packet-1" });
assertEqual(validateFulfillmentPayload(payload).valid, true);
assertThrows(() => triggerApprovedFulfillmentWebhook(scenario, payload));
assertEqual(triggerApprovedFulfillmentWebhook(scenario, payload, { approvedByCole: true }).logged, true);
assertEqual(disableFulfillmentScenario("scenario-1").webhookStatus, "Disabled");

const error = recordConnectorError({ id: "err-1", platform: "Etsy", connectorAction: "export listing", errorMessage: "429 timeout", retryCount: 1 });
assertEqual(classifyConnectorError(error), "Retryable");
assertEqual(shouldRetryConnectorAction(error).retry, true);
assertEqual(createManualWorkaround(error).approvalRequired, true);
assertEqual(generateCodexDebugPrompt(error).indexOf("do not publish") >= 0, true);
assertEqual(markConnectorErrorResolved("err-1").status, "Resolved");

console.log("All ATLAS Batch 21 tests passed.");

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
}

function assertThrows(callback: () => void): void {
  let threw = false;
  try {
    callback();
  } catch {
    threw = true;
  }
  if (!threw) throw new Error("Expected function to throw.");
}

