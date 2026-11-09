import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { EMPTY_COUNTS, type StewardCounts } from "./badges";

const STORAGE_KEY = "sufi-map:steward";

interface StewardValue {
  counts: StewardCounts;
  markVisited: (id: string) => void;
  toggleSaved: (id: string) => void;
  recordSubmission: () => void;
  recordCorrection: () => void;
}

const StewardContext = createContext<StewardValue | null>(null);

/** Keeps this visitor's humble stewardship progress on their own device. */
export function StewardProvider({ children }: { children: ReactNode }) {
  const [counts, setCounts] = useState<StewardCounts>(EMPTY_COUNTS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setCounts({ ...EMPTY_COUNTS, ...(JSON.parse(raw) as Partial<StewardCounts>) });
    } catch {
      /* ignore malformed progress */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
  }, [counts, loaded]);

  const markVisited = useCallback(
    (id: string) =>
      setCounts((c) => (c.visited.includes(id) ? c : { ...c, visited: [...c.visited, id] })),
    [],
  );
  const toggleSaved = useCallback(
    (id: string) =>
      setCounts((c) => ({
        ...c,
        saved: c.saved.includes(id) ? c.saved.filter((s) => s !== id) : [...c.saved, id],
      })),
    [],
  );
  const recordSubmission = useCallback(
    () => setCounts((c) => ({ ...c, submissions: c.submissions + 1 })),
    [],
  );
  const recordCorrection = useCallback(
    () => setCounts((c) => ({ ...c, corrections: c.corrections + 1 })),
    [],
  );

  const value = useMemo(
    () => ({ counts, markVisited, toggleSaved, recordSubmission, recordCorrection }),
    [counts, markVisited, toggleSaved, recordSubmission, recordCorrection],
  );

  return <StewardContext.Provider value={value}>{children}</StewardContext.Provider>;
}

export function useSteward() {
  const ctx = useContext(StewardContext);
  if (!ctx) throw new Error("useSteward must be used inside StewardProvider");
  return ctx;
}
