/**
 * Configure upload flow: ordered steps (0..4). Eligibility can drop when NASA
 * image is cleared, but the UI never hides a step once revealed (monotonic).
 */

export const CONFIGURE_STEP_IDS = [
  "sky",
  "device",
  "delivery",
  "details",
  "summary",
] as const;

export type ConfigureStepId = (typeof CONFIGURE_STEP_IDS)[number];

/** 0-based indices aligned with CONFIGURE_STEP_IDS order */
export const CONFIGURE_STEP_INDEX = {
  SKY: 0,
  DEVICE: 1,
  DELIVERY: 2,
  DETAILS: 3,
  SUMMARY: 4,
} as const;

export type ConfigureStepVisibilityInput = {
  hasApodImage: boolean;
};

/**
 * Highest step index (0-based) that current data says may be shown.
 * Steps 0–2 (sky, device, delivery) are always eligible.
 * Steps 3–4 unlock once a synced APOD image exists. Eligibility can drop if
 * the image is cleared; the UI keeps revealed steps via separate state.
 */
export function getEligibleMaxStepIndex(
  input: ConfigureStepVisibilityInput,
): number {
  if (input.hasApodImage) {
    return CONFIGURE_STEP_INDEX.SUMMARY;
  }
  return CONFIGURE_STEP_INDEX.DELIVERY;
}

export function isStepIndexVisible(
  stepIndex: number,
  maxRevealedStepIndex: number,
): boolean {
  return stepIndex <= maxRevealedStepIndex;
}
