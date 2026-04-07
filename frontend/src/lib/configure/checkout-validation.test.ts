import { describe, expect, it } from "vitest";

import {
  getConfigureCompletionStep,
  isConfigureCheckoutComplete,
  isValidEirCode,
  isValidEmail,
  isValidShippingOption,
} from "@/lib/configure/checkout-validation";

describe("isValidEmail", () => {
  it("returns false for empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });

  it("returns true for a simple valid email", () => {
    expect(isValidEmail("hello@example.com")).toBe(true);
  });

  it("returns false for invalid format", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
  });
});

describe("isValidEirCode", () => {
  it("returns false when empty", () => {
    expect(isValidEirCode("")).toBe(false);
  });

  it("accepts valid Irish Eircode format", () => {
    expect(isValidEirCode("A65 F4E2")).toBe(true);
    expect(isValidEirCode("D02X285")).toBe(true);
  });
});

describe("isValidShippingOption", () => {
  it("narrows standard and express", () => {
    expect(isValidShippingOption("standard")).toBe(true);
    expect(isValidShippingOption("express")).toBe(true);
    expect(isValidShippingOption("other")).toBe(false);
  });
});

describe("isConfigureCheckoutComplete", () => {
  const base = {
    selectedDate: "2020-01-01",
    hasImage: true,
    deviceModel: "iPhone 16",
    shipping: "standard",
    email: "a@b.co",
    fullName: "Ada Lovelace",
    phone: "12345678901",
    line1: "1 Street",
    city: "Dublin",
    eirCode: "D02 X285",
  };

  it("returns true when all fields satisfy rules", () => {
    expect(isConfigureCheckoutComplete(base)).toBe(true);
  });

  it("returns false without image", () => {
    expect(isConfigureCheckoutComplete({ ...base, hasImage: false })).toBe(
      false,
    );
  });

  it("returns false with invalid email", () => {
    expect(isConfigureCheckoutComplete({ ...base, email: "bad" })).toBe(false);
  });
});

describe("getConfigureCompletionStep", () => {
  it("counts four steps when date, image, device, and contact basics are done", () => {
    expect(
      getConfigureCompletionStep({
        selectedDate: "2020-01-01",
        hasImage: true,
        deviceModel: "Pixel",
        fullName: "Ada",
        email: "a@b.co",
        eirCode: "D02 X285",
      }),
    ).toBe(4);
  });
});
