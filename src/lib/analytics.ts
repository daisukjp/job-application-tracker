import type { ApplicationRow } from "./data/applications";

export const STATUS_OPTIONS = ["Draft", "Applied", "Interviewing", "Offer", "Rejected"] as const;
export type Status = (typeof STATUS_OPTIONS)[number];

export function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7;
  d.setDate(d.getDay() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function getWeekStarts(weeks: number, now = new Date()): Date[] {
  const current = startOfWeek(now);
  const list: Date[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const d = new Date(current);
    d.setDate(current.getDate() - i * 7);
    list.push(d);
  }
  return list;
}

export function formatWeekLabel(date: Date): string {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date);
}

export function buildWeeklySeries(apps: ApplicationRow[], weeks: number) {
  const weekStarts = getWeekStarts(weeks);
  const countMap = new Map<string, number>();

  weekStarts.forEach((d) => countMap.set(toISODate(d), 0));

  for (const app of apps) {
    const appliedDate = new Date(app.applied_at);
    const weekStart = toISODate(startOfWeek(appliedDate));
    if (countMap.has(weekStart)) {
      countMap.set(weekStart, (countMap.get(weekStart) ?? 0) + 1);
    }
  }

  return weekStarts.map((d) => ({
    week: formatWeekLabel(d),
    count: countMap.get(toISODate(d)) ?? 0
  }));
}

export function countByStatus(apps: ApplicationRow[]) {
  const result: Record<Status, number> = {
    Draft: 0,
    Applied: 0,
    Interviewing: 0,
    Offer: 0,
    Rejected: 0
  };

  for (const app of apps) {
    const status = app.status as Status;
    if (result[status] !== undefined) {
      result[status] += 1;
    }
  }
  return result;
}
