const goals: any[] = [];

export function createGoalRecord(goal: any) {
  const stored = { ...goal, status: goal.status || "Active", milestones: goal.milestones || [] };
  goals.push(stored);
  return stored;
}

export function breakGoalIntoTimeframes(goal: any) {
  return {
    goalName: goal.goalName,
    quarter: goal.quarter || `Advance ${goal.goalName}`,
    month: goal.month || "Complete the next milestone.",
    week: goal.week || "Create and execute one concrete task.",
    today: goal.today || "Take the smallest useful step.",
  };
}

export function updateGoalProgress(goalId: string, progress: number) {
  const goal = findGoal(goalId);
  goal.progress = Math.max(0, Math.min(100, progress));
  goal.status = goal.progress >= 100 ? "Complete" : goal.status;
  return goal;
}

export function generateGoalDashboard() {
  return {
    activeGoals: goals.filter((goal) => goal.status === "Active"),
    completedGoals: goals.filter((goal) => goal.status === "Complete"),
    blockedGoals: goals.filter((goal) => goal.status === "Blocked"),
    nextActions: goals.filter((goal) => goal.status === "Active").map((goal) => ({ goalName: goal.goalName, nextAction: breakGoalIntoTimeframes(goal).today })),
  };
}

function findGoal(goalId: string) {
  const goal = goals.find((entry) => entry.id === goalId || entry.goalId === goalId);
  if (!goal) throw new Error(`Goal ${goalId} not found.`);
  return goal;
}

