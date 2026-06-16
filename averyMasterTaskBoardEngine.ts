export type TaskBoardTab = {
  name: string;
  purpose: string;
  columns: string[];
  dropdowns?: Record<string, string[]>;
  starterRows?: string[][];
};

export const MASTER_TASK_BOARD_NAME = "Avery Industries - Master Task Board";

export const MASTER_TASK_BOARD_TABS: TaskBoardTab[] = [
  {
    name: "Executive Queue",
    purpose: "CEO-only daily view for tasks that need Cole's attention.",
    columns: ["Priority", "Task", "Department", "Assigned To", "Status", "Needs Approval", "Due Date", "Notes", "Next Action"],
    dropdowns: {
      Priority: ["Critical", "High", "Medium", "Low", "Parking Lot"],
      Status: ["Pending", "Review", "Approved", "Complete", "Blocked"],
      "Needs Approval": ["Yes", "No"],
    },
  },
  {
    name: "Agent Tasks",
    purpose: "Main task database for all AI agents and departments.",
    columns: ["Task ID", "Task Title", "Description", "Department", "Assigned Agent", "Manager Agent", "Priority", "Status", "Approval Required", "Created Date", "Due Date", "Dependencies", "Output Link", "Completion Notes"],
    dropdowns: {
      Priority: ["Critical", "High", "Medium", "Low", "Parking Lot"],
      Status: ["Backlog", "Assigned", "Working", "Review", "Approved", "Complete", "Blocked"],
      "Approval Required": ["Yes", "No"],
    },
  },
  {
    name: "Approvals",
    purpose: "Anything requiring Cole's approval before action.",
    columns: ["Approval ID", "Date", "Request", "Requesting Agent", "Department", "Cost", "Risk Level", "Reason", "Status", "Cole Decision", "Decision Date", "Notes"],
    dropdowns: {
      "Risk Level": ["Low", "Medium", "High", "Critical"],
      Status: ["Pending", "Approved", "Rejected", "Needs More Info"],
    },
  },
  {
    name: "Executive Reports",
    purpose: "Daily and weekly reports from agent managers.",
    columns: ["Report ID", "Date", "Department", "Manager Agent", "Summary", "Completed", "Blockers", "Recommendations", "Approvals Needed", "Next 24 Hours"],
  },
  {
    name: "Idea Vault",
    purpose: "Stores every idea Cole gives ATLAS so it can be distributed across the company.",
    columns: ["Idea ID", "Idea", "Source", "Division", "Category", "Priority", "Revenue Potential", "Impact Potential", "Status", "Assigned Manager", "Expansion Notes", "Next Action"],
    dropdowns: {
      Category: ["Content", "Product", "App", "Marketing", "Sales", "Philanthropy", "Real Estate", "Entertainment", "Education", "Automation"],
      Priority: ["Critical", "High", "Medium", "Low", "Parking Lot"],
      Status: ["Captured", "Expanded", "Assigned", "Active", "Paused", "Archived"],
    },
  },
  {
    name: "Leads",
    purpose: "Creator Logistics lead database.",
    columns: ["Lead ID", "Name", "Company/Channel", "Platform", "Contact", "Source", "Niche", "Opportunity", "Status", "Priority", "Assigned Agent", "Last Contact", "Next Follow-Up", "Notes"],
    dropdowns: {
      Status: ["New", "Researching", "Qualified", "Draft Proposal", "Awaiting Approval", "Contacted", "Follow-Up", "Won", "Lost", "Archived"],
      Priority: ["Critical", "High", "Medium", "Low", "Parking Lot"],
    },
  },
  {
    name: "Departments",
    purpose: "Official department registry.",
    columns: ["Department ID", "Department Name", "Division", "Manager Agent", "Mission", "Success Metric", "Status", "Notes"],
    dropdowns: {
      Status: ["Active", "Future", "Paused", "Archived"],
    },
    starterRows: [
      ["D-001", "Executive Operations", "Executive", "ATLAS Prime", "Run the company operating rhythm.", "Cole has one clear command center.", "Active", ""],
      ["D-002", "Executive Strategy", "Executive", "Echo", "Analyze opportunities, risks, and long-term plans.", "Strategic choices are narrowed and defensible.", "Active", ""],
      ["D-003", "ATLAS Systems", "ATLAS", "Circuit", "Build the internal operating system.", "Reliable dashboard, memory, tasks, approvals, and reports.", "Active", ""],
      ["D-004", "Creator Logistics Sales", "Creator Logistics", "Broker", "Find and advance revenue leads.", "Qualified leads and closed service deals.", "Active", ""],
      ["D-005", "Creator Logistics Operations", "Creator Logistics", "Mercury", "Deliver creator service work cleanly.", "On-time delivery and low revision load.", "Active", ""],
      ["D-006", "Marketing & Growth", "Marketing", "Broadcaster", "Grow trust, visibility, and demand.", "Consistent audience and lead growth.", "Active", ""],
      ["D-007", "AveryTech", "Technology", "Guide", "Build accessibility and executive-function products.", "Shipped software used by real people.", "Active", ""],
      ["D-008", "Avery Entertainment", "Entertainment", "Apollo", "Develop IP, stories, games, and media.", "Profitable IP pipeline.", "Future", ""],
      ["D-009", "Avery Community Foundation", "Philanthropy", "Lantern", "Prepare community impact and funding systems.", "Measurable mission impact.", "Future", ""],
      ["D-010", "Operations", "Operations", "Forge", "Build SOPs and reduce operational friction.", "Repeatable workflows.", "Active", ""],
      ["D-011", "Knowledge Management", "Operations", "Archivist", "Maintain memory, documentation, and idea history.", "Company knowledge remains searchable.", "Active", ""],
      ["D-012", "Monitoring & Security", "Operations", "Sentinel", "Track risks, errors, approvals, and security concerns.", "No silent failures or unapproved risky actions.", "Active", ""],
      ["D-013", "Avery Academy", "Education", "ATLAS Prime", "Prepare future training products.", "Clear curriculum pipeline.", "Future", ""],
      ["D-014", "Avery Music Group", "Music", "ATLAS Prime", "Prepare future music and audio publishing.", "Rights-safe audio pipeline.", "Future", ""],
      ["D-015", "Avery Collectibles", "Collectibles", "ATLAS Prime", "Prepare future merchandise and collectibles.", "Rights-safe collectible product pipeline.", "Future", ""],
      ["D-016", "Real Estate Initiatives", "Real Estate", "Echo", "Track future real-world property ideas.", "Expansion follows revenue, team, and capacity need.", "Future", ""],
    ],
  },
  {
    name: "Agents",
    purpose: "Official AI agent registry.",
    columns: ["Agent ID", "Agent Name", "Title", "Department", "Manager", "Role", "Responsibilities", "Status", "Current Task ID", "Last Report Date", "Notes"],
    dropdowns: {
      Status: ["Active", "Idle", "Waiting", "Blocked", "Disabled"],
    },
    starterRows: [
      ["A-001", "ATLAS Prime", "Chief Operating Agent", "Executive Operations", "Cole Avery", "Coordinate company operations.", "Delegate work; produce executive reports; manage agent hierarchy.", "Active", "", "", ""],
      ["A-002", "Echo", "Chief Strategy Agent", "Executive Strategy", "Cole Avery", "Analyze strategy and risk.", "Opportunity analysis; long-term planning; risk assessment.", "Active", "", "", ""],
      ["A-003", "Circuit", "Engineering Director", "ATLAS Systems", "ATLAS Prime", "Lead engineering architecture.", "Software architecture; APIs; integrations; databases.", "Active", "", "", ""],
      ["A-004", "Broker", "Sales Director", "Creator Logistics Sales", "ATLAS Prime", "Advance revenue leads.", "Lead generation; sales funnels; CRM; client acquisition.", "Active", "", "", ""],
      ["A-005", "Mercury", "Operations Director", "Creator Logistics Operations", "ATLAS Prime", "Run fulfillment.", "Delivery; client fulfillment; production pipelines; QC.", "Active", "", "", ""],
      ["A-006", "Broadcaster", "Marketing Director", "Marketing & Growth", "ATLAS Prime", "Grow reach and trust.", "Social; SEO; content; brand expansion.", "Active", "", "", ""],
      ["A-007", "Guide", "Product Director", "AveryTech", "ATLAS Prime", "Guide product direction.", "Roadmaps; accessibility; user testing; feature priority.", "Active", "", "", ""],
      ["A-008", "Apollo", "Entertainment Director", "Avery Entertainment", "ATLAS Prime", "Develop entertainment IP.", "Story; lore; characters; games; comics.", "Idle", "", "", ""],
      ["A-009", "Lantern", "Funding Director", "Avery Community Foundation", "ATLAS Prime", "Prepare funding systems.", "Grants; sponsorships; donor research; funding readiness.", "Idle", "", "", ""],
      ["A-010", "Forge", "Operations Director", "Operations", "ATLAS Prime", "Improve operations.", "SOPs; process design; workflow optimization.", "Active", "", "", ""],
      ["A-011", "Archivist", "Knowledge Director", "Knowledge Management", "ATLAS Prime", "Maintain company knowledge.", "Memory; docs; idea vault; assets.", "Active", "", "", ""],
      ["A-012", "Sentinel", "Security Director", "Monitoring & Security", "ATLAS Prime", "Protect systems and decisions.", "Backups; monitoring; errors; security; approvals.", "Active", "", "", ""],
    ],
  },
  {
    name: "SOPs",
    purpose: "Operating procedures for how the company uses the task board.",
    columns: ["SOP ID", "SOP Name", "Department", "Procedure", "Owner", "Status", "Last Updated"],
    dropdowns: {
      Status: ["Draft", "Active", "Needs Review", "Archived"],
    },
    starterRows: [
      ["SOP-001", "Task Creation SOP", "Operations", "Create tasks in Agent Tasks with owner, priority, due date, approval flag, and expected output.", "Forge", "Active", ""],
      ["SOP-002", "Task Assignment SOP", "Executive Operations", "Assign every task to one agent and one manager agent. Unassigned work stays in Backlog.", "ATLAS Prime", "Active", ""],
      ["SOP-003", "Approval Routing SOP", "Monitoring & Security", "Any money, message, public post, submission, contract, or hiring action goes to Approvals before execution.", "Sentinel", "Active", ""],
      ["SOP-004", "Daily Report SOP", "Executive Operations", "Managers add daily summaries to Executive Reports before the morning brief is prepared.", "ATLAS Prime", "Active", ""],
      ["SOP-005", "Idea Vault SOP", "Knowledge Management", "Capture every idea first, then expand, score, assign, pause, or archive.", "Archivist", "Active", ""],
      ["SOP-006", "Lead Management SOP", "Creator Logistics Sales", "All Creator Logistics prospects go in Leads before outreach or proposal drafting.", "Broker", "Active", ""],
      ["SOP-007", "Escalation SOP", "Monitoring & Security", "Blocked, critical, risky, or unclear work is escalated to Executive Queue.", "Sentinel", "Active", ""],
    ],
  },
  {
    name: "Daily Brief",
    purpose: "Single-page CEO brief generated from the rest of the workbook.",
    columns: ["Section", "Formula / Manual Entry", "Notes"],
    starterRows: [
      ["Today's Critical Tasks", "=FILTER('Agent Tasks'!A:N,'Agent Tasks'!G:G=\"Critical\")", "Critical work only."],
      ["Pending Approvals", "=FILTER(Approvals!A:L,Approvals!I:I=\"Pending\")", "Cole approval queue."],
      ["Blocked Tasks", "=FILTER('Agent Tasks'!A:N,'Agent Tasks'!H:H=\"Blocked\")", "Tasks that need intervention."],
      ["New Leads", "=FILTER(Leads!A:N,Leads!I:I=\"New\")", "Fresh Creator Logistics leads."],
      ["Department Updates", "Manual summary from Executive Reports.", "Keep under 5 bullets."],
      ["Recommended CEO Decisions", "Manual ATLAS recommendation.", "Limit to 1-3 decisions."],
    ],
  },
];

export const MASTER_TASK_BOARD_FORMULAS = [
  { label: "Tasks by status", formula: '=COUNTIF(\'Agent Tasks\'!H:H,"Working")' },
  { label: "Pending approvals", formula: '=COUNTIF(Approvals!I:I,"Pending")' },
  { label: "High-priority tasks", formula: '=COUNTIF(\'Agent Tasks\'!G:G,"High")' },
  { label: "Leads by status", formula: '=COUNTIF(Leads!I:I,"Qualified")' },
  { label: "Tasks due today", formula: '=FILTER(\'Agent Tasks\'!A:N,\'Agent Tasks\'!K:K=TODAY())' },
  { label: "Blocked tasks", formula: '=FILTER(\'Agent Tasks\'!A:N,\'Agent Tasks\'!H:H="Blocked")' },
  { label: "Tasks requiring approval", formula: '=FILTER(\'Agent Tasks\'!A:N,\'Agent Tasks\'!I:I="Yes")' },
];

export const MASTER_TASK_BOARD_SOPS = [
  "Cole uses Executive Queue and Daily Brief first. The goal is a three-minute company health read.",
  "ATLAS Prime converts decisions and priorities into Agent Tasks.",
  "Codex creates system specs, SOPs, data schemas, and safe automation plans from the board.",
  "Cursor builds UI, APIs, and integrations that read from or write to the board.",
  "Agents may draft, research, organize, summarize, and recommend.",
  "Agents may not send emails, spend money, contact people, submit forms, post publicly, sign documents, or hire contractors without a row in Approvals and Cole approval.",
  "Creator Logistics leads are entered in Leads before outreach, proposal drafting, or follow-up.",
  "Every active task needs one assigned agent, one manager agent, a status, and a next output.",
];

export function getMasterTaskBoardSpec() {
  return {
    fileName: MASTER_TASK_BOARD_NAME,
    tabs: MASTER_TASK_BOARD_TABS,
    formulas: MASTER_TASK_BOARD_FORMULAS,
    sops: MASTER_TASK_BOARD_SOPS,
  };
}

export function getTaskBoardTab(tabName: string) {
  const tab = MASTER_TASK_BOARD_TABS.find((item) => item.name === tabName);
  if (!tab) throw new Error(`Master Task Board tab ${tabName} not found.`);
  return tab;
}

export function generateTaskId(index: number) {
  return `AI-${String(index).padStart(4, "0")}`;
}

export function generateApprovalId(index: number) {
  return `APP-${String(index).padStart(4, "0")}`;
}

export function generateIdeaId(index: number) {
  return `IDEA-${String(index).padStart(4, "0")}`;
}

export function generateAppsScriptSummary() {
  return {
    fileName: MASTER_TASK_BOARD_NAME,
    tabCount: MASTER_TASK_BOARD_TABS.length,
    starterDepartmentRows: getTaskBoardTab("Departments").starterRows?.length || 0,
    starterAgentRows: getTaskBoardTab("Agents").starterRows?.length || 0,
    generatorFile: "atlas_ops/templates/create_avery_master_task_board.gs",
  };
}
