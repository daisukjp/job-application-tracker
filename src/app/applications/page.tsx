"use client";

import { useMemo, useState } from "react";

type Application = {
  id: string;
  company: string;
  roleTitle: string;
  status: "Draft" | "Applied" | "Interviewing" | "Offer" | "Rejected";
  appliedAt: string;
  source: string;
  location: string;
  notesPreview: string;
};

const APPLICATIONS: Application[] = [
  {
    id: "app-001",
    company: "Notion",
    roleTitle: "Frontend Engineer",
    status: "Applied",
    appliedAt: "2025-12-02T10:00:00.000Z",
    source: "Referral",
    location: "Remote",
    notesPreview: "Sent portfolio and a short intro note."
  },
  {
    id: "app-002",
    company: "Figma",
    roleTitle: "Product Engineer",
    status: "Interviewing",
    appliedAt: "2025-12-10T09:30:00.000Z",
    source: "Company Site",
    location: "San Francisco, CA",
    notesPreview: "Phone screen scheduled for next week."
  },
  {
    id: "app-003",
    company: "Linear",
    roleTitle: "UI Engineer",
    status: "Rejected",
    appliedAt: "2025-11-20T18:15:00.000Z",
    source: "LinkedIn",
    location: "Remote",
    notesPreview: "Polite rejection after initial review."
  }
];

export default function ApplicationsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortKey, setSortKey] = useState<"company" | "appliedAt">("appliedAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredAndSorted = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = APPLICATIONS.filter((app) => {
      const matchesQuery = app.company.toLowerCase().includes(query) || app.roleTitle.toLowerCase().includes(query);
      const matchesStatus = statusFilter === "All" || app.status === statusFilter;
      return matchesQuery && matchesStatus;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortKey === "company") {
        const comp = a.company.localeCompare(b.company);
        return sortOrder === "asc" ? comp : -comp;
      }
      if (sortKey === "appliedAt") {
        const cmp = new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
        return sortOrder === "asc" ? cmp : -cmp;
      }
      return 0;
    });

    return sorted;
  }, [searchQuery, statusFilter, sortKey, sortOrder]);
  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Applications
        </p>
        <h1 className="text-3xl font-semibold">All Applications</h1>
        <p className="text-sm text-muted-foreground">
          This page will list your job applications. We will add filters and a table next.
        </p>
      </header>
      <div className="rounded-2xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">No data yet.</p>
      </div>
    </section>
  );
}
