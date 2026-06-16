export function calculateAgentPerformance(agentName: string, data: Record<string, any[]>) {
  const tasks = (data.tasks || []).filter((item) => item.assignedAgent === agentName);
  const recommendations = (data.recommendations || []).filter((item) => item.agentName === agentName);
  const handoffs = (data.handoffs || []).filter((item) => item.fromAgent === agentName || item.toAgent === agentName);
  const badRecommendations = recommendations.filter((item) => /rejected|bad|failed/i.test(item.status || item.outcome || ""));
  const goodRecommendations = recommendations.filter((item) => /accepted|good|worked/i.test(item.status || item.outcome || ""));
  const improvementSuggestions = [
    ...(badRecommendations.length ? ["Create self-improvement task for bad recommendations."] : []),
    ...(tasks.filter((task) => /overdue/i.test(task.status || "")).length ? ["Reduce overdue task load or clarify scope."] : []),
    ...(handoffs.filter((handoff) => /Rejected|Needs Clarification/.test(handoff.status || "")).length ? ["Improve handoff context and required actions."] : []),
  ];

  return {
    agentName,
    department: (data.agents || []).find((agent) => agent.agentName === agentName)?.department || "Unknown",
    tasksCompleted: tasks.filter((task) => task.status === "Completed").length,
    tasksOverdue: tasks.filter((task) => /overdue/i.test(task.status || "")).length,
    recommendationsMade: recommendations.length,
    recommendationsAccepted: recommendations.filter((item) => /accepted/i.test(item.status || "")).length,
    recommendationsRejected: recommendations.filter((item) => /rejected/i.test(item.status || "")).length,
    badRecommendations,
    goodRecommendations,
    handoffsCompleted: handoffs.filter((handoff) => handoff.status === "Completed").length,
    handoffsFailed: handoffs.filter((handoff) => handoff.status === "Rejected").length,
    averageResponseTime: average(data.responseTimes || []),
    blockerCount: (data.blockers || []).filter((item) => item.assignedAgent === agentName).length,
    improvementSuggestions,
    logEntry: { loopName: "Agent Performance", agentName, timestamp: new Date().toISOString(), summary: `Calculated ATLAS role performance for ${agentName}.` },
  };
}

function average(values: number[]): number {
  if (!values.length) return 0;
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10;
}
