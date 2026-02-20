"use client";

type FiltersBarProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
};

const STATUS_OPTIONS = ["All", "Draft", "Applied", "Interviewing", "Offer", "Rejected"];
export default function FilterBar({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange
}: FiltersBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Search
        </label>
        <input
          value={searchQuery}
          onChange={(event) => {
            onSearchChange(event.target.value);
          }}
          placeholder="Company or Role..."
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none transition focus:border-foreground/40"
        />
      </div>

      {/* Status Filter */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Status
        </label>
        <select
          value={statusFilter}
          onChange={(event) => {
            onStatusChange(event.target.value);
          }}
          className="rounded-lg border bg-background px-3 py-2 text-sm outline-none"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
