import { describe, expect, it } from "vitest";

import {
  getConfigureStepCompletionFlags,
  getEligibleMaxStepIndex,
  isStepIndexVisible,
} from "@/lib/configure/configure-steps";

describe("getEligibleMaxStepIndex", () => {
  it("returns index 2 when no APOD image", () => {
    expect(getEligibleMaxStepIndex({ hasApodImage: false })).toBe(2);
  });

  it("returns last step index when APOD image is present", () => {
    expect(getEligibleMaxStepIndex({ hasApodImage: true })).toBe(4);
  });
});

describe("isStepIndexVisible", () => {
  it("returns true when step is within revealed range", () => {
    expect(isStepIndexVisible(1, 3)).toBe(true);
  });

  it("returns false when step is above revealed range", () => {
    expect(isStepIndexVisible(4, 2)).toBe(false);
  });
});

describe("getConfigureStepCompletionFlags", () => {
  const base = {
    selectedDate: "2020-01-01",
    hasApodImage: true,
    deviceModel: "iPhone 15",
    shipping: "standard",
    fullName: "Jane Doe",
    email: "jane@example.com",
    eirCode: "D02 AF30",
    isFullCheckoutValid: true,
  } as const;

  it("returns five booleans matching step order", () => {
    const flags = getConfigureStepCompletionFlags({ ...base });
    expect(flags).toHaveLength(5);
    expect(flags.every((f) => f === true)).toBe(true);
  });

  it("marks sky incomplete without image", () => {
    const flags = getConfigureStepCompletionFlags({
      ...base,
      hasApodImage: false,
      isFullCheckoutValid: false,
    });
    expect(flags[0]).toBe(false);
  });
});
