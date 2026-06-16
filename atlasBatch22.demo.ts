import { createContentProject, generateProductionPlan, generateStudioRecommendation } from "./contentStudioCommandEngine";
import { createScriptProject, generateHookOptions, generateFullScript, extractShorts } from "./scriptStudioEngine";
import { createContentQcRecord, runContentQc } from "./contentQcApprovalEngine";
import { createEditPlan, generateTimelineStructure, generateResolveScriptPrompt } from "./davinciEditPlannerEngine";
import { createAssetRequest, generateAssetBrief, generateImagePrompt } from "./assetGenerationRequestEngine";
import { generateShotListFromScript, generateBrollIdeas } from "./shotListBrollEngine";
import { createThumbnailProject, generateThumbnailConcepts, generateDesignerBrief } from "./thumbnailCommandEngine";
import { createCaptionProject, importTranscript, runCaptionQa, generateSrtPlaceholder } from "./captionSubtitleEngine";
import { createAudioRecord, checkAudioRights, generateAudioUsageNotes } from "./musicSfxLibraryEngine";
import { createVoiceoverPlan, estimateVoiceoverLength, estimateCreditUsage, generateVoiceDirection } from "./voiceoverProductionEngine";

console.log("Content Studio Command Center");
const project = createContentProject({ id: "demo-content", projectTitle: "Creator Logistics Promo", brand: "Creator Logistics", contentType: "creator promo", targetAudience: "creators", relatedLandingPage: "/creator-logistics" });
console.log(generateProductionPlan(project));
console.log(generateStudioRecommendation({ projects: [project] }));

console.log("\nScript Studio");
const script = createScriptProject({ id: "demo-script", scriptTitle: "Technology as Fire", brand: "The New Prometheus", goal: "explain ethical automation", targetAudience: "builders", CTA: "Explore AveryTech" });
console.log(generateHookOptions(script));
console.log(generateFullScript(script));
console.log(extractShorts(script));

console.log("\nContent QC and Approval Theater");
const qc = createContentQcRecord({ id: "demo-qc", contentTitle: "New Prometheus Essay", contentType: "YouTube essay", scriptApprovalStatus: "Approved", assetRightsStatus: "Approved", claimsReviewStatus: "Approved", finalFile: "final.mp4", uploadPackage: "ready", thumbnail: "honest", title: "Technology as Fire" });
console.log(runContentQc("demo-qc"));

console.log("\nDaVinci Edit Planner");
const edit = createEditPlan({ id: "demo-edit", projectTitle: "AveryTech Demo", videoType: "product demo", targetPlatform: "YouTube", aspectRatio: "16:9", assetRightsStatus: "Approved", approvalStatus: "Approved" });
console.log(generateTimelineStructure(edit));
console.log(generateResolveScriptPrompt(edit));

console.log("\nAsset Generation Request Board");
const asset = createAssetRequest({ id: "demo-asset", requestTitle: "Thumbnail Fire", assetType: "thumbnail image", brand: "New Prometheus", purpose: "public YouTube thumbnail", rightsStatus: "Needs Review" });
console.log(generateAssetBrief(asset));
console.log(generateImagePrompt(asset));

console.log("\nShot List and B-Roll Builder");
console.log(generateShotListFromScript({ scriptTitle: "Promo", outline: ["hook", "problem", "CTA"] }));
console.log(generateBrollIdeas(script));

console.log("\nThumbnail Command Center");
const thumb = createThumbnailProject({ id: "demo-thumb", thumbnailTitle: "Creator Promo", brand: "Creator Logistics", concept: "honest service", assetRightsStatus: "Approved" });
console.log(generateThumbnailConcepts(thumb));
console.log(generateDesignerBrief(thumb));

console.log("\nCaption and Subtitle Workflow");
createCaptionProject({ id: "demo-cap", projectTitle: "Short", platform: "Instagram" });
importTranscript("demo-cap", "This is a public caption. One next step counts.");
console.log(runCaptionQa("demo-cap"));
console.log(generateSrtPlaceholder("demo-cap"));

console.log("\nMusic and SFX Library");
createAudioRecord({ id: "demo-audio", audioName: "Safe Music Bed", audioType: "music bed", licenseType: "Royalty Free", commercialUseAllowed: true, attributionRequired: false });
console.log(checkAudioRights("demo-audio"));
console.log(generateAudioUsageNotes("demo-audio"));

console.log("\nVoiceover Production Planner");
const voice = createVoiceoverPlan({ id: "demo-voice", projectTitle: "AveryTech Demo", script: "This is a short approved script.", scriptApprovalStatus: "Approved", voiceType: "polished founder", platform: "public demo", usageRights: "commercial public" });
console.log(estimateVoiceoverLength(voice.script));
console.log(estimateCreditUsage(voice.script));
console.log(generateVoiceDirection(voice));

