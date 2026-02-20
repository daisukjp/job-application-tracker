"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FiltersBar from "./FiltersBar";
import ApplicationTable, {
  type Application,
  type SortKey,
  type SortOrder
} from "./applicationTable";
import { listApplications, type ApplicationRow } from "../../lib/data/applications";

type ApplicationUI = {
  id: string;
  company: string;
  roleTitle: string;
  status: "Draft" | "Applied" | "Interviewing" | "Offer" | "Rejected";
  appliedAt: string;
  source: string | null;
  location: string | null;
  notesPreview: string | null;
};

export default function ApplicationsPage() {
  const [rows, setRows] = useState<ApplicationRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("appliedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const data = await listApplications();
        if (mounted) setRows(data);
      } catch (err) {
        if (mounted) setError((err as Error).message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const uiList = useMemo<ApplicationUI[]>(() => {
    return rows.map((row) => ({
      id: row.id,
      company: row.company,
      roleTitle: row.role_title,
      status: row.status as ApplicationUI["status"],
      appliedAt: row.applied_at,
      source: row.source ?? "",
      location: row.location ?? "",
      notesPreview: row.notes ? row.notes.slice(0, 60) : ""
    }));
  }, [rows]);

  const router = useRouter();

  const filteredAndSorted = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = uiList.filter((app) => {
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
  }, [uiList, searchQuery, statusFilter, sortKey, sortOrder]);
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
