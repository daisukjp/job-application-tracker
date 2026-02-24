"use client";

import { supabase } from "../supabaseClient";
import { logError } from "../logging";

export type ApplicationRow = {
  id: string;
  company: string;
  role_title: string;
  status: string;
  applied_at: string;
  source: string | null;
  location: string | null;
  notes: string | null;
  follow_up_date: string | null;
  created_at: string;
};

//  listApplications:
export async function listApplications(): Promise<ApplicationRow[]> {
  const { data, error } = await supabase
    .from("applications")
    .select("*")
    .order("applied_at", { ascending: false });

  if (error) {
    logError(error, { area: "listApplications" });
    throw new Error(error.message);
  }
  return data ?? [];
}

// getApplication:
export async function getApplication(id: string): Promise<ApplicationRow | null> {
  const { data, error } = await supabase.from("applications").select("*").eq("id", id).single();

  if (error) return null;
  return data ?? null;
}

// createApplication:
export async function createApplication(
  payload: Omit<ApplicationRow, "id" | "created_at">
): Promise<ApplicationRow> {
  const { data, error } = await supabase.from("applications").insert(payload).select("*").single();

  if (error) throw new Error(error.message);

  return data;
}

// updateApplication:
export async function updateApplication(
  id: string,
  patch: Partial<Omit<ApplicationRow, "id" | "created_at">>
): Promise<ApplicationRow> {
  const { data, error } = await supabase
    .from("applications")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);

  return data;
}
