const nodes: any[] = [];
const edges: any[] = [];

export function createKnowledgeNode(node: any) {
  const stored = { ...node, id: node.id || `${node.type}-${nodes.length + 1}` };
  nodes.push(stored);
  return stored;
}

export function createKnowledgeEdge(edge: any) {
  const stored = { ...edge, id: edge.id || `edge-${edges.length + 1}` };
  edges.push(stored);
  return stored;
}

export function buildBusinessKnowledgeGraph(data: any) {
  (data.clients || []).forEach((client: any) => createKnowledgeNode({ id: client.id, type: "Client", label: client.name || client.clientName }));
  (data.products || []).forEach((product: any) => createKnowledgeNode({ id: product.id, type: "Product", label: product.name || product.productName }));
  (data.channels || []).forEach((channel: any) => createKnowledgeNode({ id: channel.id, type: "Channel", label: channel.name || channel.platform }));
  (data.relationships || []).forEach(createKnowledgeEdge);
  return { nodes: nodes.slice(), edges: edges.slice() };
}

export function findRelatedNodes(nodeId: string) {
  const relatedIds = edges.filter((edge) => edge.from === nodeId || edge.to === nodeId).map((edge) => edge.from === nodeId ? edge.to : edge.from);
  return nodes.filter((node) => relatedIds.indexOf(node.id) >= 0);
}

export function getRelatedNodes(nodeId: string) {
  return findRelatedNodes(nodeId);
}

export function explainRelationshipPath(fromId: string, toId: string) {
  const direct = edges.find((edge) => (edge.from === fromId && edge.to === toId) || (edge.from === toId && edge.to === fromId));
  return direct ? `${fromId} -> ${direct.relationship || "related to"} -> ${toId}` : "No direct relationship found.";
}

export function traceCausalPath(startNodeId: string, endNodeId: string) {
  return explainRelationshipPath(startNodeId, endNodeId);
}

export function generateKnowledgeGraphSummary() {
  return {
    nodeCount: nodes.length,
    edgeCount: edges.length,
    nodeTypes: Array.from(new Set(nodes.map((node) => node.type || "Unknown"))),
    relationshipTypes: Array.from(new Set(edges.map((edge) => edge.relationship || "related to"))),
    note: "Relationship map only; causal claims require human review before strategy changes.",
  };
}
