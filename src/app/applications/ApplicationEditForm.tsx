"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { Application } from "@/lib/store/applications";

export const applicationSchema = z.object({
  company: z.string().min(1, "Company is required"),
  roleTitle: z.string().min(1, "Role Title is required"),
  status: z.enum(["Draft", "Applied", "Interviewing", "Offer", "Rejected"]),
  appliedAt: z.string().min(1, "Applied At is required"),
  source: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional()
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;

type ApplicationFormProps = {
  defaultValues: ApplicationFormValues;
  onSubmit: (value: ApplicationFormValues) => void;
  onCancel?: () => void;
  submitLabel?: string;
};

export default function ApplicationForm({
  defaultValues,
  onSubmit,
  onCancel,
  submitLabel = "Save"
}: ApplicationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Company */}
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Company *
        </label>
        <input
          {...register("company")}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
        />
        {errors.company && <p className="text-xs text-red-600">{errors.company.message}</p>}
      </div>

      {/* Role Title */}
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Role title *
        </label>
        <input
          {...register("roleTitle")}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
        />
        {errors.roleTitle && <p className="text-xs text-red-600">{errors.roleTitle.message}</p>}
      </div>

      {/* Status */}
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Status *
        </label>
        <select
          {...register("status")}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
        >
          <option value="Draft">Draft</option>
          <option value="Applied">Applied</option>
          <option value="Interviewing">Interviewing</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
        </select>
        {errors.status && <p className="text-xs text-red-600">{errors.status.message}</p>}
      </div>

      {/* Applied At */}
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Applied At *
        </label>
        <input
          type="date"
          {...register("appliedAt")}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
        />
        {errors.appliedAt && <p className="text-xs text-red-600">{errors.appliedAt.message}</p>}
      </div>

      {/* Source */}
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Source
        </label>
        <input
          {...register("source")}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
        />
      </div>

      {/* Location */}
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Location
        </label>
        <input
          {...register("location")}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
        />
      </div>

      {/* Notes */}
      <div className="space-y-1">
        <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Notes
        </label>
        <textarea
          {...register("notes")}
          rows={4}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-foreground px-4 py-2 text-sm text-background transition hover:bg-foreground/90 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>

        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border px-4 py-2 text-sm text-foreground transition hover:bg-accent"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
