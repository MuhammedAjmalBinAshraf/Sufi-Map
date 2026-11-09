import type * as MapLibre from "maplibre-gl";

import type { SiteKind } from "./sites";

export type MapLibreModule = typeof MapLibre;

export type BasemapStyleId = "sahn-warm" | "osm-standard" | "satellite" | "terrain";

export const BASEMAP_STYLE =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json?key=cb1_551n_1_dee07681fafb4f6811bd2bbc";

export const BASEMAP_STYLES: Record<BasemapStyleId, string | object> = {
  "sahn-warm": BASEMAP_STYLE,
  "osm-standard": {
    version: 8,
    sources: {
      "osm-tiles": {
        type: "raster",
        tiles: [
          "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
          "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
          "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
        attribution: "&copy; OpenStreetMap contributors",
      },
    },
    layers: [{ id: "osm-layer", type: "raster", source: "osm-tiles", minzoom: 0, maxzoom: 19 }],
  },
  satellite: {
    version: 8,
    sources: {
      "satellite-tiles": {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        attribution: "&copy; Esri World Imagery",
      },
    },
    layers: [{ id: "satellite-layer", type: "raster", source: "satellite-tiles", minzoom: 0, maxzoom: 19 }],
  },
  terrain: {
    version: 8,
    sources: {
      "topo-tiles": {
        type: "raster",
        tiles: [
          "https://a.tile.opentopomap.org/{z}/{x}/{y}.png",
          "https://b.tile.opentopomap.org/{z}/{x}/{y}.png",
          "https://c.tile.opentopomap.org/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
        attribution: "Map style: &copy; OpenTopoMap (CC-BY-SA)",
      },
    },
    layers: [{ id: "topo-layer", type: "raster", source: "topo-tiles", minzoom: 0, maxzoom: 17 }],
  },
};

/** Calculate Haversine distance in km between two GPS coordinates */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/** Pulsing emerald/blue location marker for the visitor. */
export function createUserLocationElement() {
  const root = document.createElement("div");
  root.className = "relative flex size-6 items-center justify-center";
  root.innerHTML = `
    <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/40 opacity-75"></span>
    <span class="relative inline-flex size-3.5 rounded-full border-2 border-card bg-primary shadow-md"></span>
  `;
  return root;
}

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
export function observeResize(map: MapLibre.Map, container: HTMLElement, onResize?: () => void) {
  const observer = new ResizeObserver(() => {
    map.resize();
    onResize?.();
  });
  observer.observe(container);
  return () => observer.disconnect();
}

/** Keeps pins clear of the floating quote and the mobile bottom sheet. */
export function overlayPadding(): MapLibre.PaddingOptions {
  const desktop = window.matchMedia("(min-width: 768px)").matches;
  return desktop
    ? { top: 200, bottom: 32, left: 32, right: 32 }
    : { top: 250, bottom: Math.round(window.innerHeight * 0.42) + 16, left: 24, right: 24 };
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
