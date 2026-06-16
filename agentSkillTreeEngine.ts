const skillTrees: any[] = [];

export function createAgentSkillTree(tree: any) {
  const stored = { ...tree, id: tree.id || `skill-tree-${skillTrees.length + 1}`, levels: tree.levels || defaultLevels(tree.category || "Operations") };
  skillTrees.push(stored);
  return stored;
}

export function calculateAgentLevel(agent: any, treeId: string) {
  const tree = findTree(treeId);
  const trust = Number(agent.trustScore || 0);
  const certs = (agent.certifications || []).length;
  const index = Math.min(tree.levels.length - 1, Math.floor((trust + certs * 10) / 25));
  return tree.levels[index];
}

export function recommendNextSkill(agent: any, treeId: string) {
  const tree = findTree(treeId);
  const current = calculateAgentLevel(agent, treeId);
  const index = tree.levels.indexOf(current);
  return tree.levels[Math.min(tree.levels.length - 1, index + 1)];
}

export function listSkillTrees() {
  return skillTrees.slice();
}

function defaultLevels(category: string) {
  return [`${category} Assistant`, `${category} Specialist`, `${category} Strategist`, `${category} Director`, `${category} Architect`];
}

function findTree(treeId: string) {
  const tree = skillTrees.find((item) => item.id === treeId);
  if (!tree) throw new Error(`Skill tree ${treeId} not found.`);
  return tree;
}
