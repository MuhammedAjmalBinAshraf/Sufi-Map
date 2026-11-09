import type * as MapLibre from "maplibre-gl";

import type { SiteKind } from "./sites";

export type MapLibreModule = typeof MapLibre;

export const BASEMAP_STYLE =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json?key=cb1_551n_1_dee07681fafb4f6811bd2bbc";

/** Above this, the basemap has no tiles and requests fail. */
export const MAX_ZOOM = 19;

let loader: Promise<MapLibreModule> | null = null;

/**
 * Loads MapLibre in the browser only (it touches window at import), and points it
 * at its bundled worker — under Vite it cannot find the worker on its own.
 */
export function loadMapLibre(): Promise<MapLibreModule> {
  loader ??= Promise.all([
    import("maplibre-gl"),
    import("maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url"),
  ])
    .then(([ml, worker]) => {
      ml.setWorkerUrl(worker.default);
      return ml;
    })
    .catch((error: unknown) => {
      loader = null;
      throw error;
    });
  return loader;
}

/** Keeps the map canvas matched to its box as the sidebar or bottom sheet resizes. */
export function observeResize(map: MapLibre.Map, container: HTMLElement) {
  const observer = new ResizeObserver(() => map.resize());
  observer.observe(container);
  return () => observer.disconnect();
}

const KIND_LETTER: Record<SiteKind, string> = { maqam: "M", zawiya: "Z", dargah: "D", gathering: "G" };

/** 40px rounded emerald pin with a parchment category badge, styled by Sahn tokens. */
export function createPinElement(kind: SiteKind, label: string, onClick?: () => void) {
  const root = document.createElement("div");
  root.className = "group";
  root.dataset["selected"] = "false";

  const pin = document.createElement(onClick ? "button" : "div");
  pin.className =
    "relative flex size-10 cursor-pointer items-center justify-center rounded-[14px] border-2 border-card bg-primary text-primary-foreground shadow-float transition-all duration-250 ease-out hover:-translate-y-0.5 hover:bg-primary-hover group-data-[selected=true]:scale-110 group-data-[selected=true]:bg-foreground";
  pin.setAttribute("aria-label", label);
  pin.title = label;
  pin.innerHTML = `<svg width="18" height="20" viewBox="0 0 18 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round" aria-hidden="true"><path d="M9 1v3"/><path d="M9 4C4.8 6.4 2.5 9.5 2.5 12.7V19h13v-6.3C15.5 9.5 13.2 6.4 9 4z"/><path d="M7.5 19v-3.5a1.5 1.5 0 0 1 3 0V19"/></svg><span class="absolute -end-2 -top-2 flex size-5 items-center justify-center rounded-full border border-border bg-accent font-serif text-[10px] font-bold text-primary">${KIND_LETTER[kind]}</span>`;
  if (onClick) {
    (pin as HTMLButtonElement).type = "button";
    pin.addEventListener("click", (e) => {
      e.stopPropagation();
      onClick();
    });
  }

  root.appendChild(pin);
  return root;
}
