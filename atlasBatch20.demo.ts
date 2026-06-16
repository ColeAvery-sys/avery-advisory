import { createDigitalProduct, generateProductOutline, generateListingDraft, calculateProductReadiness } from "./digitalProductFactoryEngine";
import { generateTemplate } from "./templateGeneratorEngine";
import { createAssetPack, generateLicenseNotes, calculatePackReadiness } from "./assetPackBuilderEngine";
import { createListingQaRecord, runListingQa } from "./listingQaEngine";
import { createEtsyProduct, generateEtsyListing, generateEtsySeoTags } from "./etsyProductFactoryEngine";
import { createKdpBookProject, generateBookOutline, generateKdpListing } from "./kdpBookFactoryEngine";
import { createMerchDesign, generateSloganVariations, generateProductCopy } from "./merchDesignFactoryEngine";
import { createServiceOrder, generateFulfillmentChecklist, generateClientUpdateDraft } from "./serviceOrderFulfillmentEngine";
import { createOrder, generateRefundReview } from "./orderTrackingEngine";
import { createDeliveryPacket, runDeliveryQa, generateDeliveryMessage } from "./customerDeliveryPacketEngine";

console.log("Digital Product Factory");
const product = createDigitalProduct({ id: "demo-product", productName: "Creator Clip Checklist", productType: "checklist", targetAudience: "overwhelmed creators", problemSolved: "organize clip ideas", includedFiles: ["PDF"], assetRightsStatus: "Approved", deliveryFileStatus: "Ready", QAStatus: "Passed" });
console.log(generateProductOutline(product));
console.log(generateListingDraft(product));
console.log(calculateProductReadiness(product));

console.log("\nTemplate Generator");
console.log(generateTemplate({ id: "demo-template", templateName: "Client Delivery Packet", category: "client delivery", sections: ["Files", "Instructions", "Revision Policy"] }));

console.log("\nAsset Pack Builder");
const pack = createAssetPack({ id: "demo-pack", packName: "YouTube Title Pack", packType: "YouTube title pack", includedAssets: ["titles.md"], fileFormats: ["MD"], licenseTerms: "Owned commercial use allowed", rightsStatus: "Approved", instructionsFile: "README.md", QAStatus: "Passed" });
console.log(generateLicenseNotes(pack));
console.log(calculatePackReadiness(pack));

console.log("\nListing QA");
console.log(runListingQa(createListingQaRecord({ id: "demo-listing", listingName: "Creator Checklist", title: "Creator Checklist", platform: "Etsy", description: "A practical checklist for organizing content.", rightsStatus: "Approved", priceApproved: true, filesAttached: true, instructionsIncluded: true, refundPolicyIncluded: true })));

console.log("\nEtsy Product Factory");
const etsy = createEtsyProduct({ id: "demo-etsy", productName: "Visual Calendar Kit", category: "printable planners", targetBuyer: "busy adults", filesIncluded: ["PDF"], rightsStatus: "Approved" });
console.log(generateEtsyListing(etsy));
console.log(generateEtsySeoTags(etsy));

console.log("\nKDP Book Factory");
const book = createKdpBookProject({ id: "demo-book", bookTitle: "Bare Minimum Planning Workbook", bookType: "workbook", targetReader: "overloaded adults", keywords: ["planner", "workbook", "executive dysfunction"] });
console.log(generateBookOutline(book));
console.log(generateKdpListing(book));

console.log("\nMerch Design Factory");
const merch = createMerchDesign({ id: "demo-merch", designName: "ATLAS Signal", brand: "ATLAS", slogan: "One next step counts", rightsStatus: "Approved" });
console.log(generateSloganVariations({ brand: "ATLAS" }));
console.log(generateProductCopy(merch));

console.log("\nService Order Fulfillment");
const service = createServiceOrder({ id: "demo-service", orderName: "Clip Package", clientName: "Creator", serviceType: "short-form clipping", paymentStatus: "Verified", deliverables: ["10 clips"] });
console.log(generateFulfillmentChecklist(service));
console.log(generateClientUpdateDraft(service));

console.log("\nOrder Tracking");
const order = createOrder({ id: "demo-order", productOrService: "Digital download", refundStatus: "Refund Requested" });
console.log(generateRefundReview(order));

console.log("\nCustomer Delivery Packet");
const packet = createDeliveryPacket({ id: "demo-packet", packetName: "Creator Delivery", customerName: "Creator", includedFiles: ["clips.zip"], instructions: "Download files.", revisionPolicy: "3 revisions included.", licenseTerms: "Client project use only.", assetRightsStatus: "Approved", internalQCStatus: "Passed", deliveryMessage: "Here are your files.", paymentStatus: "Verified" });
console.log(runDeliveryQa(packet));
console.log(generateDeliveryMessage(packet));

