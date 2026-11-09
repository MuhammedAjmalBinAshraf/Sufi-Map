import type { SiteKind } from "./sites";

declare global {
  interface Window {
    __sufiMapInit?: () => void;
  }
}

export function getBrowserKey(): string | undefined {
  return import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"] as string | undefined;
}

let loader: Promise<typeof google.maps> | null = null;

/** Loads Maps JavaScript once, asynchronously. Call only from effects. */
export function loadGoogleMaps(language: string): Promise<typeof google.maps> {
  const key = getBrowserKey();
  if (!key) return Promise.reject(new Error("missing-key"));
  if (window.google?.maps?.Map) return Promise.resolve(window.google.maps);
  if (loader) return loader;

  loader = new Promise((resolve, reject) => {
    window.__sufiMapInit = () => resolve(window.google.maps);
    const channel = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID"] as string | undefined;
    const params = new URLSearchParams({
      key,
      loading: "async",
      callback: "__sufiMapInit",
      language,
      region: "IN",
    });
    if (channel) params.set("channel", channel);
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.async = true;
    script.onerror = () => {
      loader = null;
      reject(new Error("load-failed"));
    };
    document.head.appendChild(script);
  });
  return loader;
}

/*
 * Map imagery is rendered by Google, outside our stylesheet, so the Sahn tokens
 * are mirrored here as hex. Keep these in sync with src/styles.css.
 */
const SAHN = {
  canvas: "#FAF9F4",
  surface: "#FFFFFF",
  parchment: "#F4F3EB",
  border: "#E4E2D8",
  ink: "#121512",
  muted: "#5D675F",
  green: "#1F5C3A",
  water: "#DCE6DF",
  park: "#E8EEDF",
};

export const SAHN_MAP_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: SAHN.canvas }] },
  { elementType: "labels.text.fill", stylers: [{ color: SAHN.muted }] },
  { elementType: "labels.text.stroke", stylers: [{ color: SAHN.canvas }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ visibility: "on" }, { color: SAHN.park }] },
  { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: SAHN.parchment }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: SAHN.surface }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: SAHN.border }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: SAHN.border }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: SAHN.border }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: SAHN.ink }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: SAHN.water }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: SAHN.muted }] },
];

const KIND_LETTER: Record<SiteKind, string> = { maqam: "M", zawiya: "Z", dargah: "D", gathering: "G" };

/** 40px rounded emerald pin with a parchment kind badge in its corner. */
export function pinIcon(kind: SiteKind, selected: boolean): google.maps.Icon {
  const fill = selected ? SAHN.ink : SAHN.green;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="58" viewBox="0 0 52 58">
  <defs><filter id="s" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="${SAHN.ink}" flood-opacity="0.18"/></filter></defs>
  <g filter="url(#s)">
    <rect x="4" y="8" width="40" height="40" rx="14" fill="${fill}" stroke="${SAHN.surface}" stroke-width="2"/>
    <path d="M20 48 L24 54 L28 48 Z" fill="${fill}"/>
    <path d="M24 17c-4.5 2.6-7 6-7 9.5V37h14V26.5c0-3.5-2.5-6.9-7-9.5z M22.5 37v-4.5a1.5 1.5 0 0 1 3 0V37" fill="none" stroke="${SAHN.surface}" stroke-width="1.8" stroke-linejoin="round"/>
    <line x1="24" y1="13" x2="24" y2="17" stroke="${SAHN.surface}" stroke-width="1.8" stroke-linecap="round"/>
  </g>
  <circle cx="42" cy="10" r="9" fill="${SAHN.parchment}" stroke="${SAHN.border}" stroke-width="1.5"/>
  <text x="42" y="14" text-anchor="middle" font-family="Georgia, serif" font-size="11" font-weight="700" fill="${SAHN.green}">${KIND_LETTER[kind]}</text>
</svg>`;
  const scale = selected ? 1.12 : 1;
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(52 * scale, 58 * scale),
    anchor: new google.maps.Point(24 * scale, 54 * scale),
  };
}
