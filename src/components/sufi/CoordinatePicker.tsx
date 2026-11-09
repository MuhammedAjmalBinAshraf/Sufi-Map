import { useEffect, useRef, useState } from "react";
import { LocateFixed } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGoogleMaps } from "@/hooks/use-google-maps";
import { pinIcon, SAHN_MAP_STYLES } from "@/lib/google-maps";
import { useI18n } from "@/lib/i18n";
import { KERALA_CENTER, type SiteKind } from "@/lib/sites";

interface CoordinatePickerProps {
  lat: number | undefined;
  lng: number | undefined;
  kind: SiteKind | undefined;
  onChange: (lat: number | undefined, lng: number | undefined) => void;
}

const round = (n: number) => Math.round(n * 1e5) / 1e5;

export function CoordinatePicker({ lat, lng, kind, onChange }: CoordinatePickerProps) {
  const status = useGoogleMaps();
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (status !== "ready" || !containerRef.current || mapRef.current) return;
    const map = new google.maps.Map(containerRef.current, {
      center: lat !== undefined && lng !== undefined ? { lat, lng } : KERALA_CENTER,
      zoom: lat !== undefined ? 13 : 7,
      styles: SAHN_MAP_STYLES,
      clickableIcons: false,
      disableDefaultUI: true,
      zoomControl: true,
      gestureHandling: "greedy",
    });
    map.addListener("click", (e: google.maps.MapMouseEvent) => {
      if (e.latLng) onChangeRef.current(round(e.latLng.lat()), round(e.latLng.lng()));
    });
    mapRef.current = map;
    // Initial center only; later updates move the marker instead.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  useEffect(() => {
    const map = mapRef.current;
    if (status !== "ready" || !map) return;
    if (lat === undefined || lng === undefined) {
      markerRef.current?.setMap(null);
      return;
    }
    if (!markerRef.current) {
      const marker = new google.maps.Marker({ map, draggable: true, position: { lat, lng } });
      marker.addListener("dragend", (e: google.maps.MapMouseEvent) => {
        if (e.latLng) onChangeRef.current(round(e.latLng.lat()), round(e.latLng.lng()));
      });
      markerRef.current = marker;
    }
    markerRef.current.setMap(map);
    markerRef.current.setPosition({ lat, lng });
    markerRef.current.setIcon(pinIcon(kind ?? "maqam", false));
  }, [status, lat, lng, kind]);

  const locate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const next = { lat: round(pos.coords.latitude), lng: round(pos.coords.longitude) };
        onChange(next.lat, next.lng);
        mapRef.current?.panTo(next);
        mapRef.current?.setZoom(14);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const hasMap = status === "ready" || status === "loading";

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">{hasMap ? t("pickHint") : t("pickHintNoMap")}</p>
      {hasMap && (
        <div className="courtyard-pattern h-56 overflow-hidden rounded-[14px] border">
          <div ref={containerRef} className="h-full w-full" />
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
