import { createNetworkGate } from "./atlasNetworkSafety";

const nodes: any[] = [];
const links: any[] = [];

export function createMeshNode(node: any) {
  const stored = { ...node, id: node.id || `mesh-${nodes.length + 1}` };
  nodes.push(stored);
  return stored;
}

export function createMeshLink(link: any) {
  const stored = { ...link, id: link.id || `mesh-link-${links.length + 1}` };
  links.push(stored);
  return stored;
}

export function traceKnowledgePath(fromId: string, toId: string) {
  const direct = links.find((link) => (link.from === fromId && link.to === toId) || (link.from === toId && link.to === fromId));
  return direct ? [fromId, direct.relationship || "related to", toId] : [];
}

export function getMeshNeighbors(nodeId: string) {
  const ids = links.filter((link) => link.from === nodeId || link.to === nodeId).map((link) => link.from === nodeId ? link.to : link.from);
  return nodes.filter((node) => ids.indexOf(node.id) >= 0);
}

export function generateKnowledgeMeshSummary() {
  return { nodeCount: nodes.length, linkCount: links.length, nodeTypes: Array.from(new Set(nodes.map((node) => node.type || "Unknown"))), ...createNetworkGate("Knowledge mesh summary") };
}
