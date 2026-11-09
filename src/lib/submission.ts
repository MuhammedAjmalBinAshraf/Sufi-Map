import { z } from "zod";

import { DISTRICT_KEYS, isInKerala, SITE_KINDS, type District } from "./sites";

export const SOURCE_TYPES = ["book", "oral", "archive", "website"] as const;

/* Error messages are i18n keys, translated where they are shown. */
export const placeSchema = z.object({
  name: z.string().trim().min(2, "err.name"),
  kind: z.enum(SITE_KINDS, { errorMap: () => ({ message: "err.kind" }) }),
  district: z.enum(DISTRICT_KEYS as [District, ...District[]], {
    errorMap: () => ({ message: "err.district" }),
  }),
  description: z.string().trim().min(20, "err.description").max(600, "err.descriptionMax"),
});

export const locationSchema = z
  .object({
    lat: z.number({ required_error: "err.coords", invalid_type_error: "err.coords" }),
    lng: z.number({ required_error: "err.coords", invalid_type_error: "err.coords" }),
  })
  .refine((v) => isInKerala(v.lat, v.lng), { message: "err.kerala", path: ["lat"] });

export const sourceSchema = z
  .object({
    sourceType: z.enum(SOURCE_TYPES, { errorMap: () => ({ message: "err.sourceType" }) }),
    sourceCitation: z.string().trim().min(5, "err.citation"),
    sourceUrl: z.union([z.literal(""), z.string().trim().url("err.url")]),
    involvesLiving: z.boolean(),
    livingConsent: z.boolean(),
  })
  .refine((v) => !v.involvesLiving || v.livingConsent, {
    message: "err.consent",
    path: ["livingConsent"],
  });

export const submissionSchema = z.intersection(
  placeSchema,
  z.intersection(locationSchema, sourceSchema),
);

export type SubmissionDraft = {
  name: string;
  kind: string;
  district: string;
  description: string;
  lat: number | undefined;
  lng: number | undefined;
  sourceType: string;
  sourceCitation: string;
  sourceUrl: string;
  involvesLiving: boolean;
  livingConsent: boolean;
};

export const EMPTY_DRAFT: SubmissionDraft = {
  name: "",
  kind: "",
  district: "",
  description: "",
  lat: undefined,
  lng: undefined,
  sourceType: "",
  sourceCitation: "",
  sourceUrl: "",
  involvesLiving: false,
  livingConsent: false,
};

export const STEP_SCHEMAS = [placeSchema, locationSchema, sourceSchema] as const;

/** Returns field → i18n error key for the given step (empty when valid). */
export function validateStep(step: number, draft: SubmissionDraft): Record<string, string> {
  const schema = STEP_SCHEMAS[step];
  if (!schema) return {};
  const result = schema.safeParse(draft);
  if (result.success) return {};
  const errors: Record<string, string> = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return errors;
}
