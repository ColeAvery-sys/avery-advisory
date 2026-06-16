export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function round(value: number, decimals = 1): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function daysUntil(dateValue?: string, now = new Date()): number | undefined {
  if (!dateValue) return undefined;

  const date = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(date.getTime())) return undefined;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  return Math.ceil((target.getTime() - today.getTime()) / 86400000);
}

export function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^\w\s-]/g, " ").replace(/\s+/g, " ").trim();
}

export function includesAny(text: string, terms: string[]): boolean {
  const normalized = normalizeText(text);

  return terms.some((term) => normalized.includes(normalizeText(term)));
}

export function unique(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

export function assertNonEmptyString(value: unknown, field: string): void {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`${field} must be a non-empty string.`);
  }
}

export function assertNumber(value: unknown, field: string, min = 0, max = Number.POSITIVE_INFINITY): void {
  if (typeof value !== "number" || Number.isNaN(value) || value < min || value > max) {
    throw new RangeError(`${field} must be a number from ${min} to ${max}.`);
  }
}

export function scoreFromDays(days?: number, fastDays = 7, slowDays = 90): number {
  if (days === undefined) return 50;
  if (days <= fastDays) return 100;
  if (days >= slowDays) return 20;

  return clamp(100 - ((days - fastDays) / (slowDays - fastDays)) * 80, 20, 100);
}

export function effortInverseScore(effort: number): number {
  return clamp(110 - effort * 10, 10, 100);
}
