import { z } from "zod";
import { logError } from "./logging";

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1)
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
});

if (!parsed.success) {
  logError(parsed.error, { area: "env-validation" });
  throw new Error("Missing or invalid environment variables. Check .env.local");
}

export const env = parsed.data;
