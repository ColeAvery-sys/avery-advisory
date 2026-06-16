import {
  clearWholesalingLeadsForDemo,
  createWholesalingLead,
  generateWholesalingDueDiligence,
  generateWholesalingOfferDraft,
  rankWholesalingLeads,
} from "./realEstateWholesalingEngine";

clearWholesalingLeadsForDemo();

const lead = createWholesalingLead({
  propertyName: "Cedar Court Triplex",
  address: "41 Cedar Court, Columbus, OH",
  sellerName: "Morgan Lee",
  contactSource: "Referral",
  askingPrice: 175000,
  arv: 295000,
  repairEstimate: 42000,
  desiredAssignmentFee: 12000,
  distressLevel: 8,
  speedToClose: 7,
  accessScore: 7,
  titleClarity: 8,
  buyerDemand: 8,
  stage: "Offer Drafting",
});

console.log(JSON.stringify({ ranking: rankWholesalingLeads(), offerDraft: generateWholesalingOfferDraft(lead.id), dueDiligence: generateWholesalingDueDiligence(lead.id) }, null, 2));
