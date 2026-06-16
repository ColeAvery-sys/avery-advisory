import { generateSalesPlan } from "./salesCommandEngine";
import { scoreLead } from "./leadScoringEngine";
import { createDeal, generateNextDealAction, clearDealsForDemo } from "./dealPipelineEngine";
import { calculateQuote } from "./pricingCalculatorEngine";
import { createProposal, generateProposalDraft, clearProposalsForDemo } from "./proposalBuilderEngine";
import { generateDiscoveryScript } from "./salesScriptEngine";
import { createObjectionRecord, generateObjectionResponse, clearObjectionsForDemo } from "./objectionHandlingEngine";
import { createFollowUpSequence, getNextFollowUpForLead, clearSequencesForDemo } from "./followUpSequenceEngine";
import { generateSalesCallPrep } from "./salesCallPrepEngine";
import { generateRevenueForecast } from "./revenueForecastEngine";

clearDealsForDemo();
clearProposalsForDemo();
clearObjectionsForDemo();
clearSequencesForDemo();

const lead = {
  leadName: "Creator Demo Lead",
  organization: "Demo Channel",
  source: "Creator Logistics page",
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

console.log("Lead Scoring");
console.log(scoreLead(lead));

console.log("\nSales Command");
console.log(generateSalesPlan({ leads: [lead], deals: [], date: "2099-01-05" }));

console.log("\nDeal Pipeline");
createDeal({ id: "deal-demo", dealName: "Creator Growth Package", contact: "Creator Demo Lead", offer: "Growth", estimatedValue: 1200, stage: "Proposal Drafting", followUpDate: "2099-01-05" });
console.log(generateNextDealAction("deal-demo"));

console.log("\nPricing Calculator");
console.log(calculateQuote({ serviceType: "Creator Logistics", numberOfVideos: 3, numberOfShortClips: 30, rush: true, complexity: 6, captionsNeeded: true, uploadCalendarNeeded: true, contractorNeeded: true, estimatedHours: 15, desiredMargin: 0.5, clientBudget: 700, revisionRisk: 8 }));

console.log("\nProposal Builder");
const proposal = createProposal({ id: "proposal-demo", proposalTitle: "Creator Logistics Growth Proposal", clientName: "Creator Demo Lead", problemSummary: "Too much footage and no clip system", proposedSolution: "Organize videos into clips and upload plan", deliverables: ["clip opportunities", "timestamps", "calendar"], timeline: "2 weeks", pricingRange: "Estimated range: $900 to $1,400", revisionPolicy: "3 revisions included", responsibilities: ["send footage", "approve direction"], assumptions: ["final scope approved by Cole"], nextSteps: ["Cole approval", "manual send"], approvalStatus: "Draft" });
console.log(generateProposalDraft(proposal));

console.log("\nSales Script");
console.log(generateDiscoveryScript({ contact: "Creator", offer: "Growth" }));

console.log("\nObjection Handling");
const objection = createObjectionRecord({ id: "obj-demo", objection: "Can you guarantee growth?", category: "Need results guaranteed", approvalStatus: "Draft" });
console.log(generateObjectionResponse(objection, { offer: "Growth" }));

console.log("\nFollow-Up Sequence");
const sequence = createFollowUpSequence({ id: "seq-demo", sequenceName: "Warm Creator Lead", audience: "Creator", trigger: "lead form", numberOfSteps: 2, intervalDays: 3, stopCondition: "lead says no", approvalStatus: "Draft" });
console.log(getNextFollowUpForLead({ id: "lead-demo" }, sequence));

console.log("\nSales Call Prep");
console.log(generateSalesCallPrep({ contact: "Creator", interestType: "Creator Logistics", budget: "$1000", timeline: "soon", callGoal: "qualify for Growth package" }));

console.log("\nRevenue Forecast");
console.log(generateRevenueForecast({ deals: [{ estimatedValue: 1200, probability: 0.55, stage: "Proposal Sent Manually" }], invoices: [{ amount: 750, status: "Paid" }], grants: [{ amount: 10000, probability: 0.1 }], moneyPipeline: [{ amount: 5000, status: "Speculative" }], recurringRevenue: [{ amount: 2000 }] }));
