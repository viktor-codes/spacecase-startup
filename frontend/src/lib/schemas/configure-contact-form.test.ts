import { describe, expect, it } from "vitest";

import { configureContactFormSchema } from "@/lib/schemas/configure-contact-form";

describe("configureContactFormSchema", () => {
  const valid = {
    fullName: "Ada Lovelace",
    email: "ada@example.com",
    phone: "+353 1 234 5678",
    line1: "1 Street Name",
    line2: "",
    city: "Dublin",
    eirCode: "D02 X285",
  };

  it("parses a complete valid payload", () => {
    const result = configureContactFormSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("fails on invalid email", () => {
    const result = configureContactFormSchema.safeParse({
      ...valid,
      email: "not-email",
    });
    expect(result.success).toBe(false);
  });

  it("fails when full name is too short", () => {
    const result = configureContactFormSchema.safeParse({
      ...valid,
      fullName: "A",
    });
    expect(result.success).toBe(false);
  });

  it("fails on invalid Eircode", () => {
    const result = configureContactFormSchema.safeParse({
      ...valid,
      eirCode: "INVALID",
    });
    expect(result.success).toBe(false);
  });
});
