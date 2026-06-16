import { createAudienceGate } from "./audienceSafety";

const surveys: any[] = [];

export function createSurvey(survey: any) {
  const stored = { ...survey, ...createAudienceGate("Poll/survey"), status: survey.status || "Draft" };
  surveys.push(stored);
  return stored;
}

export function generateSurvey(input: any) {
  return createSurvey({ id: input.id, surveyName: input.surveyName || `${input.surveyType || "Audience"} Survey`, surveyType: input.surveyType || "Audience Research", questions: generateSurveyQuestions(input.surveyType || "Audience Research") });
}

export function generatePoll(topic: string) {
  return { topic, question: `What should ATLAS build or explain next about ${topic}?`, options: ["short video", "template", "guide", "live discussion"], approvalRequired: true };
}

export function analyzeSurveyResults(results: any[]) {
  const total = results.length;
  const choices: Record<string, number> = {};
  results.forEach((result) => {
    choices[result.answer] = (choices[result.answer] || 0) + 1;
  });
  return { totalResponses: total, choices, topAnswer: Object.entries(choices).sort((a: any, b: any) => b[1] - a[1])[0] };
}

export function generateSurveyInsights(results: any[]) {
  const analysis = analyzeSurveyResults(results);
  return { analysis, insight: analysis.topAnswer ? `Audience prefers ${analysis.topAnswer[0]}.` : "Not enough responses yet.", approvalRequired: false };
}

function generateSurveyQuestions(type: string): string[] {
  if (/product|feature/i.test(type)) return ["What problem should this solve?", "What would make this useful?", "What feels confusing?", "Would you join a beta?"];
  if (/client satisfaction/i.test(type)) return ["What worked?", "What was unclear?", "What should improve?", "Would you recommend this?"];
  if (/grant/i.test(type)) return ["What need does this address?", "Who benefits?", "What evidence should we collect?", "What outcome matters?"];
  return ["What brought you here?", "What do you want more of?", "What should we build next?", "Would you join the community?"];
}

