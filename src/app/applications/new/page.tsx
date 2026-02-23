"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import ApplicationForm, {
  type ApplicationFormValues
} from "@/components/applications/ApplicationForm";
import { createApplication } from "@/lib/data/applications";

type ToastState = {
  visible: boolean;
  message: string;
};

export default function NewApplicationPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: ""
  });

  const createMutation = useMutation({
    mutationFn: createApplication,
    onSuccess: (created) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });

      setToast({ visible: true, message: "Application created." });

      setTimeout(() => {
        setToast({ visible: false, message: "" });
        router.push(`/applications/${created.id}`);
      }, 800);
    }
  });

  const handleSubmit = async (values: ApplicationFormValues) => {
    createMutation.mutate({
      company: values.company,
      role_title: values.roleTitle,
      status: values.status,
      applied_at: values.appliedAt,
      source: values.source ?? null,
      location: values.location ?? null,
      notes: values.notes ?? null,
      follow_up_date: values.followUpDate || null
    });
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
            notes: "",
            followUpDate: ""
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
