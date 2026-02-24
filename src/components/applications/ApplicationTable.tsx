"use client";

import { memo } from "react";
import { TableVirtuoso } from "react-virtuoso";
import { cn } from "@/lib/utils";

export type Application = {
  id: string;
  company: string;
  roleTitle: string;
  status: "Draft" | "Applied" | "Interviewing" | "Offer" | "Rejected";
  appliedAt: string;
  followUpDate: string | null;
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
  onStatusChange: (id: string, nextStatus: Application["status"]) => void;
};

const STATUS_OPTIONS: Application["status"][] = [
  "Draft",
  "Applied",
  "Interviewing",
  "Offer",
  "Rejected"
];

const ROW_HEIGHT = 52;
const TABLE_HEIGHT = 520;

const RowCells = memo(function RowCells({
  app,
  onRowClick,
  onStatusChange
}: {
  app: Application;
  onRowClick: (id: string) => void;
  onStatusChange: (id: string, nextStatus: Application["status"]) => void;
}) {
  const handleRowClick = () => onRowClick(app.id);

  return (
    <>
      <td className="px-6 py-4 font-medium" onClick={handleRowClick}>
        {app.company}
      </td>
      <td className="px-4 py-4 text-muted-foreground" onClick={handleRowClick}>
        {app.roleTitle}
      </td>
      <td className="px-4 py-4">
        <select
          onClick={(event) => event.stopPropagation()}
          onChange={(event) => onStatusChange(app.id, event.target.value as Application["status"])}
          value={app.status}
          className={cn("rounded-md border px-2 py-1 text-xs font-medium", "bg-background")}
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-4 text-muted-foreground" onClick={handleRowClick}>
        {new Date(app.appliedAt).toLocaleDateString()}
      </td>
      <td className="px-4 py-4 text-muted-foreground" onClick={handleRowClick}>
        {app.source ?? "—"}
      </td>
      <td className="px-4 py-4 text-muted-foreground" onClick={handleRowClick}>
        {app.location ?? "—"}
      </td>
      <td className="px-4 py-4 pr-6 text-muted-foreground" onClick={handleRowClick}>
        {app.notesPreview ?? "—"}
      </td>
    </>
  );
});

export default function ApplicationTable({
  applications,
  sortKey,
  sortOrder,
  onSortChange,
  onRowClick,
  onStatusChange
}: ApplicationTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border bg-card shadow-soft">
      <TableVirtuoso
        data={applications}
        style={{ height: TABLE_HEIGHT }}
        fixedHeaderContent={() => (
          <tr className="bg-muted/80 backdrop-blur border-b">
            <SortableHeader
              label="Company"
              active={sortKey === "company"}
              order={sortOrder}
              onClick={() => onSortChange("company")}
              className="pl-6"
            />
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <SortableHeader
              label="Applied"
              active={sortKey === "appliedAt"}
              order={sortOrder}
              onClick={() => onSortChange("appliedAt")}
            />
            <th className="px-4 py-3">Source</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3 pr-6">Notes</th>
          </tr>
        )}
        itemContent={(_index, app) => (
          <RowCells app={app} onRowClick={onRowClick} onStatusChange={onStatusChange} />
        )}
        components={{
          Table: (props) => <table {...props} className="w-full text-left text-sm" />,
          TableRow: (props) => <tr {...props} className="border-t" />
        }}
      />
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
