import { createContentProject, generateProductionPlan, identifyContentWaitingOnCole, identifyMissingAssets, generateStudioRecommendation, routeContentToNextStage } from "./contentStudioCommandEngine";
import { createScriptProject, generateHookOptions, generateFullScript, generateSaferClaimsVersion, extractShorts, validateScriptClaims } from "./scriptStudioEngine";
import { createContentQcRecord, runContentQc, approveForManualPublish, approveForClientDelivery } from "./contentQcApprovalEngine";
import { createEditPlan, generateTimelineStructure, generateResolveScriptPrompt, validateEditPlan, routeEditToFulfillment } from "./davinciEditPlannerEngine";
import { createAssetRequest, generateImagePrompt, markAssetGeneratedManually, attachAssetToProject, sendAssetToRightsTracker } from "./assetGenerationRequestEngine";
import { createShotList, generateShotListFromScript, generateBrollIdeas, flagMissingAssets, routeAssetRequests, sendShotListToEditPlanner } from "./shotListBrollEngine";
import { createThumbnailProject, generateThumbnailConcepts, validateThumbnailRisks, markThumbnailFinalManually } from "./thumbnailCommandEngine";
import { createCaptionProject, importTranscript, generateSrtPlaceholder, runCaptionQa, exportCaptionFile } from "./captionSubtitleEngine";
import { createAudioRecord, checkAudioRights, attachAudioToProject, flagUnknownAudioRights } from "./musicSfxLibraryEngine";
import { createVoiceoverPlan, estimateVoiceoverLength, estimateCreditUsage, markAudioGeneratedManually, logVoiceoverRights } from "./voiceoverProductionEngine";

const project = createContentProject({ id: "content-1", projectTitle: "Creator Logistics Promo", brand: "Creator Logistics", contentType: "creator promo", targetAudience: "creators", scriptStatus: "Needed", thumbnailStatus: "Needed", approvalStatus: "Needs Cole Approval", relatedLandingPage: "/creator-logistics" });
assertEqual(generateProductionPlan(project).approvalRequired, true);
assertEqual(identifyContentWaitingOnCole({ projects: [project] }).length, 1);
assertEqual(identifyMissingAssets(project).indexOf("script") >= 0, true);
assertEqual(generateStudioRecommendation({ projects: [project] }).topProject.projectTitle, "Creator Logistics Promo");
assertEqual(routeContentToNextStage("content-1").nextStage, "script");

const script = createScriptProject({ id: "script-1", scriptTitle: "ATLAS Assist Explainer", brand: "AveryTech", goal: "explain disability support without medical claims", targetAudience: "partners", fullScript: "This will cure executive dysfunction." });
assertEqual(generateHookOptions(script).length, 3);
assertEqual(generateFullScript(script).approvalRequired, true);
assertEqual(validateScriptClaims(script).valid, false);
assertEqual(generateSaferClaimsVersion(script).text.indexOf("support") >= 0, true);
assertEqual(extractShorts(script).length, 3);

const badQc = createContentQcRecord({ id: "qc-1", contentTitle: "Client Video", contentType: "client video", scriptApprovalStatus: "Approved", assetRightsStatus: "Unknown", claimsReviewStatus: "Approved", finalFile: "final.mp4", uploadPackage: "ready", clientInfoRemoved: true });
assertEqual(runContentQc("qc-1").QCStatus, "Failed");
assertThrows(() => approveForClientDelivery("qc-1", { approvedByCole: true }));

const goodQc = createContentQcRecord({ id: "qc-2", contentTitle: "New Prometheus Essay", contentType: "YouTube essay", scriptApprovalStatus: "Approved", assetRightsStatus: "Approved", claimsReviewStatus: "Approved", finalFile: "final.mp4", uploadPackage: "ready", thumbnail: "honest", title: "Technology as Fire" });
assertThrows(() => approveForManualPublish("qc-2"));
assertEqual(approveForManualPublish("qc-2", { approvedByCole: true }).approvalStatus, "Approved for Manual Publish");

const edit = createEditPlan({ id: "edit-1", projectTitle: "AveryTech Demo", videoType: "product demo", targetPlatform: "YouTube", aspectRatio: "16:9", assetRightsStatus: "Approved", approvalStatus: "Approved" });
assertEqual(generateTimelineStructure(edit).length > 3, true);
assertEqual(generateResolveScriptPrompt(edit).indexOf("DaVinci") >= 0, true);
assertEqual(validateEditPlan(edit).valid, true);
assertEqual(routeEditToFulfillment("edit-1").destination, "Content QC Theater");

const asset = createAssetRequest({ id: "asset-1", requestTitle: "Thumbnail Fire", assetType: "thumbnail image", brand: "New Prometheus", purpose: "public YouTube thumbnail", rightsStatus: "Unknown", notes: "paid generation" });
assertEqual(generateImagePrompt(asset).indexOf("Avoid copyrighted") >= 0, true);
assertThrows(() => markAssetGeneratedManually("asset-1", "thumb.png"));
markAssetGeneratedManually("asset-1", "thumb.png", { approvedByCole: true });
assertThrows(() => attachAssetToProject("asset-1", "content-1"));
assertEqual(sendAssetToRightsTracker("asset-1").licenseType, "Unknown");

const shotList = createShotList({ id: "shot-1", projectTitle: "Promo", shots: generateShotListFromScript({ scriptTitle: "Promo", outline: ["hook", "proof"] }) });
assertEqual(generateBrollIdeas({}).length, 5);
assertEqual(flagMissingAssets(shotList).length, 2);
assertEqual(routeAssetRequests(shotList).length, 2);
assertEqual(sendShotListToEditPlanner("shot-1").projectTitle, "Promo");

const thumb = createThumbnailProject({ id: "thumb-1", thumbnailTitle: "Creator Promo", brand: "Creator Logistics", concept: "honest service", assetRightsStatus: "Unknown" });
assertEqual(generateThumbnailConcepts(thumb).length, 3);
assertEqual(validateThumbnailRisks(thumb).valid, false);
assertThrows(() => markThumbnailFinalManually("thumb-1", { approvedByCole: true }));

const caption = createCaptionProject({ id: "cap-1", projectTitle: "Short", platform: "Instagram" });
importTranscript("cap-1", "This is a public caption. One next step counts.");
assertEqual(generateSrtPlaceholder("cap-1").indexOf("00:00") >= 0, true);
assertEqual(runCaptionQa("cap-1").QAStatus, "Passed");
assertEqual(exportCaptionFile("cap-1", "SRT").format, "SRT");

const audio = createAudioRecord({ id: "audio-1", audioName: "Mystery Track", audioType: "music bed", licenseType: "Unknown", commercialUseAllowed: false });
assertEqual(checkAudioRights("audio-1").allowed, false);
assertThrows(() => attachAudioToProject("audio-1", "content-1"));
assertEqual(flagUnknownAudioRights("audio-1").publicUseBlocked, true);

const voice = createVoiceoverPlan({ id: "voice-1", projectTitle: "AveryTech Demo", script: "This is a short approved script.", scriptApprovalStatus: "Approved", platform: "public demo", usageRights: "commercial public" });
assertEqual(estimateVoiceoverLength(voice.script).estimatedMinutes, 1);
assertEqual(estimateCreditUsage(voice.script).estimatedCredits, voice.script.length);
assertThrows(() => markAudioGeneratedManually("voice-1", "voice.mp3"));
assertEqual(markAudioGeneratedManually("voice-1", "voice.mp3", { approvedByCole: true }).generatedAudioStatus, "Generated Manually");
assertEqual(logVoiceoverRights("voice-1").approvalRequired, true);

console.log("All ATLAS Batch 22 tests passed.");

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

