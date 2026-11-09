import { useState } from "react";
import { Check, Compass, Crosshair, Layers, Loader2, MapPin, Minus, Navigation, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n, type I18nKey } from "@/lib/i18n";
import type { BasemapStyleId } from "@/lib/maplibre";
import { cn } from "@/lib/utils";

export interface MapControlsProps {
  currentStyle: BasemapStyleId;
  onStyleChange: (style: BasemapStyleId) => void;
  onLocateMe: () => void;
  isLocating?: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetBearing: () => void;
  onSelectRegion: (coords: [number, number], zoom: number) => void;
  nearestSite?: { name: string; distanceKm: number } | null;
  className?: string;
}

export function MapControls({
  currentStyle,
  onStyleChange,
  onLocateMe,
  isLocating = false,
  onZoomIn,
  onZoomOut,
  onResetBearing,
  onSelectRegion,
  nearestSite,
  className,
}: MapControlsProps) {
  const { t } = useI18n();
  const [layersOpen, setLayersOpen] = useState(false);
  const [regionsOpen, setRegionsOpen] = useState(false);

  const styles: { id: BasemapStyleId; nameKey: I18nKey; descKey: I18nKey }[] = [
    { id: "sahn-warm", nameKey: "layerWarm", descKey: "layerWarmDesc" },
    { id: "osm-standard", nameKey: "layerStreets", descKey: "layerStreetsDesc" },
    { id: "satellite", nameKey: "layerSatellite", descKey: "layerSatelliteDesc" },
    { id: "terrain", nameKey: "layerTerrain", descKey: "layerTerrainDesc" },
  ];

  const regions: { name: string; coords: [number, number]; zoom: number }[] = [
    { name: "Kerala (All)", coords: [75.9234, 11.0489], zoom: 7.2 },
    { name: "Tirurangadi & Mampuram", coords: [75.9234, 11.0489], zoom: 13.5 },
    { name: "Ponnani & Makhdum Zawiyas", coords: [75.9237, 10.7712], zoom: 13.5 },
    { name: "Kondotty Qubba", coords: [75.9621, 11.1465], zoom: 13.5 },
    { name: "Kozhikode & Kuttichira", coords: [75.7766, 11.2443], zoom: 13.5 },
  ];

  return (
    <aside
      aria-label={t("layers")}
      className={cn("pointer-events-none absolute end-4 top-20 z-20 flex flex-col items-end gap-2 md:top-5", className)}
    >
      {/* Nearest Sanctuary Pill (visible after locating) */}
      {nearestSite && (
        <div className="pointer-events-auto flex animate-in fade-in items-center gap-2 rounded-full border bg-card/95 px-3 py-1.5 shadow-float backdrop-blur text-xs">
          <Navigation className="size-3.5 text-primary rtl:-scale-x-100" aria-hidden />
          <span className="font-serif font-medium text-foreground">
            {t("nearestDistance", { name: nearestSite.name, dist: nearestSite.distanceKm.toFixed(1) })}
          </span>
          <Badge variant="secondary" className="h-4 rounded-full bg-primary/10 px-1.5 py-0 text-[10px] text-primary">
            {nearestSite.distanceKm.toFixed(1)} km
          </Badge>
        </div>
      )}

      {/* Main Map Control Floating Toolbar */}
      <div className="pointer-events-auto flex flex-col gap-1 rounded-[14px] border bg-card/95 p-1.5 shadow-float backdrop-blur">
        {/* Layer Switcher Trigger */}
        <div className="relative">
          <Button
            variant={layersOpen ? "default" : "ghost"}
            size="icon"
            onClick={() => {
              setLayersOpen(!layersOpen);
              setRegionsOpen(false);
            }}
            aria-label={t("layers")}
            title={t("layers")}
            className="size-9 rounded-[10px]"
          >
            <Layers className="size-4" aria-hidden />
          </Button>

          {/* Layer selection popover */}
          {layersOpen && (
            <div className="absolute top-0 end-11 w-56 animate-in fade-in zoom-in-95 rounded-[14px] border bg-card p-2 shadow-float flex flex-col gap-1">
              <span className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                {t("layers")}
              </span>
              {styles.map((s) => {
                const isSelected = currentStyle === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      onStyleChange(s.id);
                      setLayersOpen(false);
                    }}
                    className={cn(
                      "flex items-start justify-between rounded-[10px] px-2.5 py-2 text-start transition-colors",
                      isSelected
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-foreground hover:bg-accent",
                    )}
                  >
                    <div>
                      <div className="font-serif text-xs leading-tight">{t(s.nameKey)}</div>
                      <div className="mt-0.5 text-[10px] text-muted-foreground leading-none">{t(s.descKey)}</div>
                    </div>
                    {isSelected && <Check className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Regional Hubs Trigger */}
        <div className="relative">
          <Button
            variant={regionsOpen ? "default" : "ghost"}
            size="icon"
            onClick={() => {
              setRegionsOpen(!regionsOpen);
              setLayersOpen(false);
            }}
            aria-label="Regional Focus"
            title="Regional Focus"
            className="size-9 rounded-[10px]"
          >
            <MapPin className="size-4" aria-hidden />
          </Button>

          {/* Region presets popover */}
          {regionsOpen && (
            <div className="absolute top-0 end-11 w-52 animate-in fade-in zoom-in-95 rounded-[14px] border bg-card p-2 shadow-float flex flex-col gap-1">
              <span className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                Regional Hubs
              </span>
              {regions.map((r) => (
                <button
                  key={r.name}
                  type="button"
                  onClick={() => {
                    onSelectRegion(r.coords, r.zoom);
                    setRegionsOpen(false);
                  }}
                  className="rounded-[10px] px-2.5 py-1.5 text-start font-serif text-xs text-foreground transition-colors hover:bg-accent"
                >
                  {r.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Locate Me Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onLocateMe}
          disabled={isLocating}
          aria-label={t("locateMe")}
          title={t("locateMe")}
          className="size-9 rounded-[10px] text-muted-foreground hover:text-primary"
        >
          {isLocating ? (
            <Loader2 className="size-4 animate-spin text-primary" aria-hidden />
          ) : (
            <Crosshair className="size-4" aria-hidden />
          )}
        </Button>

        <div className="mx-auto my-0.5 h-px w-6 bg-border" />

        {/* Zoom In */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onZoomIn}
          aria-label="Zoom In"
          title="Zoom In"
          className="size-9 rounded-[10px] text-muted-foreground hover:text-foreground"
        >
          <Plus className="size-4" aria-hidden />
        </Button>

        {/* Zoom Out */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onZoomOut}
          aria-label="Zoom Out"
          title="Zoom Out"
          className="size-9 rounded-[10px] text-muted-foreground hover:text-foreground"
        >
          <Minus className="size-4" aria-hidden />
        </Button>

        {/* Reset Bearing */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onResetBearing}
          aria-label="Reset North"
          title="Reset Bearing"
          className="size-9 rounded-[10px] text-muted-foreground hover:text-primary"
        >
          <Compass className="size-4" aria-hidden />
        </Button>
      </div>
    </aside>
  );
}
