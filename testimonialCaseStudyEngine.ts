export type TestimonialRecord = {
  id: string;
  clientName: string;
  organization?: string;
  role?: string;
  testimonialText: string;
  permissionToUse: boolean;
  permissionScope?: string;
  relatedProject?: string;
  dateReceived: string;
  status: "Draft" | "Needs Permission" | "Permission Granted" | "Internal Only" | "Approved for Public Use" | "Published" | "Archived";
};

export type CaseStudyRecord = {
  id: string;
  title: string;
  clientOrProject: string;
  problem: string;
  solution: string;
  process: string;
  outcome: string;
  measurableResults?: string;
  quote?: string;
  evidenceLinks: string[];
  permissionStatus: string;
  publicUseApproved: boolean;
  status: "Draft" | "Needs Permission" | "Permission Granted" | "Internal Only" | "Approved for Public Use" | "Published" | "Archived";
};

const testimonials: TestimonialRecord[] = [];
const caseStudies: CaseStudyRecord[] = [];

export function submitTestimonial(testimonial: TestimonialRecord): TestimonialRecord {
  testimonial.status = testimonial.permissionToUse ? "Permission Granted" : "Needs Permission";
  testimonials.push(testimonial);
  return testimonial;
}

export function validatePermissionToUse(testimonial: TestimonialRecord): boolean {
  return testimonial.permissionToUse && Boolean(testimonial.permissionScope);
}

export function createCaseStudyDraft(data: CaseStudyRecord): CaseStudyRecord {
  data.status = data.publicUseApproved ? "Approved for Public Use" : "Draft";
  caseStudies.push(data);
  return data;
}

export function sanitizeCaseStudyForPublicUse(caseStudy: CaseStudyRecord): CaseStudyRecord {
  return {
    ...caseStudy,
    problem: sanitize(caseStudy.problem),
    solution: sanitize(caseStudy.solution),
    process: sanitize(caseStudy.process),
    outcome: markUnverified(caseStudy.outcome),
    measurableResults: caseStudy.measurableResults ? markUnverified(caseStudy.measurableResults) : undefined,
  };
}

export function markPermissionGranted(testimonialId: string, scope: string): TestimonialRecord {
  const testimonial = findTestimonial(testimonialId);
  testimonial.permissionToUse = true;
  testimonial.permissionScope = scope;
  testimonial.status = "Permission Granted";
  return testimonial;
}

export function markApprovedForPublicUse(caseStudyId: string, approval: { approvedByCole: boolean }): CaseStudyRecord {
  if (!approval.approvedByCole) throw new Error("Cole approval required for public use.");
  const caseStudy = findCaseStudy(caseStudyId);
  caseStudy.publicUseApproved = true;
  caseStudy.status = "Approved for Public Use";
  return caseStudy;
}

export function getApprovedPublicTestimonials(): TestimonialRecord[] {
  return testimonials.filter((item) => item.permissionToUse && item.status === "Permission Granted");
}

export function getInternalOnlyTestimonials(): TestimonialRecord[] {
  return testimonials.filter((item) => !item.permissionToUse || item.status === "Internal Only" || item.status === "Needs Permission");
}

export function clearTestimonialsForDemo(): void {
  testimonials.length = 0;
  caseStudies.length = 0;
}

function findTestimonial(id: string): TestimonialRecord {
  const testimonial = testimonials.find((item) => item.id === id);
  if (!testimonial) throw new Error(`Testimonial ${id} not found.`);
  return testimonial;
}

function findCaseStudy(id: string): CaseStudyRecord {
  const caseStudy = caseStudies.find((item) => item.id === id);
  if (!caseStudy) throw new Error(`Case study ${id} not found.`);
  return caseStudy;
}

function sanitize(value: string): string {
  return value.replace(/client secret|private data|medical detail/gi, "[removed sensitive detail]");
}

function markUnverified(value: string): string {
  return /verified|documented|confirmed/i.test(value) ? value : `${value} (unverified result)`;
}
