import { z } from "zod"

// Polish phone: optional +48, 9 digits (allow spaces/dashes)
const PHONE_REGEX = /^(\+?48)?[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{3}$/

export const profileSchema = z.object({
  full_name: z
    .string()
    .trim()
    .max(120, "Imię i nazwisko max 120 znaków")
    .optional()
    .default(""),
  company_name: z
    .string()
    .trim()
    .max(200, "Nazwa firmy max 200 znaków")
    .optional()
    .default(""),
  phone: z
    .string()
    .trim()
    .max(20, "Numer telefonu max 20 znaków")
    .refine((v) => v === "" || PHONE_REGEX.test(v), {
      message: "Niepoprawny numer telefonu (oczekiwany format: +48 123 456 789)",
    })
    .optional()
    .default(""),
})

export const notificationPreferencesSchema = z.object({
  notification_email: z.boolean(),
  notification_push: z.boolean(),
  notification_sms: z.boolean(),
})

export const searchPreferencesSchema = z
  .object({
    preferred_regions: z
      .array(z.string().trim().min(1).max(40))
      .max(16, "Maksymalnie 16 województw"),
    preferred_cpv_codes: z
      .array(z.string().trim().min(1).max(100))
      .max(50, "Maksymalnie 50 kategorii CPV"),
    kfs_priorities: z
      .array(z.string().trim().min(1).max(100))
      .max(20, "Maksymalnie 20 priorytetów KFS"),
    budget_min: z
      .number()
      .finite()
      .nonnegative("Budżet min musi być >= 0")
      .max(1_000_000_000, "Budżet min zbyt duży")
      .nullable(),
    budget_max: z
      .number()
      .finite()
      .nonnegative("Budżet max musi być >= 0")
      .max(1_000_000_000, "Budżet max zbyt duży")
      .nullable(),
  })
  .refine(
    (d) =>
      d.budget_min === null ||
      d.budget_max === null ||
      d.budget_min <= d.budget_max,
    { message: "Budżet min nie może być większy niż budżet max", path: ["budget_min"] }
  )

export type ProfileInput = z.infer<typeof profileSchema>
export type NotificationPreferencesInput = z.infer<typeof notificationPreferencesSchema>
export type SearchPreferencesInput = z.infer<typeof searchPreferencesSchema>
