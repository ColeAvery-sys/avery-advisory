export type LessonStatus = "Active" | "Needs Review" | "Deprecated";
export type LessonRecord = {
  id: string;
  lessonTitle: string;
  category: string;
  source: string;
  whatHappened: string;
  whyItHappened: string;
  lesson: string;
  futureRule: string;
  relatedDecision?: string;
  relatedOutcome?: string;
  confidence: number;
  status: LessonStatus;
  dateAdded: string;
};

const lessons: LessonRecord[] = [];

export function createLesson(lesson: LessonRecord): LessonRecord {
  lessons.push(lesson);
  return lesson;
}

export function createCompanyLesson(input: any): LessonRecord {
  return createLesson({
    id: input.id || `lesson-${lessons.length + 1}`,
    lessonTitle: input.lessonTitle || input.title || "Company lesson",
    category: input.category || "Operations",
    source: input.source || "Company Memory",
    whatHappened: input.whatHappened || input.description || "Event needs more context.",
    whyItHappened: input.whyItHappened || input.cause || "Cause needs review.",
    lesson: input.lesson || "Capture more evidence before changing strategy.",
    futureRule: input.futureRule || "Check prior lessons before repeating similar work.",
    relatedDecision: input.relatedDecision,
    relatedOutcome: input.relatedOutcome,
    confidence: input.confidence || 0.5,
    status: input.status || "Needs Review",
    dateAdded: input.dateAdded || new Date().toISOString(),
  });
}

export function generateLessonFromDecision(decision: any): LessonRecord {
  return createLesson({
    id: `lesson-decision-${decision.id}`,
    lessonTitle: `Decision lesson: ${decision.decisionTitle}`,
    category: decision.decisionType,
    source: "Decision History",
    whatHappened: decision.actualOutcome || "Outcome not fully measured.",
    whyItHappened: "Compare the decision context against actual outcome before changing strategy.",
    lesson: decision.outcomeStatus === "Worked" ? "Repeat similar decisions when evidence is similar." : "Change the conditions before repeating this decision.",
    futureRule: `When considering ${decision.decisionType}, check prior outcomes first.`,
    relatedDecision: decision.id,
    confidence: decision.actualOutcome ? 0.75 : 0.35,
    status: decision.actualOutcome ? "Active" : "Needs Review",
    dateAdded: new Date().toISOString(),
  });
}

export function generateLessonFromOutcome(outcome: any): LessonRecord {
  return createLesson({
    id: `lesson-outcome-${outcome.id}`,
    lessonTitle: `Outcome lesson: ${outcome.resultType}`,
    category: outcome.resultType,
    source: "Outcome Tracker",
    whatHappened: outcome.actualOutcome,
    whyItHappened: outcome.whatWorked || outcome.whatFailed || "Cause needs review.",
    lesson: outcome.whatToRepeat || outcome.whatToAvoid || "Track more evidence before changing behavior.",
    futureRule: outcome.whatToRepeat ? `Repeat: ${outcome.whatToRepeat}` : `Avoid: ${outcome.whatToAvoid}`,
    relatedOutcome: outcome.id,
    confidence: outcome.whatWorked || outcome.whatFailed ? 0.7 : 0.4,
    status: outcome.whatWorked || outcome.whatFailed ? "Active" : "Needs Review",
    dateAdded: new Date().toISOString(),
  });
}

export function convertLessonToRule(lessonId: string): string {
  return findLesson(lessonId).futureRule;
}

export function getLessonsByCategory(category: string): LessonRecord[] {
  return lessons.filter((lesson) => lesson.category === category && lesson.status !== "Deprecated");
}

export function markLessonDeprecated(lessonId: string): LessonRecord {
  const lesson = findLesson(lessonId);
  lesson.status = "Deprecated";
  return lesson;
}

export function clearLessonsForDemo(): void {
  lessons.length = 0;
}

export function attachLessonToSop(lessonId: string, sopId: string) {
  const lesson = findLesson(lessonId) as LessonRecord & { attachedSops?: string[] };
  lesson.attachedSops = Array.from(new Set([...(lesson.attachedSops || []), sopId]));
  return lesson;
}

export function attachLessonToProject(lessonId: string, projectId: string) {
  const lesson = findLesson(lessonId) as LessonRecord & { attachedProjects?: string[] };
  lesson.attachedProjects = Array.from(new Set([...(lesson.attachedProjects || []), projectId]));
  return lesson;
}

export function applyLessonsToFutureProject(category: string, project: any) {
  const relevant = getLessonsByCategory(category);
  return {
    projectName: project.projectName || project.title,
    appliedLessons: relevant.map((lesson) => lesson.lessonTitle),
    warnings: relevant.map((lesson) => lesson.futureRule),
    approvalRequiredForPolicyChange: true,
  };
}

export function applyLessonToFutureProjects(lessonId: string) {
  const lesson = findLesson(lessonId);
  return {
    lessonId,
    futureRule: lesson.futureRule,
    recommendedUse: `Apply before future ${lesson.category} projects.`,
    approvalRequiredForPolicyChange: true,
  };
}

export function generateLessonSummary(category?: string) {
  const relevant = category ? getLessonsByCategory(category) : lessons.filter((lesson) => lesson.status !== "Deprecated");
  return {
    totalLessons: relevant.length,
    activeLessons: relevant.filter((lesson) => lesson.status === "Active").length,
    needsReview: relevant.filter((lesson) => lesson.status === "Needs Review").length,
    strongestRules: relevant.filter((lesson) => lesson.confidence >= 0.7).map((lesson) => lesson.futureRule),
  };
}

function findLesson(lessonId: string): LessonRecord {
  const lesson = lessons.find((item) => item.id === lessonId);
  if (!lesson) throw new Error(`Lesson ${lessonId} not found.`);
  return lesson;
}
