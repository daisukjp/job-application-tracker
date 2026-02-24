import { describe, it, expect, vi } from "vitest";
import { listApplications } from "@/lib/data/applications";

vi.mock("@/lib/supabaseClient.ts", () => {
  return {
    supabase: {
      from: () => ({
        select: () => ({
          order: async () => ({
            data: [
              {
                id: "1",
                company: "Test",
                role_title: "Engineer",
                status: "Applied",
                applied_at: "2025-01-01",
                source: null,
                location: null,
                notes: null,
                follow_up_date: null,
                created_at: "2025-01-01"
              }
            ],
            error: null
          })
        })
      })
    }
  };
});

describe("listApplications", () => {
  it("returns data from Supabase", async () => {
    const data = await listApplications();
    expect(data.length).toBe(1);
    expect(data[0].company).toBe("Test");
  });
});
