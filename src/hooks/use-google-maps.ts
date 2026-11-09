import { useEffect, useState } from "react";

import { getBrowserKey, loadGoogleMaps } from "@/lib/google-maps";
import { useI18n } from "@/lib/i18n";

export type MapsStatus = "loading" | "ready" | "missing-key" | "error";

/** Loads Google Maps after hydration and reports whether it can be used. */
export function useGoogleMaps() {
  const { lang } = useI18n();
  const [status, setStatus] = useState<MapsStatus>("loading");

  useEffect(() => {
    if (!getBrowserKey()) {
      setStatus("missing-key");
      return;
    }
    let active = true;
    loadGoogleMaps(lang)
      .then(() => active && setStatus("ready"))
      .catch(() => active && setStatus("error"));
    return () => {
      active = false;
    };
    // The script loads once; later language changes keep the first locale.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return status;
}
