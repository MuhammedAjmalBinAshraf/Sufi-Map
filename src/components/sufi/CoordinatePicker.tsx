import { useEffect, useRef, useState } from "react";
import type { Map as MapLibreMap, Marker } from "maplibre-gl";
import { LocateFixed } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMapLibre } from "@/hooks/use-maplibre";
import { useI18n } from "@/lib/i18n";
import { BASEMAP_STYLE, createPinElement, MAX_ZOOM, observeResize } from "@/lib/maplibre";
import { KERALA_CENTER, type SiteKind } from "@/lib/sites";

interface CoordinatePickerProps {
  lat: number | undefined;
  lng: number | undefined;
  kind: SiteKind | undefined;
  onChange: (lat: number | undefined, lng: number | undefined) => void;
}

const round = (n: number) => Math.round(n * 1e5) / 1e5;

export function CoordinatePicker({ lat, lng, kind, onChange }: CoordinatePickerProps) {
  const { status, ml } = useMapLibre();
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markerRef = useRef<{ marker: Marker; kind: SiteKind } | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!ml || !container) return;
    const hasPoint = lat !== undefined && lng !== undefined;
    const map = new ml.Map({
      container,
      style: BASEMAP_STYLE,
      center: hasPoint ? [lng, lat] : [KERALA_CENTER.lng, KERALA_CENTER.lat],
      zoom: hasPoint ? 13 : 6.5,
      maxZoom: MAX_ZOOM,
      attributionControl: { compact: true },
    });
    map.addControl(new ml.NavigationControl({ showCompass: false }), "bottom-right");
    map.on("click", (e) => onChangeRef.current(round(e.lngLat.lat), round(e.lngLat.lng)));
    mapRef.current = map;
    const stopObserving = observeResize(map, container);
    return () => {
      stopObserving();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // Initial view only; later coordinate changes move the pin instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ml]);

  // Draggable pin follows the coordinates; it is rebuilt when the category changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!ml || !map) return;
    const pinKind = kind ?? "maqam";
    if (lat === undefined || lng === undefined) {
      markerRef.current?.marker.remove();
      markerRef.current = null;
      return;
    }
    if (markerRef.current && markerRef.current.kind !== pinKind) {
      markerRef.current.marker.remove();
      markerRef.current = null;
    }
    if (!markerRef.current) {
      const marker = new ml.Marker({ element: createPinElement(pinKind, t("pickHint")), anchor: "bottom", draggable: true })
        .setLngLat([lng, lat])
        .addTo(map);
      marker.on("dragend", () => {
        const p = marker.getLngLat();
        onChangeRef.current(round(p.lat), round(p.lng));
      });
      markerRef.current = { marker, kind: pinKind };
    }
    markerRef.current.marker.setLngLat([lng, lat]);
  }, [ml, lat, lng, kind, t]);

  const locate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const next = { lat: round(pos.coords.latitude), lng: round(pos.coords.longitude) };
        onChange(next.lat, next.lng);
        mapRef.current?.easeTo({ center: [next.lng, next.lat], zoom: 14 });
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const hasMap = status !== "error";

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{hasMap ? t("pickHint") : t("pickHintNoMap")}</p>
      {hasMap && (
        <div className="courtyard-pattern relative h-56 overflow-hidden rounded-[14px] border">
          <div className="absolute inset-0">
            <div ref={containerRef} className="h-full w-full" />
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 gap-3">
        <CoordInput id="lat" label={t("latitude")} value={lat} placeholder="11.0457" onChange={(v) => onChange(v, lng)} />
        <CoordInput id="lng" label={t("longitude")} value={lng} placeholder="75.9262" onChange={(v) => onChange(lat, v)} />
      </div>
      <Button type="button" variant="outline" size="sm" onClick={locate} disabled={locating}>
        <LocateFixed aria-hidden />
        {locating ? t("locating") : t("useMyLocation")}
      </Button>
    </div>
  );
}

/** Keeps the typed text (e.g. "11.") while reporting a parsed number upward. */
function CoordInput({
  id,
  label,
  value,
  placeholder,
  onChange,
}: {
  id: string;
  label: string;
  value: number | undefined;
  placeholder: string;
  onChange: (v: number | undefined) => void;
}) {
  const [text, setText] = useState(value === undefined ? "" : String(value));

  useEffect(() => {
    setText((current) => (Number(current) === value && current !== "" ? current : value === undefined ? "" : String(value)));
  }, [value]);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        inputMode="decimal"
        dir="ltr"
        value={text}
        onChange={(e) => {
          const next = e.target.value;
          setText(next);
          const n = Number(next);
          onChange(next.trim() === "" || Number.isNaN(n) ? undefined : n);
        }}
        placeholder={placeholder}
        className="bg-card"
      />
    </div>
  );
}
