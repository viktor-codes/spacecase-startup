import { describe, expect, it } from "vitest";

import {
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
