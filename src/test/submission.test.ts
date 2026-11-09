import { describe, expect, it } from "vitest";

import { EMPTY_DRAFT, validateStep, type SubmissionDraft } from "@/lib/submission";

const sourced: SubmissionDraft = {
  ...EMPTY_DRAFT,
  sourceType: "book",
  sourceCitation: "Local history of Ponnani, p. 12",
};

describe("contributor submissions", () => {
  it("requires a source citation for every listing", () => {
    expect(validateStep(2, { ...sourced, sourceCitation: "" })).toHaveProperty("sourceCitation", "err.citation");
  });

  it("refuses a living Sufi listing without their consent", () => {
    expect(validateStep(2, { ...sourced, involvesLiving: true, livingConsent: false })).toHaveProperty(
      "livingConsent",
      "err.consent",
    );
  });

  it("accepts a living Sufi listing once consent is given", () => {
    expect(validateStep(2, { ...sourced, involvesLiving: true, livingConsent: true })).toEqual({});
  });

  it("only accepts coordinates inside Kerala", () => {
    // Chennai, Tamil Nadu
    expect(validateStep(1, { ...EMPTY_DRAFT, lat: 13.0827, lng: 80.2707 })).toHaveProperty("lat", "err.kerala");
    // Mamburam, Malappuram
    expect(validateStep(1, { ...EMPTY_DRAFT, lat: 11.0457, lng: 75.9262 })).toEqual({});
  });
});
