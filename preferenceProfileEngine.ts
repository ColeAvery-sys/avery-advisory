export type PreferenceStatus = "Active" | "Needs Confirmation" | "Deprecated" | "Rejected";
export type PreferenceRecord = {
  id: string;
  category: string;
  preference: string;
  source: string;
  confidence: number;
  lastConfirmed?: string;
  status: PreferenceStatus;
};

const preferences: PreferenceRecord[] = [
  { id: "default-no-em-dashes", category: "Writing Style", preference: "No em dashes in final copy", source: "default", confidence: 0.95, status: "Active" },
  { id: "default-cash-first", category: "Business Priorities", preference: "Prioritize early cash flow before moonshots", source: "default", confidence: 0.9, status: "Active" },
  { id: "default-top-three", category: "Daily Planning Preferences", preference: "Keep daily execution focused on top 3", source: "default", confidence: 0.9, status: "Active" },
  { id: "default-approval", category: "Approval Preferences", preference: "Approval required for external-facing actions", source: "default", confidence: 1, status: "Active" },
];

export function addPreference(preference: PreferenceRecord): PreferenceRecord {
  preferences.push(preference);
  return preference;
}

export function confirmPreference(preferenceId: string): PreferenceRecord {
  const preference = findPreference(preferenceId);
  preference.status = "Active";
  preference.lastConfirmed = new Date().toISOString();
  return preference;
}

export function rejectPreference(preferenceId: string): PreferenceRecord {
  const preference = findPreference(preferenceId);
  preference.status = "Rejected";
  return preference;
}

export function markPreferenceDeprecated(preferenceId: string): PreferenceRecord {
  const preference = findPreference(preferenceId);
  preference.status = "Deprecated";
  return preference;
}

export function getActivePreferences(): PreferenceRecord[] {
  return preferences.filter((preference) => preference.status === "Active");
}

export function getPreferencesByCategory(category: string): PreferenceRecord[] {
  return preferences.filter((preference) => preference.category === category && preference.status === "Active");
}

export function applyPreferencesToText(text: string, activePreferences = getActivePreferences()): string {
  let output = text;
  if (activePreferences.some((preference) => /no em dashes/i.test(preference.preference))) {
    output = output.replace(/—/g, "-");
  }
  if (activePreferences.some((preference) => /direct, practical language/i.test(preference.preference))) {
    output = output.replace(/\bperhaps\b/gi, "recommend");
  }
  return output;
}

export function applyPreferencesToRecommendation(recommendation: string, activePreferences = getActivePreferences()): string {
  const lines = [applyPreferencesToText(recommendation, activePreferences)];
  if (activePreferences.some((preference) => /early cash flow/i.test(preference.preference))) {
    lines.push("Preference applied: prioritize early cash flow before moonshots.");
  }
  if (activePreferences.some((preference) => /top 3/i.test(preference.preference))) {
    lines.push("Preference applied: keep execution focused on the top 3.");
  }
  return lines.join("\n");
}

export function clearPreferencesForDemo(): void {
  preferences.splice(4);
}

function findPreference(preferenceId: string): PreferenceRecord {
  const preference = preferences.find((item) => item.id === preferenceId);
  if (!preference) throw new Error(`Preference ${preferenceId} not found.`);
  return preference;
}
