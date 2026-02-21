"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import FiltersBar from "../../components/applications/FiltersBar";
import ApplicationTable, {
  type SortKey,
  type SortOrder
} from "../../components/applications/ApplicationTable";
import Skeleton from "@/components/ui/Skeleton";
import {
  listApplications,
  updateApplication,
  type ApplicationRow
} from "../../lib/data/applications";

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

type ToastState = { visible: boolean; message: string };

export default function ApplicationsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [toast, setToast] = useState<ToastState>({ visible: false, message: "" });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortKey, setSortKey] = useState<SortKey>("appliedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["applications"],
    queryFn: listApplications
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: ApplicationUI["status"] }) =>
      updateApplication(id, { status }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: ["applications"] });
      const previous = queryClient.getQueryData<ApplicationRow[]>(["applications"]);
      queryClient.setQueryData<ApplicationRow[]>(["applications"], (old) => {
        if (!old) return old;
        return old.map((row) => (row.id === id ? { ...row, status } : row));
      });
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["applications"], context.previous);
      }

      setToast({ visible: true, message: "Failed to update status. Roll back" });

      setTimeout(() => {
        setToast({ visible: false, message: "" });
      }, 2500);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    }
  });

  const uiList = useMemo<ApplicationUI[]>(() => {
    return (data ?? []).map((row: ApplicationRow) => ({
      id: row.id,
      company: row.company,
      roleTitle: row.role_title,
      status: row.status as ApplicationUI["status"],
      appliedAt: row.applied_at,
      source: row.source ?? "",
      location: row.location ?? "",
      notesPreview: row.notes ? row.notes.slice(0, 60) : ""
    }));
  }, [data]);

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

  if (isLoading) {
    return (
      <section className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-64 w-full" />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="space-y-4">
        <p className="text-sm text-red-600">{(error as Error).message}</p>
        <button className="rounded-lg border px-4 py-2 text-sm" onClick={() => refetch()}>
          Retry
        </button>
      </section>
    );
  }

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
        onStatusChange={(id, status) => {
          updateStatusMutation.mutate({ id, status });
        }}
      />
      {toast.visible ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 rounded-lg border bg-background px-4 py-2 text-sm shadow-soft"
        >
          {toast.message}
        </div>
      ) : null}
    </section>
  );
}
