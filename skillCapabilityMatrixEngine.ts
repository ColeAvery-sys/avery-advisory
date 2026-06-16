import { unique } from "./workforceSafety";

const skillRecords: any[] = [];

export function createSkillProfile(profile: any) {
  const stored = { ...profile, id: profile.id || `skill-${skillRecords.length + 1}` };
  skillRecords.push(stored);
  return stored;
}

export function calculateCapabilityScore(profile: any) {
  const scores = Object.keys(profile.skills || {}).map((skill) => Number(profile.skills[skill] || 0));
  return scores.length ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length * 10) : 0;
}

export function identifySkillGaps(requiredSkills: string[]) {
  const covered = unique(skillRecords.reduce((skills: string[], profile: any) => skills.concat(Object.keys(profile.skills || {}).filter((skill) => Number(profile.skills[skill]) >= 6)), []));
  return requiredSkills.filter((skill) => covered.indexOf(skill) < 0);
}

export function identifyTrainingNeeds(personId: string) {
  const profile = findProfile(personId);
  return Object.keys(profile.skills || {}).filter((skill) => Number(profile.skills[skill]) < 6).map((skill) => ({ skill, recommendation: `Assign ${skill} training.` }));
}

export function identifyPromotionCandidates() {
  return skillRecords.filter((profile) => calculateCapabilityScore(profile) >= 80 && Number(profile.reliability || 0) >= 8).map((profile) => profile.personName || profile.name);
}

export function identifyHiringNeeds(requiredSkills: string[]) {
  return identifySkillGaps(requiredSkills).map((skill) => ({ skill, recommendation: `Consider contractor/applicant pipeline for ${skill}.`, approvalRequiredBeforeHiring: true }));
}

function findProfile(personId: string) {
  const profile = skillRecords.find((item) => item.personId === personId || item.id === personId);
  if (!profile) throw new Error(`Skill profile ${personId} not found.`);
  return profile;
}
