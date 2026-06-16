import {
  calculateMaximumAllowableOffer,
  clearWholesalingLeadsForDemo,
  createWholesalingLead,
  generateWholesalingDueDiligence,
  generateWholesalingOfferDraft,
  rankWholesalingLeads,
  scoreWholesalingLead,
} from "./realEstateWholesalingEngine";

clearWholesalingLeadsForDemo();

const strongLead = createWholesalingLead({
  propertyName: "Maple Street Duplex",
  address: "123 Maple Street, Dayton, OH",
  sellerName: "Jordan Smith",
  contactSource: "Direct mail",
  askingPrice: 160000,
  arv: 280000,
  repairEstimate: 35000,
  desiredAssignmentFee: 12000,
  distressLevel: 9,
  speedToClose: 8,
  accessScore: 8,
  titleClarity: 9,
  buyerDemand: 8,
  stage: "Underwriting",
});

const weakLead = createWholesalingLead({
  propertyName: "Oak Avenue SFR",
  address: "88 Oak Avenue, Dayton, OH",
  sellerName: "Casey Jones",
  contactSource: "Bandit sign",
  askingPrice: 260000,
  arv: 280000,
  repairEstimate: 40000,
  desiredAssignmentFee: 10000,
  distressLevel: 2,
  speedToClose: 2,
  accessScore: 3,
  titleClarity: 3,
  buyerDemand: 2,
});

assertEqual(strongLead.id, "wholesale-1");
assertEqual(strongLead.approvalRequiredBeforeOfferOrMarketing, true);
assertEqual(strongLead.approvalGate.approvalStatus, "Needs Cole Approval");
assertEqual(strongLead.maxOffer <= strongLead.arv, true);
assertEqual(strongLead.score > weakLead.score, true);
assertEqual(rankWholesalingLeads()[0].propertyName, "Maple Street Duplex");
assertEqual(generateWholesalingOfferDraft(strongLead.id).approvalRequired, true);
assertEqual(generateWholesalingOfferDraft(strongLead.id).sendStatus, "Draft Only");
assertEqual(generateWholesalingDueDiligence(strongLead.id).checklist.includes("Title search and liens reviewed"), true);
assertEqual(calculateMaximumAllowableOffer(strongLead), 149000);
assertEqual(scoreWholesalingLead(strongLead), strongLead.score);
assertEqual(scoreWholesalingLead(weakLead) < strongLead.score, true);

console.log("All real estate wholesaling tests passed.");

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
}
