import { countBy } from "./audienceSafety";

export function createResearchDataset(data: any) {
  return { ...data, createdAt: data.createdAt || new Date(0).toISOString() };
}

export function identifyTopTopics(data: any) {
  const items = data.items || [];
  return Object.entries(countBy(items, (item: any) => item.topic || item.keyword)).sort((a: any, b: any) => b[1] - a[1]).map(([topic, count]) => ({ topic, count }));
}

export function identifyFastestGrowingInterests(data: any) {
  return (data.interests || []).sort((a: any, b: any) => (b.current - b.previous) - (a.current - a.previous)).map((item: any) => ({ interest: item.interest, growth: item.current - item.previous }));
}

export function generateAudienceResearchOutputs(data: any) {
  const topTopics = identifyTopTopics(data);
  return {
    contentIdeas: topTopics.map((topic: any) => `Make a video/post answering ${topic.topic}`),
    productIdeas: (data.productRequests || []).map((request: any) => `Product idea: ${request}`),
    serviceIdeas: (data.painPoints || []).map((pain: any) => `Service angle for ${pain}`),
    leadMagnetIdeas: topTopics.map((topic: any) => `${topic.topic} checklist`),
    grantEvidence: (data.communityQuestions || []).slice(0, 5),
  };
}

