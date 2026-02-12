"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ApplicationForm, {
  type ApplicationFormValues
} from "@/app/applications/ApplicationEditForm";
import { useApplicationsStore } from "@/lib/store/applications";

type ToastState = {
  visible: boolean;
  message: string;
};

export default function NewApplicationPage() {
  const router = useRouter();
  const createApplication = useApplicationsStore((state) => state.createApplication);

  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: ""
  });

  const handleSubmit = async (values: ApplicationFormValues) => {
    const id = crypto.randomUUID();
    const appliedAtIso = new Date(`${values.appliedAt}T00:00:00`).toISOString();
    const notesPreview = values.notes ? values.notes.slice(0, 60) : "";

    createApplication({
      id,
      company: values.company,
      roleTitle: values.roleTitle,
      status: values.status,
      appliedAt: appliedAtIso,
      source: values.source ?? "",
      location: values.location ?? "",
      notesPreview,
      notes: values.notes ?? ""
    });

    setToast({ visible: true, message: "Application created." });

    setTimeout(() => {
      setToast({ visible: false, message: "" });
      router.push(`/applications/${id}`);
    }, 800);
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Applications
        </p>
        <h1 className="text-3xl font-semibold">New Application</h1>
        <p className="text-sm text-muted-foreground">Create a new application record.</p>
      </header>

      <div className="rounded-2xl border bg-card p-6 shadow-soft">
        <ApplicationForm
          defaultValues={{
            company: "",
            roleTitle: "",
            status: "Applied",
            appliedAt: "",
            source: "",
            location: "",
            notes: ""
          }}
          onSubmit={handleSubmit}
          submitLabel="Create"
        />
      </div>

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
