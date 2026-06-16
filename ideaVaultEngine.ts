import { createSharedMemoryRecord } from "./averySharedMemoryEngine";

const ideas: any[] = [];

const allowedCategories = ["Content", "Products", "Apps", "Marketing", "Real Estate", "Philanthropy", "Games", "Automation"];

export function captureIdea(input: any) {
  if (allowedCategories.indexOf(input.category) < 0) throw new Error(`Unsupported idea category ${input.category}.`);
  const stored = {
    id: input.id || `idea-${ideas.length + 1}`,
    title: input.title,
    category: input.category,
    description: input.description || "",
    status: input.status || "Captured",
    createdBy: input.createdBy || "Cole",
    expansions: input.expansions || [],
    assignedDepartments: input.assignedDepartments || distributeIdeaToDepartments(input),
  };
  ideas.push(stored);
  createSharedMemoryRecord({
    id: `memory-${stored.id}`,
    type: "Idea",
    title: stored.title,
    body: stored.description,
    department: "Executive",
    tags: [stored.category],
  });
  return stored;
}

export function expandIdea(ideaOrTitle: any) {
  const title = typeof ideaOrTitle === "string" ? ideaOrTitle : ideaOrTitle.title;
  return {
    idea: title,
    revenueIdeas: [`Sell a simple ${title} offer`, `Create a paid ${title} service package`, `Use ${title} as a lead magnet into Creator Logistics`],
    contentIdeas: [`Behind-the-scenes: building ${title}`, `${title} lessons for creators`, `Short-form explainer: why ${title} matters`],
    grantIdeas: [`Find local innovation grants related to ${title}`, `Map ${title} to accessibility/community outcomes`, `Create evidence packet if ${title} supports mission`],
    marketingIdeas: [`One-page landing page for ${title}`, `Founder post explaining ${title}`, `Simple FAQ and objection handling`],
    prIdeas: [`Local story angle for ${title}`, `Mission-driven founder update`, `Community impact note`],
    socialMediaIdeas: [`3 hooks about ${title}`, `1 carousel explaining ${title}`, `1 short video pitch for ${title}`],
  };
}

export function expandCapturedIdea(ideaId: string) {
  const idea = findIdea(ideaId);
  idea.expansions = expandIdea(idea);
  return idea;
}

export function distributeIdeaToDepartments(idea: any) {
  const departments = new Set<string>();
  departments.add("Marketing");
  const text = `${idea.title} ${idea.category} ${idea.description || ""}`.toLowerCase();
  if (/revenue|service|client|sell|offer|lead|food truck/.test(text)) departments.add("Sales");
  if (/app|automation|software|tool|atlas/.test(text)) departments.add("ATLAS Systems");
  if (/grant|donor|nonprofit|community|accessibility|philanthropy/.test(text)) departments.add("Philanthropy");
  if (/content|video|youtube|social|story/.test(text)) departments.add("Marketing");
  if (/game|film|music|show|entertainment/.test(text)) departments.add("Entertainment");
  if (/building|property|real estate|truck|space/.test(text)) departments.add("Real Estate");
  return Array.from(departments);
}

export function getIdeas() {
  return ideas.slice();
}

function findIdea(ideaId: string) {
  const idea = ideas.find((item) => item.id === ideaId);
  if (!idea) throw new Error(`Idea ${ideaId} not found.`);
  return idea;
}
