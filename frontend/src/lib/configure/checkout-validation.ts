import type { ShippingOption } from "@/lib/configure/constants";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const EIRCODE_PATTERN = /^[AC-FHKNPRTV-Y]\d{2}\s?[AC-FHKNPRTV-Y0-9]{4}$/i;

export function isValidEmail(email: string): boolean {
  if (!email) return false;
  return EMAIL_PATTERN.test(email);
}

export function isValidEirCode(eirCode: string): boolean {
  const trimmed = eirCode.trim();
  if (!trimmed) return false;
  return EIRCODE_PATTERN.test(trimmed);
}

export function isValidShippingOption(value: string): value is ShippingOption {
  return value === "standard" || value === "express";
}

export type ConfigureCheckoutFields = {
  selectedDate: string;
  hasImage: boolean;
  deviceModel: string;
  shipping: string;
  email: string;
  fullName: string;
  phone: string;
  line1: string;
  city: string;
  eirCode: string;
};

export function isConfigureCheckoutComplete(
  fields: ConfigureCheckoutFields,
): boolean {
  return (
    Boolean(fields.selectedDate) &&
    fields.hasImage &&
    Boolean(fields.deviceModel) &&
    isValidShippingOption(fields.shipping) &&
    isValidEmail(fields.email) &&
    isValidEirCode(fields.eirCode) &&
    fields.fullName.trim().length >= 2 &&
    fields.phone.trim().length >= 5 &&
    fields.line1.trim().length >= 2 &&
    fields.city.trim().length >= 2
  );
}

export type ConfigureCompletionFields = {
  selectedDate: string;
  hasImage: boolean;
  deviceModel: string;
  fullName: string;
  email: string;
  eirCode: string;
};

export function getConfigureCompletionStep(
  fields: ConfigureCompletionFields,
): number {
  let completed = 0;
  if (fields.selectedDate) completed += 1;
  if (fields.hasImage) completed += 1;
  if (fields.deviceModel) completed += 1;
  if (
    fields.fullName.trim().length >= 2 &&
    isValidEmail(fields.email) &&
    isValidEirCode(fields.eirCode)
  ) {
    completed += 1;
  }
  return completed;
}
