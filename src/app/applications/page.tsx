"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import FiltersBar from "./FiltersBar";
import ApplicationTable, {
  type Application,
  type SortKey,
  type SortOrder
} from "./applicationTable";

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
  const [sortKey, setSortKey] = useState<SortKey>("appliedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const router = useRouter();

  const filteredAndSorted = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = APPLICATIONS.filter((app) => {
      const matchesQuery =
        app.company.toLowerCase().includes(query) || app.roleTitle.toLowerCase().includes(query);
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
          Filter, search, and sort your applications. Click a row to open details.
        </p>
      </header>

      <FiltersBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />

      <ApplicationTable
        applications={filteredAndSorted}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSortChange={(nextKey) => {
          if (nextKey === sortKey) {
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
          } else {
            setSortKey(nextKey);
            setSortOrder(nextKey === "appliedAt" ? "desc" : "asc");
          }
        }}
        onRowClick={(id) => {
          router.push(`/applications/${id}`);
        }}
      />
    </section>
  );
}
