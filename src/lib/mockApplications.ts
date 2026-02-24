import type { ApplicationRow } from "./data/applications";

const STATUSES = ["Draft", "Applied", "Interviewing", "Offer", "Rejected"] as const;
const COMPANIES = ["Acme", "Figma", "Notion", "Stripe", "Vercel", "Linear", "OpenAI", "GitHub"];
const ROLES = ["Frontend Engineer", "Full Stack Developer", "UI Engineer", "Product Engineer"];

export function buildMockApplications(count: number): ApplicationRow[] {
  const today = new Date();
  const results: ApplicationRow[] = [];

  for (let i = 0; i < count; i++) {
    const applied = new Date(today);

    applied.setDate(today.getDate() - (i % 90));

    results.push({
      id: `mock-${i}`,
      company: COMPANIES[i % COMPANIES.length],
      role_title: ROLES[i % ROLES.length],
      status: STATUSES[i % STATUSES.length],
      applied_at: applied.toISOString().slice(0, 10),
      source: "LinkedIn",
      location: "Remote",
      notes: "Mock data",
      follow_up_date: null,
      created_at: today.toISOString()
    });
  }

  return results;
}
