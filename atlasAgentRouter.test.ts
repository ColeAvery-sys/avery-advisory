import { atlasAgentRouter } from "./atlasAgentRouter";

const grantRoute = atlasAgentRouter({
  rawInput: "Find WV disability funding eligibility and prepare an SBA grant application.",
  grantRelated: true,
  urgency: 8,
});

assertEqual(grantRoute.assignedAgent, "ATLAS Grant Officer");
assertEqual(grantRoute.detectedDepartment, "Grants and Funding");
assertEqual(grantRoute.requiresColeApproval, false);

const clientRoute = atlasAgentRouter({
  rawInput: "Send the client a video delivery update with timestamps and revisions.",
  clientRelated: true,
});

assertEqual(clientRoute.assignedAgent, "Creator Logistics Manager");
assertEqual(clientRoute.requiresColeApproval, true);

const productRoute = atlasAgentRouter({
  rawInput: "Fix the dashboard database bug and add API automation.",
  productRelated: true,
});

assertEqual(productRoute.assignedAgent, "Product Manager");
assertEqual(productRoute.detectedDepartment, "Product and Engineering");

const salesRoute = atlasAgentRouter({
  rawInput: "Draft follow-up emails for pricing leads.",
});

assertEqual(salesRoute.assignedAgent, "Sales Assistant");

const legalRoute = atlasAgentRouter({
  rawInput: "Review the contract, invoice, taxes, and business credit risk.",
  moneyRelated: true,
  legalRelated: true,
});

assertEqual(legalRoute.assignedAgent, "Legal/Finance Reviewer");
assertEqual(legalRoute.requiresColeApproval, true);

const personalRoute = atlasAgentRouter({
  rawInput: "Make a daily plan around college appointments and overwhelm.",
  personalRelated: true,
});

assertEqual(personalRoute.assignedAgent, "Chief of Staff");
assertEqual(personalRoute.detectedDepartment, "Personal Operations");

const fallbackRoute = atlasAgentRouter({
  rawInput: "Figure out what to do with this random note.",
});

assertEqual(fallbackRoute.assignedAgent, "Chief of Staff");
assertEqual(fallbackRoute.requiresColeApproval, false);
assertEqual(fallbackRoute.tags.includes("needs-review"), true);

assertThrows(() =>
  atlasAgentRouter({
    rawInput: "Invalid urgency.",
    urgency: 11,
  }),
);

console.log("All atlasAgentRouter tests passed.");

function assertEqual<T>(actual: T, expected: T): void {
  if (actual !== expected) {
    throw new Error(`Expected ${JSON.stringify(expected)}, received ${JSON.stringify(actual)}.`);
  }
}

function assertThrows(callback: () => void): void {
  let threw = false;

  try {
    callback();
  } catch {
    threw = true;
  }

  if (!threw) {
    throw new Error("Expected function to throw.");
  }
}
