import { createDigitalProduct, calculateProductReadiness, sendProductToApproval } from "./digitalProductFactoryEngine";
import { createTemplate, generateTemplate, saveTemplateToProductFactory } from "./templateGeneratorEngine";
import { createAssetPack, validatePackRights, calculatePackReadiness, sendPackToListingQa } from "./assetPackBuilderEngine";
import { createListingQaRecord, runListingQa, markReadyForManualPublish, validateClaims } from "./listingQaEngine";
import { createEtsyProduct, generateEtsyListing, markPublishedManually as markEtsyPublished } from "./etsyProductFactoryEngine";
import { createKdpBookProject, generateKdpListing, markPublishedManually as markBookPublished } from "./kdpBookFactoryEngine";
import { createMerchDesign, sendToAssetRightsCheck, markPublishedManually as markMerchPublished } from "./merchDesignFactoryEngine";
import { createServiceOrder, generateContractorPacket, markDeliveredManually as markServiceDelivered } from "./serviceOrderFulfillmentEngine";
import { createOrder, generateCustomerUpdateDraft, generateRefundReview, escalateOrderIssue, markOrderCompletedManually } from "./orderTrackingEngine";
import { createDeliveryPacket, runDeliveryQa, markDeliveredManually as markPacketDelivered } from "./customerDeliveryPacketEngine";

const product = createDigitalProduct({
  id: "product-1",
  productName: "Creator Clip Checklist",
  productType: "checklist",
  targetAudience: "overwhelmed creators",
  problemSolved: "organize clip ideas",
  includedFiles: ["PDF"],
  assetRightsStatus: "Approved",
  deliveryFileStatus: "Ready",
  QAStatus: "Passed",
});
assertEqual(calculateProductReadiness(product).readyForApproval, true);
assertEqual(sendProductToApproval("product-1").approvalRequired, true);

const template = createTemplate({ id: "template-1", templateName: "Creator Intake", purpose: "collect project scope", sections: ["Client", "Scope"] });
assertThrows(() => saveTemplateToProductFactory("template-1"));
assertEqual(saveTemplateToProductFactory("template-1", { approvedByCole: true }).productType, "template");
assertEqual(generateTemplate({ id: "template-2", category: "delivery", templateName: "Delivery Checklist" }).approvalStatus, "Draft");

const pack = createAssetPack({ id: "pack-1", packName: "Caption Pack", packType: "social media caption pack", includedAssets: ["captions.md"], fileFormats: ["MD"], licenseTerms: "Owned commercial use allowed", rightsStatus: "Approved", instructionsFile: "README.md", QAStatus: "Passed" });
assertEqual(validatePackRights(pack).valid, true);
assertEqual(calculatePackReadiness(pack).readyForListingQa, true);
assertEqual(sendPackToListingQa("pack-1").approvalStatus, "Needs QA");

const badListing = createListingQaRecord({ id: "listing-1", listingName: "Magic Planner", platform: "Etsy", description: "guaranteed cure for ADHD", rightsStatus: "Unknown", priceApproved: false });
assertEqual(runListingQa(badListing).QAStatus, "Failed");
assertEqual(validateClaims(badListing).valid, false);
assertThrows(() => markReadyForManualPublish("listing-1", { approvedByCole: true }));

const goodListing = createListingQaRecord({ id: "listing-2", listingName: "Creator Checklist", title: "Creator Checklist", platform: "Etsy", description: "A practical checklist for organizing content.", rightsStatus: "Approved", priceApproved: true, filesAttached: true, instructionsIncluded: true, refundPolicyIncluded: true });
assertEqual(runListingQa(goodListing).QAStatus, "Passed");
assertThrows(() => markReadyForManualPublish("listing-2"));
assertEqual(markReadyForManualPublish("listing-2", { approvedByCole: true }).QAStatus, "Ready for Manual Publish");

const etsy = createEtsyProduct({ id: "etsy-1", productName: "Visual Calendar Kit", category: "printable planners", targetBuyer: "ADHD adults", filesIncluded: ["PDF"], rightsStatus: "Unknown" });
assertEqual(generateEtsyListing(etsy).approvalRequired, true);
assertThrows(() => markEtsyPublished("etsy-1", { approvedByCole: true }));

const etsyClear = createEtsyProduct({ id: "etsy-2", productName: "Creator Planner", category: "content planning templates", targetBuyer: "creators", rightsStatus: "Approved" });
assertEqual(markEtsyPublished("etsy-2", { approvedByCole: true }).publishStatus, "Published Manually");

const book = createKdpBookProject({ id: "book-1", bookTitle: "Overwhelm Planner", bookType: "workbook", targetReader: "busy adults", promise: "support planning without medical claims", keywords: ["planner", "workbook", "guaranteed cure"] });
assertEqual(generateKdpListing(book).keywords.indexOf("guaranteed cure"), -1);
assertThrows(() => markBookPublished("book-1"));
assertEqual(markBookPublished("book-1", { approvedByCole: true }).launchStatus, "Published Manually");

const merch = createMerchDesign({ id: "merch-1", designName: "ATLAS Signal", brand: "ATLAS", slogan: "One next step counts", rightsStatus: "Needs Review" });
assertEqual(sendToAssetRightsCheck("merch-1").approvalRequired, true);
assertThrows(() => markMerchPublished("merch-1", { approvedByCole: true }));

const merchClear = createMerchDesign({ id: "merch-2", designName: "AveryTech Torch", brand: "AveryTech", slogan: "Build with care", rightsStatus: "Approved" });
assertEqual(markMerchPublished("merch-2", { approvedByCole: true }).publishStatus, "Published Manually");

const service = createServiceOrder({ id: "service-1", orderName: "Clip Package", clientName: "Creator", serviceType: "short-form clipping", paymentStatus: "Pending", deliverables: ["10 clips"] });
assertEqual(generateContractorPacket(service).approvalRequired, true);
assertThrows(() => markServiceDelivered("service-1", { approvedByCole: true }));
assertEqual(markServiceDelivered("service-1", { approvedByCole: true, paymentExceptionApproved: true }).clientVisibleStatus, "Delivered");

const order = createOrder({ id: "order-1", productOrService: "Digital download", refundStatus: "Refund Requested" });
assertEqual(generateCustomerUpdateDraft(order).approvalRequired, true);
assertEqual(generateRefundReview(order).approvalRequired, true);
assertEqual(escalateOrderIssue("order-1", "refund dispute").escalationTarget, "Cole");
assertThrows(() => markOrderCompletedManually("order-1", { approvedByCole: true }));

const packet = createDeliveryPacket({ id: "packet-1", packetName: "Creator Delivery", customerName: "Creator", includedFiles: ["clips.zip"], instructions: "Download files.", revisionPolicy: "3 revisions included.", licenseTerms: "Client project use only.", assetRightsStatus: "Approved", internalQCStatus: "Passed", deliveryMessage: "Here are your files.", paymentStatus: "Verified" });
assertEqual(runDeliveryQa(packet).QAStatus, "Passed");
assertThrows(() => markPacketDelivered("packet-1"));
assertEqual(markPacketDelivered("packet-1", { approvedByCole: true }).deliveryStatus, "Delivered Manually");

console.log("All ATLAS Batch 20 tests passed.");

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

