/**
 * @typedef {Object} AtlasItemInput
 * @property {string} title
 * @property {string} description
 * @property {string} [category]
 * @property {number} earlyProfit
 * @property {number} turnaroundSpeed
 * @property {number} longevity
 * @property {number} fundingPotential
 * @property {number} buildDifficulty
 * @property {number} urgency
 * @property {number} personalImportance
 */

/**
 * @typedef {"Critical" | "High" | "Medium" | "Low"} Priority
 */

/**
 * @typedef {Object} AtlasScoreResult
 * @property {number} score
 * @property {Priority} priority
 * @property {string} department
 * @property {string} nextAction
 * @property {string[]} reasoning
 */

const WEIGHTS = {
  earlyProfit: 0.25,
  turnaroundSpeed: 0.2,
  longevity: 0.2,
  fundingPotential: 0.15,
  urgency: 0.1,
  personalImportance: 0.1,
};

const REQUIRED_NUMBER_FIELDS = [
  "earlyProfit",
  "turnaroundSpeed",
  "longevity",
  "fundingPotential",
  "buildDifficulty",
  "urgency",
  "personalImportance",
];

/**
 * Scores an ATLAS item on a 0-100 scale and returns priority guidance.
 *
 * Build difficulty is treated as friction instead of a full negative weight:
 * a 1/10 difficulty subtracts nothing, while a 10/10 subtracts 9 points.
 *
 * @param {AtlasItemInput} item
 * @returns {AtlasScoreResult}
 */
function scoreAtlasItem(item) {
  validateAtlasItem(item);

  const weightedScore =
    item.earlyProfit * 10 * WEIGHTS.earlyProfit +
    item.turnaroundSpeed * 10 * WEIGHTS.turnaroundSpeed +
    item.longevity * 10 * WEIGHTS.longevity +
    item.fundingPotential * 10 * WEIGHTS.fundingPotential +
    item.urgency * 10 * WEIGHTS.urgency +
    item.personalImportance * 10 * WEIGHTS.personalImportance;

  const difficultyPenalty = (item.buildDifficulty - 1) * 1;
  const score = roundToOneDecimal(clamp(weightedScore - difficultyPenalty, 0, 100));
  const priority = getPriority(score);

  return {
    score,
    priority,
    department: getDepartment(item),
    nextAction: getNextAction(item, priority),
    reasoning: getReasoning(item, score, priority, difficultyPenalty),
  };
}

/**
 * @param {AtlasItemInput} item
 */
function validateAtlasItem(item) {
  if (!item || typeof item !== "object") {
    throw new TypeError("ATLAS item must be an object.");
  }

  if (!item.title || typeof item.title !== "string") {
    throw new TypeError("ATLAS item title must be a non-empty string.");
  }

  if (!item.description || typeof item.description !== "string") {
    throw new TypeError("ATLAS item description must be a non-empty string.");
  }

  for (const field of REQUIRED_NUMBER_FIELDS) {
    const value = item[field];

    if (!Number.isInteger(value) || value < 1 || value > 10) {
      throw new RangeError(`${field} must be an integer from 1 to 10.`);
    }
  }
}

/**
 * @param {number} score
 * @returns {Priority}
 */
function getPriority(score) {
  if (score >= 80) return "Critical";
  if (score >= 65) return "High";
  if (score >= 45) return "Medium";
  return "Low";
}

/**
 * @param {AtlasItemInput} item
 * @returns {string}
 */
function getDepartment(item) {
  const category = (item.category || "").toLowerCase();
  const text = `${item.title} ${item.description} ${category}`.toLowerCase();

  if (text.includes("intake") || text.includes("logistics") || text.includes("operations")) return "Operations";
  if (text.includes("grant") || text.includes("funding")) return "Funding";
  if (text.includes("creator") || text.includes("youtube") || text.includes("editor")) return "Content";
  if (text.includes("security") || text.includes("wallpaper")) return "AveryTech";
  if (text.includes("building") || text.includes("commercial")) return "Real Estate";
  if (text.includes("disability") || text.includes("calmmeter") || text.includes("aid")) return "Health";
  if (text.includes("vr") || text.includes("game") || text.includes("aphantasia")) return "Product";

  return item.category || "General";
}

/**
 * @param {AtlasItemInput} item
 * @param {Priority} priority
 * @returns {string}
 */
function getNextAction(item, priority) {
  if (priority === "Critical") {
    return "Assign an owner this week, define the smallest shippable version, and schedule execution.";
  }

  if (priority === "High") {
    return "Create a one-page plan with scope, timeline, blockers, and first milestone.";
  }

  if (priority === "Medium") {
    return item.buildDifficulty >= 7
      ? "Reduce scope into a lower-difficulty pilot before committing full build time."
      : "Validate demand with a small test, prototype, or outreach batch.";
  }

  return "Keep in the backlog and revisit after higher-return items move forward.";
}

/**
 * @param {AtlasItemInput} item
 * @param {number} score
 * @param {Priority} priority
 * @param {number} difficultyPenalty
 * @returns {string[]}
 */
function getReasoning(item, score, priority, difficultyPenalty) {
  const strengths = [
    ["early profit", item.earlyProfit],
    ["turnaround speed", item.turnaroundSpeed],
    ["longevity", item.longevity],
    ["funding potential", item.fundingPotential],
    ["urgency", item.urgency],
    ["personal importance", item.personalImportance],
  ]
    .filter(([, value]) => value >= 8)
    .map(([label]) => label);

  const reasoning = [
    `Weighted score is ${score}/100, which maps to ${priority} priority.`,
    `Build difficulty subtracts ${roundToOneDecimal(difficultyPenalty)} points, keeping friction visible without overpowering upside.`,
  ];

  if (strengths.length > 0) {
    reasoning.push(`Strongest signals: ${strengths.join(", ")}.`);
  }

  if (item.buildDifficulty >= 8) {
    reasoning.push("High build difficulty means the next step should be scoped carefully.");
  }

  if (item.earlyProfit >= 8 && item.turnaroundSpeed >= 8) {
    reasoning.push("Fast turnaround plus strong early profit makes this useful for near-term momentum.");
  }

  return reasoning;
}

/**
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * @param {number} value
 * @returns {number}
 */
function roundToOneDecimal(value) {
  return Math.round(value * 10) / 10;
}

const exampleAtlasItems = [
  {
    title: "ATLAS Creator Logistics",
    description: "Operational system for coordinating creator tasks, publishing, and follow-through.",
    category: "Operations",
    earlyProfit: 8,
    turnaroundSpeed: 9,
    longevity: 8,
    fundingPotential: 6,
    buildDifficulty: 4,
    urgency: 8,
    personalImportance: 9,
  },
  {
    title: "ATLAS Intake",
    description: "Structured intake flow for capturing ideas, opportunities, and next steps.",
    category: "Operations",
    earlyProfit: 7,
    turnaroundSpeed: 8,
    longevity: 9,
    fundingPotential: 5,
    buildDifficulty: 3,
    urgency: 8,
    personalImportance: 9,
  },
  {
    title: "Grant Tracker",
    description: "System to monitor grants, deadlines, requirements, and application progress.",
    category: "Funding",
    earlyProfit: 6,
    turnaroundSpeed: 6,
    longevity: 8,
    fundingPotential: 10,
    buildDifficulty: 5,
    urgency: 8,
    personalImportance: 8,
  },
  {
    title: "Disability Aid MVP",
    description: "Minimum viable product for disability support, eligibility, and resource guidance.",
    category: "Health",
    earlyProfit: 7,
    turnaroundSpeed: 6,
    longevity: 9,
    fundingPotential: 9,
    buildDifficulty: 7,
    urgency: 9,
    personalImportance: 10,
  },
  {
    title: "Automated YouTube Channel",
    description: "Repeatable content pipeline for producing and publishing monetizable videos.",
    category: "Content",
    earlyProfit: 8,
    turnaroundSpeed: 7,
    longevity: 7,
    fundingPotential: 6,
    buildDifficulty: 6,
    urgency: 7,
    personalImportance: 7,
  },
  {
    title: "CalmMeter",
    description: "Simple emotional regulation and stress tracking product.",
    category: "Health",
    earlyProfit: 6,
    turnaroundSpeed: 7,
    longevity: 8,
    fundingPotential: 7,
    buildDifficulty: 5,
    urgency: 7,
    personalImportance: 9,
  },
  {
    title: "Aphantasia VR Game",
    description: "Immersive VR game concept built around aphantasia and visual imagination.",
    category: "Product",
    earlyProfit: 4,
    turnaroundSpeed: 3,
    longevity: 8,
    fundingPotential: 7,
    buildDifficulty: 10,
    urgency: 4,
    personalImportance: 9,
  },
  {
    title: "AveryTech Security Wallpaper",
    description: "Security-themed wallpaper product or brand asset for AveryTech.",
    category: "AveryTech",
    earlyProfit: 5,
    turnaroundSpeed: 9,
    longevity: 5,
    fundingPotential: 4,
    buildDifficulty: 2,
    urgency: 5,
    personalImportance: 6,
  },
  {
    title: "Commercial Building",
    description: "Long-term commercial real estate opportunity.",
    category: "Real Estate",
    earlyProfit: 5,
    turnaroundSpeed: 2,
    longevity: 10,
    fundingPotential: 9,
    buildDifficulty: 10,
    urgency: 6,
    personalImportance: 8,
  },
  {
    title: "Hiring Editor",
    description: "Bring in editing help to increase content output and reduce production bottlenecks.",
    category: "Content",
    earlyProfit: 8,
    turnaroundSpeed: 8,
    longevity: 7,
    fundingPotential: 5,
    buildDifficulty: 3,
    urgency: 8,
    personalImportance: 7,
  },
];

module.exports = {
  scoreAtlasItem,
  exampleAtlasItems,
};
