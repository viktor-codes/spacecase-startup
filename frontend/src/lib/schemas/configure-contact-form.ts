import { z } from "zod";

import { isValidEirCode, isValidEmail } from "@/lib/configure/checkout-validation";

export const configureContactFormSchema = z.object({
  fullName: z
    .string()
    .refine((s) => s.trim().length >= 2, { message: "Enter at least 2 characters." }),
  email: z.string().refine((s) => isValidEmail(s), {
    message: "Please enter a valid email address.",
  }),
  phone: z
    .string()
    .refine((s) => s.trim().length >= 5, { message: "Enter a valid phone number." }),
  line1: z
    .string()
    .refine((s) => s.trim().length >= 2, { message: "Enter address line 1." }),
  line2: z.string(),
  city: z
    .string()
    .refine((s) => s.trim().length >= 2, { message: "Enter a city." }),
  eirCode: z.string().refine((s) => isValidEirCode(s), {
    message: "Enter a valid Eircode (e.g. A65 F4E2).",
  }),
});

export type ConfigureContactFormValues = z.infer<typeof configureContactFormSchema>;
