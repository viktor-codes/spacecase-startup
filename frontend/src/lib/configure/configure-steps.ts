import {
  isValidEmail,
  isValidEirCode,
  isValidShippingOption,
} from "@/lib/configure/checkout-validation";

/**
 * Configure upload flow: ordered steps (0..4). Cards unlock sequentially;
 * maxRevealedStepIndex only increases so revealed steps stay visible.
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

/**
 * Progress dots: a step is “done” only after the user has advanced past it
 * (sequential wizard), except sky (needs date + image) and order (checkout valid).
 */
export type SequentialConfigureProgressInput = {
  skyDone: boolean;
  /** Highest step index currently revealed (cards shown); monotonic. */
  maxRevealedStepIndex: number;
  isCheckoutFormValid: boolean;
};

export function getSequentialConfigureProgressFlags(
  input: SequentialConfigureProgressInput,
): boolean[] {
  const { skyDone, maxRevealedStepIndex, isCheckoutFormValid } = input;
  return [
    skyDone,
    maxRevealedStepIndex >= CONFIGURE_STEP_INDEX.DEVICE + 1,
    maxRevealedStepIndex >= CONFIGURE_STEP_INDEX.DELIVERY + 1,
    maxRevealedStepIndex >= CONFIGURE_STEP_INDEX.DETAILS + 1,
    isCheckoutFormValid,
  ];
}

export function isStepIndexVisible(
  stepIndex: number,
  maxRevealedStepIndex: number,
): boolean {
  return stepIndex <= maxRevealedStepIndex;
}

/** Short labels for progress UI (English; card titles stay in components). */
export const CONFIGURE_PROGRESS_LABELS: readonly string[] = [
  "Sky date",
  "iPhone",
  "Delivery",
  "Details",
  "Review",
];

export type ConfigureStepCompletionInput = {
  selectedDate: string;
  hasApodImage: boolean;
  deviceModel: string;
  shipping: string;
  fullName: string;
  email: string;
  eirCode: string;
  isFullCheckoutValid: boolean;
};

/**
 * Per-step completion for the progress indicator (achievement / filled segments).
 * Order matches {@link CONFIGURE_STEP_IDS}.
 */
export function getConfigureStepCompletionFlags(
  input: ConfigureStepCompletionInput,
): boolean[] {
  const sky = Boolean(input.selectedDate.trim()) && input.hasApodImage;
  const device = Boolean(input.deviceModel.trim());
  const delivery = isValidShippingOption(input.shipping);
  const details =
    input.fullName.trim().length >= 2 &&
    isValidEmail(input.email) &&
    isValidEirCode(input.eirCode);
  const order = input.isFullCheckoutValid;
  return [sky, device, delivery, details, order];
}
