"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "@/components/ui/Skeleton";
import { listApplications, type ApplicationRow } from "@/lib/data/applications";

export default function FollowUpsPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["applications"],
    queryFn: listApplications
  });

  // Today
  const today = new Date();
  const todayIso = today.toISOString().slice(0, 10);

  const upcomingLimit = new Date();
  upcomingLimit.setDate(today.getDate() + 7);
  const upcomingIso = upcomingLimit.toISOString().slice(0, 10);

  const withFollowUp = useMemo(() => {
    return (data ?? []).filter((app) => app.follow_up_date);
  }, [data]);

  const overdue = useMemo(() => {
    return withFollowUp.filter((app) => app.follow_up_date! < todayIso);
  }, [withFollowUp, todayIso]);

  const dueToday = useMemo(() => {
    return withFollowUp.filter((app) => app.follow_up_date === todayIso);
  }, [withFollowUp, todayIso]);

  const upcoming = useMemo(() => {
    return withFollowUp.filter(
      (app) => app.follow_up_date! > todayIso && app.follow_up_date! <= upcomingIso
    );
  }, [withFollowUp, todayIso, upcomingIso]);

  if (isLoading) {
    return (
      <section className="space-y-4">
        <Skeleton className="h-8 w-40" />
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

  const copyTemplate = (app: ApplicationRow) => {
    const text = `Hi ${app.company} team,

    I wanted to follow up on my application for the ${app.role_title} role.
    I’m still very interested and would love to hear about next steps.

    Thanks,
    [Your Name]`;

    navigator.clipboard.writeText(text);
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Follow-ups
        </p>
        <h1 className="text-3xl font-semibold">Reminders</h1>
      </header>

      <FollowUpSection title="Overdue" items={overdue} onCopy={copyTemplate} />
      <FollowUpSection title="Due Today" items={dueToday} onCopy={copyTemplate} />
      <FollowUpSection title="Upcoming (7 days)" items={upcoming} onCopy={copyTemplate} />
    </section>
  );
}

function FollowUpSection({
  title,
  items,
  onCopy
}: {
  title: string;
  items: ApplicationRow[];
  onCopy: (app: ApplicationRow) => void;
}) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-soft space-y-3">
      <h2 className="text-lg font-semibold">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No items.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((app) => (
            <li key={app.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{app.company}</p>
                <p className="text-xs text-muted-foreground">{app.role_title}</p>
              </div>
              <button className="rounded-lg border px-3 py-1 text-xs" onClick={() => onCopy(app)}>
                Copy email template
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
