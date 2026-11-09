import { useEffect, useRef } from "react";
import { MapPinOff } from "lucide-react";

import { useGoogleMaps } from "@/hooks/use-google-maps";
import { pinIcon, SAHN_MAP_STYLES } from "@/lib/google-maps";
import { useI18n } from "@/lib/i18n";
import { KERALA_CENTER, type Site } from "@/lib/sites";

interface SanctuaryMapProps {
  sites: Site[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function SanctuaryMap({ sites, selectedId, onSelect }: SanctuaryMapProps) {
  const status = useGoogleMaps();
  const { t, pick } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef(new Map<string, google.maps.Marker>());
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    if (status !== "ready" || !containerRef.current || mapRef.current) return;
    mapRef.current = new google.maps.Map(containerRef.current, {
      center: KERALA_CENTER,
      zoom: 8,
      styles: SAHN_MAP_STYLES,
      clickableIcons: false,
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: "greedy",
    });
  }, [status]);

  // Reconcile markers whenever the map becomes ready or the visible sites change.
  useEffect(() => {
    const map = mapRef.current;
    if (status !== "ready" || !map) return;
    const markers = markersRef.current;
    const visible = new Set(sites.map((s) => s.id));

    for (const [id, marker] of markers) {
      if (!visible.has(id)) {
        google.maps.event.clearInstanceListeners(marker);
        marker.setMap(null);
        markers.delete(id);
      }
    }
    for (const site of sites) {
      const selected = site.id === selectedId;
      let marker = markers.get(site.id);
      if (!marker) {
        marker = new google.maps.Marker({ position: { lat: site.lat, lng: site.lng }, map });
        marker.addListener("click", () => onSelectRef.current(site.id));
        markers.set(site.id, marker);
      }
      marker.setIcon(pinIcon(site.kind, selected));
      marker.setTitle(pick(site.name));
      marker.setZIndex(selected ? 1000 : 1);
    }
  }, [status, sites, selectedId, pick]);

  useEffect(() => {
    const map = mapRef.current;
    const site = sites.find((s) => s.id === selectedId);
    if (!map || !site) return;
    map.panTo({ lat: site.lat, lng: site.lng });
    if ((map.getZoom() ?? 8) < 12) map.setZoom(12);
  }, [selectedId, sites, status]);

  if (status === "missing-key" || status === "error") {
    return (
      <div className="courtyard-pattern flex h-full w-full items-center justify-center p-8">
        <div className="max-w-sm rounded-[14px] border bg-card/95 p-6 text-center shadow-float">
          <MapPinOff className="mx-auto size-6 text-primary" aria-hidden />
          <h2 className="mt-3 text-xl">{t("mapRestingTitle")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {status === "error" ? t("mapError") : t("mapRestingBody")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {status === "loading" && <div className="courtyard-pattern absolute inset-0 animate-pulse" />}
      <div ref={containerRef} className="h-full w-full" aria-label={t("appName")} />
    </div>
  );
}
