import { describe, expect, it } from "vitest";

import { DEFAULT_PREFERENCES, parsePreferences, shouldShowQuote } from "@/lib/preferences";

describe("quote visibility settings", () => {
  it("hides the quote while the map is being explored in explore mode", () => {
    expect(shouldShowQuote("explore", true)).toBe(false);
  });

  it("shows the quote again once exploring stops in explore mode", () => {
    expect(shouldShowQuote("explore", false)).toBe(true);
  });

  it("keeps the quote visible during exploring in always mode", () => {
    expect(shouldShowQuote("always", true)).toBe(true);
  });

  it("never shows the quote in hidden mode", () => {
    expect(shouldShowQuote("hidden", false)).toBe(false);
  });

  it("defaults to hiding while exploring, returning after 6 seconds", () => {
    expect(DEFAULT_PREFERENCES).toEqual({ quoteMode: "explore", quoteReturnSeconds: 6 });
  });

  it("falls back to defaults for unknown stored values", () => {
    expect(parsePreferences({ quoteMode: "sometimes", quoteReturnSeconds: 99 })).toEqual(DEFAULT_PREFERENCES);
  });
});
