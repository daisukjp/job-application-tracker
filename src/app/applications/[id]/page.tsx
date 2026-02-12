"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useApplicationsStore } from "@/lib/store/applications";
import ApplicationForm, {
  type ApplicationFormValues
} from "@/app/applications/ApplicationEditForm";

type ApplicationDetailPageProps = {
  params: { id: string };
};

type ToastState = {
  visible: boolean;
  message: string;
};

export default function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  const router = useRouter();

  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: ""
  });

  const getById = useApplicationsStore((state) => state.getById);
  const updateApplication = useApplicationsStore((state) => state.updateApplication);

  const application = useMemo(() => {
    return getById(params.id);
  }, [getById, params.id]);

  if (!application) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">Application Not Found</h1>
        <p className="text-sm text-muted-foreground">
          The requested application could not be found.
        </p>
        <button
          className="rounded-lg border px-4 py-2 text-sm"
          onClick={() => router.push("/applications")}
        >
          Back to Applications
        </button>
      </section>
    );
  }

  const handleSave = (values: ApplicationFormValues) => {
    const appliedAtIso = new Date(`${values.appliedAt}T00:00:00`).toISOString();

    updateApplication(application.id, {
      company: values.company,
      roleTitle: values.roleTitle,
      status: values.status,
      appliedAt: appliedAtIso,
      source: values.source ?? "",
      location: values.location ?? "",
      notes: values.notes ?? ""
    });

    setIsEditing(false);
    setToast({ visible: true, message: "Application updated." });
    setTimeout(() => {
      setToast({ visible: false, message: "" });
    }, 2500);
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Application Detail
        </p>
        <h1 className="text-3xl font-semibold">
          {application.company} - {application.roleTitle}
        </h1>
        <p className="text-sm text-muted-foreground">View or edit this application.</p>
      </header>
      {/* Editing mode switch button */}
      <div>
        <button
          className="rounded-lg border px-4 py-2 text-sm"
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {isEditing ? "Cancel Edit" : "Edit"}
        </button>
      </div>

      {/* Display mode */}
      {!isEditing ? (
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Company
              </dt>
              <dd className="text-sm">{application.company}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Role
              </dt>
              <dd className="text-sm">{application.roleTitle}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status
              </dt>
              <dd className="text-sm">{application.status}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Applied At
              </dt>
              <dd className="text-sm">{new Date(application.appliedAt).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Source
              </dt>
              <dd className="text-sm">{application.source || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Location
              </dt>
              <dd className="text-sm">{application.location || "—"}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Notes
              </dt>
              <dd className="text-sm whitespace-pre-wrap">{application.notes || "—"}</dd>
            </div>
          </dl>
        </div>
      ) : (
        // Editing Mode
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <ApplicationForm
            defaultValues={{
              company: application.company,
              roleTitle: application.roleTitle,
              status: application.status,
              appliedAt: application.appliedAt.slice(0, 10), // date input  ds
              source: application.source ?? "",
              location: application.location ?? "",
              notes: application.notes ?? ""
            }}
            onSubmit={handleSave}
            onCancel={() => setIsEditing(false)}
            submitLabel="Save"
          />
        </div>
      )}
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
