export default function SettingsPage() {
  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Settings
        </p>
        <h1 className="text-3xl font-semibold">Preferences</h1>
        <p className="text-sm text-muted-foreground">
          Settings scaffolding area for future configuration.
        </p>
      </header>
      <div className="rounded-2xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">No settings yet.</p>
      </div>
    </section>
  );
}
