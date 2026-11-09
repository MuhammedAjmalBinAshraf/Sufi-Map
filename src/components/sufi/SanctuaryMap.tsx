import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import type { Map as MapLibreMap, Marker } from "maplibre-gl";
import { MapPinOff } from "lucide-react";

import { useMapLibre } from "@/hooks/use-maplibre";
import { useI18n } from "@/lib/i18n";
import {
  BASEMAP_STYLES,
  type BasemapStyleId,
  createPinElement,
  createUserLocationElement,
  MAX_ZOOM,
  observeResize,
  overlayPadding,
} from "@/lib/maplibre";
import { KERALA_CENTER, type Site } from "@/lib/sites";

export interface SanctuaryMapHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  resetBearing: () => void;
  flyTo: (coords: [number, number], zoom?: number) => void;
}

export interface SanctuaryMapProps {
  sites: Site[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  /** Fires when the visitor starts / stops moving the map themselves (not on programmatic eases). */
  onExploreChange?: (exploring: boolean) => void;
  styleId?: BasemapStyleId;
  userLocation?: [number, number] | null;
}

export const SanctuaryMap = forwardRef<SanctuaryMapHandle, SanctuaryMapProps>(function SanctuaryMap(
  { sites, selectedId, onSelect, onExploreChange, styleId = "sahn-warm", userLocation },
  ref,
) {
  const { status, ml } = useMapLibre();
  const { t, pick } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef(new Map<string, Marker>());
  const userMarkerRef = useRef<Marker | null>(null);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;
  const onExploreRef = useRef(onExploreChange);
  onExploreRef.current = onExploreChange;

  useImperativeHandle(ref, () => ({
    zoomIn: () => mapRef.current?.zoomIn(),
    zoomOut: () => mapRef.current?.zoomOut(),
    resetBearing: () => mapRef.current?.resetNorthPitch({ duration: 500 }),
    flyTo: (coords: [number, number], zoom = 13) => {
      mapRef.current?.flyTo({ center: coords, zoom, duration: 1200, essential: true });
    },
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!ml || !container) return;
    const map = new ml.Map({
      container,
      style: BASEMAP_STYLES[styleId] as any,
      center: [KERALA_CENTER.lng, KERALA_CENTER.lat],
      zoom: window.matchMedia("(min-width: 768px)").matches ? 7 : 6.4,
      maxZoom: MAX_ZOOM,
      attributionControl: { compact: true },
    });
    map.setPadding(overlayPadding());
    mapRef.current = map;

    // Only gestures carry an originalEvent; a user move ends on the next moveend (inertia included).
    let exploring = false;
    map.on("movestart", (e) => {
      if (!e.originalEvent || exploring) return;
      exploring = true;
      onExploreRef.current?.(true);
    });
    map.on("moveend", () => {
      if (!exploring) return;
      exploring = false;
      onExploreRef.current?.(false);
    });
    const stopObserving = observeResize(map, container, () => map.setPadding(overlayPadding()));
    const markers = markersRef.current;
    return () => {
      stopObserving();
      markers.clear();
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
      map.remove();
      mapRef.current = null;
    };
  }, [ml]);

  // Handle dynamic basemap style change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !styleId) return;
    map.setStyle(BASEMAP_STYLES[styleId] as any);
  }, [styleId]);

  // User location marker
  useEffect(() => {
    const map = mapRef.current;
    if (!ml || !map) return;
    if (userLocation) {
      if (!userMarkerRef.current) {
        const el = createUserLocationElement();
        userMarkerRef.current = new ml.Marker({ element: el }).setLngLat(userLocation).addTo(map);
      } else {
        userMarkerRef.current.setLngLat(userLocation);
      }
    } else if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }
  }, [ml, userLocation]);

  // Reconcile pins whenever the map is ready or the visible sites / language change.
  useEffect(() => {
    const map = mapRef.current;
    if (!ml || !map) return;
    const markers = markersRef.current;
    for (const marker of markers.values()) marker.remove();
    markers.clear();
    for (const site of sites) {
      const el = createPinElement(site.kind, pick(site.name), () => onSelectRef.current(site.id));
      const marker = new ml.Marker({ element: el, anchor: "bottom" }).setLngLat([site.lng, site.lat]).addTo(map);
      markers.set(site.id, marker);
    }
  }, [ml, sites, pick]);

  useEffect(() => {
    for (const [id, marker] of markersRef.current) {
      const el = marker.getElement();
      el.dataset["selected"] = String(id === selectedId);
      el.style.zIndex = id === selectedId ? "10" : "";
    }
    const map = mapRef.current;
    const site = sites.find((s) => s.id === selectedId);
    if (map && site) map.easeTo({ center: [site.lng, site.lat], zoom: Math.max(map.getZoom(), 12), duration: 600 });
  }, [selectedId, sites, ml, pick]);

  if (status === "error") {
    return (
      <div className="courtyard-pattern flex h-full w-full items-center justify-center p-8">
        <div className="max-w-sm rounded-[14px] border bg-card/95 p-6 text-center shadow-float">
          <MapPinOff className="mx-auto size-6 text-primary" aria-hidden />
          <h2 className="mt-3 text-xl">{t("mapRestingTitle")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("mapError")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0">
      {status === "loading" && <div className="courtyard-pattern absolute inset-0 animate-pulse" />}
      {/* MapLibre forces position: relative on its container, so it fills this absolute wrapper. */}
      <div ref={containerRef} className="h-full w-full" aria-label={t("appName")} />
    </div>
  );
});
