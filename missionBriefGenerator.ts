export type MissionBriefItem = {
  title: string;
  score?: number;
  amount?: number;
  risk?: string;
  requiresColeApproval?: boolean;
};

export type MissionBriefInput = {
  companyMission: string;
  ninetyDayGoal: string;
  monthlyRevenueTarget: number;
  currentCashPriority: string;
  currentProductPriority: string;
  currentFundingPriority: string;
  moneyPipeline: MissionBriefItem[];
  grants: MissionBriefItem[];
  products: MissionBriefItem[];
  clients: MissionBriefItem[];
  approvals: MissionBriefItem[];
  blockers: MissionBriefItem[];
};

export type MissionBriefResult = {
  missionStatus: string;
  biggestOpportunity: string;
  biggestRisk: string;
  todayBestMove: string;
  weekBestMove: string;
  delayOrIgnore: string[];
  approvalNeeded: string[];
  recommendation: string;
};

export function generateMissionBrief(data: MissionBriefInput): MissionBriefResult {
  const biggestOpportunity = chooseBiggestOpportunity(data);
  const approvalNeeded = data.approvals.map((item) => item.title);

  return {
    missionStatus: `${data.companyMission} Current 90-day goal: ${data.ninetyDayGoal}. Revenue target: $${data.monthlyRevenueTarget}.`,
    biggestOpportunity,
    biggestRisk: getBiggestRisk(data),
    todayBestMove: getTodayBestMove(data, biggestOpportunity),
    weekBestMove: `Advance ${data.currentCashPriority}, protect ${data.currentFundingPriority}, and unblock ${data.currentProductPriority}.`,
    delayOrIgnore: getDelayOrIgnore(data),
    approvalNeeded,
    recommendation: "Prioritize fast revenue first, then funding opportunities, product infrastructure, personal stability, and long-term company value.",
  };
}

function chooseBiggestOpportunity(data: MissionBriefInput): string {
  const candidates = [
    ...data.moneyPipeline.map((item) => ({ ...item, score: (item.score || 0) + 25 })),
    ...data.clients.map((item) => ({ ...item, score: (item.score || 0) + 20 })),
    ...data.grants.map((item) => ({ ...item, score: (item.score || 0) + 15 })),
    ...data.products.map((item) => ({ ...item, score: item.score || 0 })),
  ];

  return candidates.sort((a, b) => (b.score || 0) - (a.score || 0))[0]?.title || data.currentCashPriority;
}

function getBiggestRisk(data: MissionBriefInput): string {
  if (data.blockers.length > 0) return data.blockers[0].title;
  if (data.approvals.length > 0) return `Waiting on Cole approval: ${data.approvals[0].title}.`;
  return "No major blocker logged.";
}

function getTodayBestMove(data: MissionBriefInput, biggestOpportunity: string): string {
  if (data.approvals.length > 0) return `Review and decide approval: ${data.approvals[0].title}.`;
  return `Move the fastest practical opportunity forward: ${biggestOpportunity}.`;
}

function getDelayOrIgnore(data: MissionBriefInput): string[] {
  return [...data.products, ...data.grants, ...data.clients]
    .filter((item) => (item.score || 0) < 45 || item.risk === "High")
    .map((item) => item.title);
}
