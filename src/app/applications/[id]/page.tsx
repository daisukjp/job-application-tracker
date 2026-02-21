"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ApplicationForm, {
  type ApplicationFormValues
} from "@/components/applications/ApplicationEditForm";
import Skeleton from "@/components/ui/Skeleton";
import { getApplication, updateApplication } from "@/lib/data/applications";

type ApplicationDetailPageProps = {
  params: { id: string };
};

type ToastState = {
  visible: boolean;
  message: string;
};

export default function ApplicationDetailPage({ params }: ApplicationDetailPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: ""
  });

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["applications", params.id],
    queryFn: () => getApplication(params.id)
  });

  const updateMutation = useMutation({
    mutationFn: (values: ApplicationFormValues) =>
      updateApplication(params.id, {
        company: values.company,
        role_title: values.roleTitle,
        status: values.status,
        applied_at: values.appliedAt,
        source: values.source ?? null,
        location: values.location ?? null,
        notes: values.notes ?? null
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["applications", params.id] });

      setIsEditing(false);
      setToast({ visible: true, message: "Application updated." });

      setTimeout(() => {
        setToast({ visible: false, message: "" });
      }, 2500);
    }
  });

  if (isLoading) {
    return (
      <section className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-6 w-40" />
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

  if (!data) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-semibold">Application Not Found</h1>
        <button
          className="rounded-lg border px-4 py-2 text-sm"
          onClick={() => router.push("/applications")}
        >
          Back to Applications
        </button>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          Application Detail
        </p>
        <h1 className="text-3xl font-semibold">
          {data.company} - {data.role_title}
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
              <dd className="text-sm">{data.company}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Role
              </dt>
              <dd className="text-sm">{data.role_title}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Status
              </dt>
              <dd className="text-sm">{data.status}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Applied At
              </dt>
              <dd className="text-sm">{new Date(data.applied_at).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Source
              </dt>
              <dd className="text-sm">{data.source || "—"}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Location
              </dt>
              <dd className="text-sm">{data.location || "—"}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Notes
              </dt>
              <dd className="text-sm whitespace-pre-wrap">{data.notes || "—"}</dd>
            </div>
          </dl>
        </div>
      ) : (
        // Editing Mode
        <div className="rounded-2xl border bg-card p-6 shadow-soft">
          <ApplicationForm
            defaultValues={{
              company: data.company,
              roleTitle: data.role_title,
              status: data.status as ApplicationFormValues["status"],
              appliedAt: data.applied_at,
              source: data.source ?? "",
              location: data.location ?? "",
              notes: data.notes ?? ""
            }}
            onSubmit={(values) => updateMutation.mutate(values)}
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
