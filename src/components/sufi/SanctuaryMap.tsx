import { useEffect, useRef } from "react";
import type { Map as MapLibreMap, Marker } from "maplibre-gl";
import { MapPinOff } from "lucide-react";

import { useMapLibre } from "@/hooks/use-maplibre";
import { useI18n } from "@/lib/i18n";
import { BASEMAP_STYLE, createPinElement, MAX_ZOOM, observeResize, overlayPadding } from "@/lib/maplibre";
import { KERALA_CENTER, type Site } from "@/lib/sites";

interface SanctuaryMapProps {
  sites: Site[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function SanctuaryMap({ sites, selectedId, onSelect }: SanctuaryMapProps) {
  const { status, ml } = useMapLibre();
  const { t, pick } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef(new Map<string, Marker>());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    const container = containerRef.current;
    if (!ml || !container) return;
    const map = new ml.Map({
      container,
      style: BASEMAP_STYLE,
      center: [KERALA_CENTER.lng, KERALA_CENTER.lat],
      zoom: window.matchMedia("(min-width: 768px)").matches ? 7 : 6.4,
      maxZoom: MAX_ZOOM,
      attributionControl: { compact: true },
    });
    map.addControl(new ml.NavigationControl({ showCompass: false }), "bottom-right");
    map.setPadding(overlayPadding());
    mapRef.current = map;
    const stopObserving = observeResize(map, container, () => map.setPadding(overlayPadding()));
    const markers = markersRef.current;
    return () => {
      stopObserving();
      markers.clear();
      map.remove();
      mapRef.current = null;
    };
  }, [ml]);

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
}
