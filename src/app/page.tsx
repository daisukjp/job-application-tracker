"use client";

// Analytics Dashboard
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import Skeleton from "@/components/ui/Skeleton";
import { listApplications } from "@/lib/data/applications";
import { buildWeeklySeries, countByStatus, STATUS_OPTIONS } from "@/lib/analytics";

type RangeWeeks = 4 | 8 | 12;

export default function DashboardPage() {
  const [rangeWeeks, setRangeWeeks] = useState<RangeWeeks>(8);

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["applications"],
    queryFn: listApplications
  });

  const totalCount = useMemo(() => (data ?? []).length, [data]);
  const statusCounts = useMemo(() => countByStatus(data ?? []), [data]);
  const weeklySeries = useMemo(() => buildWeeklySeries(data ?? [], rangeWeeks), [data, rangeWeeks]);

  if (isLoading) {
    return (
      <section className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-72 w-full" />
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
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Analytics
        </p>
        <h1 className="text-3xl font-semibold">Job Application Dashboard</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Overview of your applications and status trends.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border bg-card p-4 shadow-soft">
          <p className="text-xs text-muted-foreground">Total Application</p>
          <p className="mt-2 text-2xl font-semibold">{totalCount}</p>
        </div>

        {STATUS_OPTIONS.map((status) => (
          <div key={status} className="rounded-2xl border bg-card p-4 shadow-soft">
            <p className="text-xs text-muted-foreground">{status}</p>
            <p className="mt-2 text-2xl font-semibold">{statusCounts[status]}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Date Range
        </p>
        <select
          value={rangeWeeks}
          onChange={(e) => setRangeWeeks(Number(e.target.value) as RangeWeeks)}
          className="rounded-lg border bg-background px-3 py-2 text-sm"
        >
          <option value={4}>Last 4 weeks</option>
          <option value={8}>Last 8 weeks</option>
          <option value={12}>Last 12 weeks</option>
        </select>
      </div>

      {/* Charts */}

      <div className="rounded-2xl border bg-card p-4 shadow-soft">
        <p className="text-sm font-medium mb-4">Application per Week</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklySeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#111827" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
