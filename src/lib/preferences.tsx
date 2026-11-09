import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

const STORAGE_KEY = "sufi-map:preferences";

/** always: quote stays; explore: quote steps aside while the map is being moved; hidden: never shown. */
export const QUOTE_MODES = ["always", "explore", "hidden"] as const;
export type QuoteMode = (typeof QUOTE_MODES)[number];

/** Seconds of stillness before the quote returns in "explore" mode. */
export const QUOTE_RETURN_OPTIONS = [3, 6, 12] as const;
export type QuoteReturnSeconds = (typeof QUOTE_RETURN_OPTIONS)[number];

export interface Preferences {
  quoteMode: QuoteMode;
  quoteReturnSeconds: QuoteReturnSeconds;
}

export const DEFAULT_PREFERENCES: Preferences = { quoteMode: "explore", quoteReturnSeconds: 6 };

export function shouldShowQuote(mode: QuoteMode, exploring: boolean) {
  if (mode === "hidden") return false;
  if (mode === "explore") return !exploring;
  return true;
}

/** Drops unknown or malformed stored values so old devices fall back to defaults. */
export function parsePreferences(raw: unknown): Preferences {
  const v = (raw && typeof raw === "object" ? raw : {}) as Partial<Record<keyof Preferences, unknown>>;
  return {
    quoteMode: QUOTE_MODES.includes(v.quoteMode as QuoteMode)
      ? (v.quoteMode as QuoteMode)
      : DEFAULT_PREFERENCES.quoteMode,
    quoteReturnSeconds: QUOTE_RETURN_OPTIONS.includes(v.quoteReturnSeconds as QuoteReturnSeconds)
      ? (v.quoteReturnSeconds as QuoteReturnSeconds)
      : DEFAULT_PREFERENCES.quoteReturnSeconds,
  };
}

interface PreferencesValue {
  prefs: Preferences;
  update: (patch: Partial<Preferences>) => void;
}

const PreferencesContext = createContext<PreferencesValue | null>(null);

/** Visitor display preferences, kept on their own device. */
export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setPrefs(parsePreferences(JSON.parse(raw)));
    } catch {
      /* ignore malformed preferences */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  }, [prefs, loaded]);

  const update = useCallback((patch: Partial<Preferences>) => setPrefs((p) => ({ ...p, ...patch })), []);
  const value = useMemo(() => ({ prefs, update }), [prefs, update]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used inside PreferencesProvider");
  return ctx;
}
