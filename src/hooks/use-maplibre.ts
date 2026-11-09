import { useEffect, useState } from "react";

import { loadMapLibre, type MapLibreModule } from "@/lib/maplibre";

export type MapStatus = "loading" | "ready" | "error";

/** Loads MapLibre after hydration; the module is null until it is ready. */
export function useMapLibre() {
  const [state, setState] = useState<{ status: MapStatus; ml: MapLibreModule | null }>({
    status: "loading",
    ml: null,
  });

  useEffect(() => {
    let active = true;
    loadMapLibre()
      .then((ml) => active && setState({ status: "ready", ml }))
      .catch(() => active && setState({ status: "error", ml: null }));
    return () => {
      active = false;
    };
  }, []);

  return state;
}
