export function generateRevenueForecast(data: Record<string, any>) {
  const deals = data.deals || [];
  const invoices = data.invoices || [];
  const grants = data.grants || [];
  const moneyPipeline = data.moneyPipeline || [];
  const recurringRevenue = data.recurringRevenue || [];

  const confirmedRevenue = sum(invoices.filter((invoice: any) => /paid/i.test(invoice.status || "")).map((invoice: any) => invoice.amount));
  const overdueInvoices = invoices.filter((invoice: any) => /overdue/i.test(invoice.status || ""));
  const weightedPipeline = sum(deals.filter((deal: any) => deal.stage !== "Won" && deal.stage !== "Lost").map((deal: any) => (deal.estimatedValue || 0) * (deal.probability || 0)));
  const expectedRevenue = confirmedRevenue + weightedPipeline + sum(invoices.filter((invoice: any) => /sent|due/i.test(invoice.status || "")).map((invoice: any) => invoice.amount * 0.75));
  const possibleGrants = sum(grants.map((grant: any) => (grant.amount || 0) * (grant.probability || 0.15)));
  const speculativeOpportunities = sum(moneyPipeline.filter((item: any) => /speculative|idea|possible/i.test(item.status || item.type || "")).map((item: any) => item.amount || item.amountPotential || 0));
  const monthlyRecurringPotential = sum(recurringRevenue.map((item: any) => item.amount || 0));

  return {
    confirmedRevenue,
    expectedRevenue: Math.round(expectedRevenue),
    weightedPipeline: Math.round(weightedPipeline),
    possibleGrants: Math.round(possibleGrants),
    speculativeOpportunities,
    overdueInvoices,
    monthlyRecurringPotential,
    conservativeScenario: confirmedRevenue + Math.round(weightedPipeline * 0.4),
    realisticScenario: Math.round(expectedRevenue),
    bestCaseScenario: Math.round(expectedRevenue + possibleGrants + speculativeOpportunities * 0.25),
    warnings: buildWarnings(overdueInvoices, grants, moneyPipeline),
    recommendations: ["Show conservative forecast first.", "Separate grants from sales revenue.", "Do not count unapproved deals as won."],
  };
}

function buildWarnings(overdueInvoices: any[], grants: any[], moneyPipeline: any[]): string[] {
  const warnings: string[] = [];
  if (overdueInvoices.length) warnings.push("Overdue invoices create cash risk.");
  if (grants.length) warnings.push("Grants are separate from sales revenue and should not be treated as confirmed.");
  if (moneyPipeline.some((item: any) => /speculative|idea|possible/i.test(item.status || item.type || ""))) warnings.push("Speculative opportunities are not expected revenue.");
  return warnings;
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + (value || 0), 0);
}
