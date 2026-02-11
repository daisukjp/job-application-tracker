export default function DashboardPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Dashboard
        </p>
        <h1 className="text-3xl font-semibold">Overview</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Your job search at a glance. This is a scaffolded layout ready for future data.
        </p>
      </header>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border bg-card p-4 shadow-soft"
          >
            <p className="text-xs font-medium text-muted-foreground">Placeholder</p>
            <p className="mt-3 text-lg font-semibold">Card {index + 1}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              This area will hold metrics or recent updates.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
