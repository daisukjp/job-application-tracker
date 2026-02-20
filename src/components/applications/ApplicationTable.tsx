"use client";

import { cn } from "@/lib/utils";

export type Application = {
  id: string;
  company: string;
  roleTitle: string;
  status: "Draft" | "Applied" | "Interviewing" | "Offer" | "Rejected";
  appliedAt: string;
  source: string | null;
  location: string | null;
  notesPreview: string | null;
};

export type SortKey = "company" | "appliedAt";
export type SortOrder = "asc" | "desc";

type ApplicationTableProps = {
  applications: Application[];
  sortKey: SortKey;
  sortOrder: SortOrder;
  onSortChange: (key: SortKey) => void;
  onRowClick: (id: string) => void;
};

const STATUS_STYLES: Record<Application["status"], string> = {
  Draft: "bg-muted text-muted-foreground",
  Applied: "bg-blue-50 text-blue-700",
  Interviewing: "bg-amber-50 text-amber-700",
  Offer: "bg-emerald-50 text-emerald-700",
  Rejected: "bg-rose-50 text-rose-700"
};

export default function ApplicationTable({
  applications,
  sortKey,
  sortOrder,
  onSortChange,
  onRowClick
}: ApplicationTableProps) {
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <SortableHeader
              label="Company"
              active={sortKey === "company"}
              order={sortOrder}
              onClick={() => onSortChange("company")}
            />
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3 pr-6">Notes</th>
          </tr>
        </thead>

        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">
                No application found.
              </td>
            </tr>
          ) : (
            applications.map((app) => (
              <tr
                key={app.id}
                className="cursor-pointer border-t transition hover:bg-accent/40"
                onClick={() => onRowClick(app.id)}
              >
                <td className="px-6 py-4 font-medium">{app.company}</td>
                <td className="px-4 py-4 text-muted-foreground">{app.roleTitle}</td>
                <td className="px-4 py-4">
                  <span
                    className={cn(
                      "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                      STATUS_STYLES[app.status]
                    )}
                  >
                    {app.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-muted-foreground">
                  {new Date(app.appliedAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-4 text-muted-foreground">{app.source}</td>
                <td className="px-4 py-4 text-muted-foreground">{app.location}</td>
                <td className="px-4 py-4 pr-6 text-muted-foreground">{app.notesPreview}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

type SortableHeaderProps = {
  label: string;
  active: boolean;
  order: SortOrder;
  onClick: () => void;
  className?: string;
};

function SortableHeader({ label, active, order, onClick, className }: SortableHeaderProps) {
  return (
    <th
      onClick={onClick}
      className={cn(
        "cursor-pointer select-none px-4 py-3 font-semibold text-foreground",
        className
      )}
    >
      <span className="inline-flex items-center gap-2">
        {label}
        {active ? (
          <span className="text-xs text-muted-foreground">{order === "asc" ? "↑" : "↓"}</span>
        ) : null}
      </span>
    </th>
  );
}
