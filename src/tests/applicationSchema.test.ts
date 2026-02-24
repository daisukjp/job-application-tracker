import { describe, it, expect } from "vitest";
import { applicationSchema } from "@/components/applications/ApplicationForm";
describe("applicationSchema", () => {
  it("fails when required fields are missing", () => {
    const result = applicationSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("passes with required fields", () => {
    const result = applicationSchema.safeParse({
      company: "Test",
      roleTitle: "Engineer",
      status: "Applied",
      appliedAt: "2025-01-01"
    });
    expect(result.success).toBe(true);
  });
});
