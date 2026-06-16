import { generateSalesPlan } from "./salesCommandEngine";
import { scoreLead } from "./leadScoringEngine";
import { createDeal, generateNextDealAction, markDealWon, clearDealsForDemo } from "./dealPipelineEngine";
import { calculateQuote } from "./pricingCalculatorEngine";
import { createProposal, generateProposalDraft, markProposalApproved, clearProposalsForDemo } from "./proposalBuilderEngine";
import { generateDiscoveryScript, saveScriptToSop } from "./salesScriptEngine";
import { createObjectionRecord, generateObjectionResponse, clearObjectionsForDemo } from "./objectionHandlingEngine";
import { createFollowUpSequence, getNextFollowUpForLead, stopSequenceForLead, clearSequencesForDemo } from "./followUpSequenceEngine";
import { generateSalesCallPrep } from "./salesCallPrepEngine";
import { generateRevenueForecast } from "./revenueForecastEngine";

clearDealsForDemo();
clearProposalsForDemo();
clearObjectionsForDemo();
clearSequencesForDemo();

const lead = {
  leadName: "Creator Lead",
  organization: "Creator Co",
  source: "Website",
  interestType: "Creator Logistics clips",
  budgetRange: "$750 to $1,500",
  urgency: 9,
  painLevel: 9,
  fitScore: 9,
  abilityToPay: 8,
  decisionMakerStatus: "Founder",
  timeline: "this week",
  relationshipWarmth: 8,
  strategicValue: 6,
  riskFlags: [],
};
const scored = scoreLead(lead);
assertEqual(scored.leadQuality, "Hot");
assertEqual(scored.recommendedOffer, "Creator Logistics Growth");
assertEqual(scored.suggestedMessage.indexOf("Draft only") >= 0, true);

const plan = generateSalesPlan({ leads: [lead], deals: [], date: "2099-01-05" });
assertEqual(plan.hotLeads.length, 1);
assertEqual(plan.tasks[0].approvalRequired, true);

const deal = createDeal({
  id: "deal-1",
  dealName: "Creator Growth Package",
  contact: "Creator Lead",
  offer: "Growth",
  estimatedValue: 1200,
  stage: "Proposal Drafting",
  followUpDate: "2099-01-05",
});
assertEqual(generateNextDealAction("deal-1").approvalRequired, true);
assertThrows(() => markDealWon("deal-1", { approvedByCole: false }));
assertEqual(markDealWon("deal-1", { approvedByCole: true }).stage, "Won");

const quote = calculateQuote({
  serviceType: "Creator Logistics",
  numberOfVideos: 3,
  numberOfShortClips: 30,
  rush: true,
  complexity: 6,
  captionsNeeded: true,
  uploadCalendarNeeded: true,
  scriptRepurposingNeeded: false,
  contractorNeeded: true,
  estimatedHours: 15,
  desiredMargin: 0.5,
  clientBudget: 700,
  revisionRisk: 8,
});
assertEqual(quote.approvalRequired, true);
assertEqual(quote.riskWarnings.length > 0, true);

const proposal = createProposal({
  id: "proposal-1",
  proposalTitle: "Creator Logistics Growth Proposal",
  clientName: "Creator Lead",
  problemSummary: "Too much footage and no clip system",
  proposedSolution: "Organize videos into clips and upload plan",
  deliverables: ["clip opportunities", "timestamps", "calendar"],
  timeline: "2 weeks",
  pricingRange: "Estimated range: $900 to $1,400",
  revisionPolicy: "3 revisions included",
  responsibilities: ["send footage", "approve direction"],
  assumptions: ["final scope approved by Cole"],
  nextSteps: ["Cole approval", "manual send"],
  approvalStatus: "Draft",
});
assertEqual(generateProposalDraft(proposal).approvalRequired, true);
assertThrows(() => markProposalApproved("proposal-1", { approvedByCole: false }));
assertEqual(markProposalApproved("proposal-1", { approvedByCole: true }).approvalStatus, "Approved");

const script = generateDiscoveryScript({ contact: "Creator", offer: "Growth" });
assertEqual(script.approvalRequired, true);
assertEqual(saveScriptToSop(script).approvalRequired, true);

const objection = createObjectionRecord({ id: "obj-1", objection: "Can you guarantee growth?", category: "Need results guaranteed", approvalStatus: "Draft" });
assertEqual(generateObjectionResponse(objection, { offer: "Growth" }).approvalRequired, true);
assertEqual(objection.riskWarning!.indexOf("guarantee") >= 0, true);

const sequence = createFollowUpSequence({
  id: "seq-1",
  sequenceName: "Warm Creator Lead",
  audience: "Creator",
  trigger: "lead submitted form",
  numberOfSteps: 2,
  intervalDays: 3,
  stopCondition: "lead says no",
  approvalStatus: "Draft",
});
assertEqual(getNextFollowUpForLead({ id: "lead-1" }, sequence).approvalRequired, true);
assertEqual(stopSequenceForLead("lead-1", "Do not contact").stopped, true);

const prep = generateSalesCallPrep({ contact: "Creator", interestType: "Creator Logistics", budget: "$1000", timeline: "soon", callGoal: "qualify" });
assertEqual(prep.followUpDraft.approvalRequired, true);

const forecast = generateRevenueForecast({
  deals: [{ estimatedValue: 1000, probability: 0.5, stage: "Proposal Sent Manually" }],
  invoices: [{ amount: 750, status: "Paid" }, { amount: 300, status: "Overdue" }],
  grants: [{ amount: 10000, probability: 0.1 }],
  moneyPipeline: [{ amount: 5000, status: "Speculative" }],
  recurringRevenue: [{ amount: 2000 }],
});
assertEqual(forecast.confirmedRevenue, 750);
assertEqual(forecast.possibleGrants, 1000);
assertEqual(forecast.warnings.length > 0, true);

console.log("All ATLAS Batch 14 tests passed.");

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
