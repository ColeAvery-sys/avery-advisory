export function generateProductSnapshot(data: Record<string, any>) {
  const products = data.products || [];
  const blockedProducts = identifyBlockedProducts(data);
  const nextBuildActions = identifyNextBuildActions(data);
  return {
    activeProducts: products,
    blockedProducts,
    nextBuildActions,
    recommendation: generateProductRecommendation(data),
    tasks: createProductTasks(generateProductRecommendation(data)),
    safetyNote: "Public, client, grant, or funder readiness requires QA and Cole approval.",
  };
}

export function identifyBlockedProducts(data: Record<string, any>) {
  const bugs = data.bugs || [];
  return (data.products || []).filter((product: any) => bugs.some((bug: any) => bug.product === product.productName && /Critical|High/i.test(bug.severity || "")));
}

export function identifyNextBuildActions(data: Record<string, any>) {
  return (data.products || []).map((product: any) => ({ productName: product.productName, nextBuildAction: product.nextBuildAction || "Fix blocker bugs, then complete QA checks.", priority: calculateProductPriority(product) })).sort((a: any, b: any) => b.priority - a.priority);
}

export function calculateProductPriority(product: Record<string, any>): number {
  const strategic = /ATLAS HQ|ATLAS Intake|Creator Logistics Portal|ATLAS Assist/i.test(product.productName || "") ? 30 : 10;
  const demo = (product.demoReadinessScore || 0) * 0.2;
  const mvp = (product.mvpReadinessScore || 0) * 0.2;
  const blockers = (product.openBugs || 0) * 8;
  return Math.round(strategic + demo + mvp + blockers);
}

export function generateProductRecommendation(data: Record<string, any>): string {
  if (identifyBlockedProducts(data).length) return "Fix blocker bugs before building new shiny features.";
  return "Prioritize ATLAS HQ, ATLAS Intake, Creator Logistics Portal, and ATLAS Assist toward demo-ready workflows.";
}

export function createProductTasks(recommendation: string) {
  return [{ id: "product-task-1", title: recommendation, approvalRequired: /public|client|grant|funder/i.test(recommendation) }];
}
