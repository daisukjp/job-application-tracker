type ApplicationDetailPageProps = {
  params: { id: string };
};

export default function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  return (
    <section className="space-y-4">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Application Detail
        </p>
        <h1 className="text-3xl font-semibold">Application {params.id}</h1>
        <p className="text-sm text-muted-foreground">
          Detail view scaffold. Future content will load application data by ID.
        </p>
      </header>
      <div className="rounded-2xl border bg-card p-6">
        <p className="text-sm text-muted-foreground">No details yet.</p>
      </div>
    </section>
  );
}
