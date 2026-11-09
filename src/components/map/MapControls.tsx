"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Layers,
  Crosshair,
  Compass,
  Plus,
  Minus,
  MapPin,
  Check,
  Navigation,
} from "lucide-react";

export type BasemapStyle = "sahn-warm" | "osm-standard" | "satellite" | "terrain";

export interface MapControlsProps {
  currentStyle: BasemapStyle;
  onStyleChange: (style: BasemapStyle) => void;
  onLocateUser: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetBearing: () => void;
  onSelectRegion: (center: [number, number], zoom: number) => void;
  nearestPlaceName?: string | null;
  nearestDistanceKm?: number | null;
}

export function MapControls({
  currentStyle,
  onStyleChange,
  onLocateUser,
  onZoomIn,
  onZoomOut,
  onResetBearing,
  onSelectRegion,
  nearestPlaceName,
  nearestDistanceKm,
}: MapControlsProps) {
  const [layersOpen, setLayersOpen] = useState(false);
  const [regionsOpen, setRegionsOpen] = useState(false);

  const styles: { id: BasemapStyle; name: string; desc: string }[] = [
    {
      id: "sahn-warm",
      name: "Sahn Warm (Sanctuary)",
      desc: "Tranquil stone courtyard aesthetic",
    },
    {
      id: "osm-standard",
      name: "OpenStreetMap",
      desc: "Detailed standard street tiles",
    },
    {
      id: "satellite",
      name: "Satellite Imagery",
      desc: "High-resolution satellite hybrid",
    },
    {
      id: "terrain",
      name: "Topographic / Terrain",
      desc: "Sacred hills and rivers of Malabar",
    },
  ];

  const regions: { name: string; coords: [number, number]; zoom: number }[] = [
    { name: "West Malappuram (All)", coords: [75.9234, 11.0489], zoom: 10.5 },
    { name: "Tirurangadi & Mampuram", coords: [75.9234, 11.0489], zoom: 13.5 },
    { name: "Ponnani & Makhdum Zawiyas", coords: [75.9237, 10.7712], zoom: 13.5 },
    { name: "Kondotty Qubba Sanctuary", coords: [75.9621, 11.1465], zoom: 13.5 },
  ];

  return (
    <aside aria-label="Map Controls" className="absolute top-4 right-4 z-30 flex flex-col items-end gap-2 pointer-events-auto">
      {/* Nearest Sanctuary Beacon (if located) */}
      {nearestPlaceName && nearestDistanceKm != null && (
        <div className="bg-white/95 backdrop-blur-md border border-border px-3 py-1.5 rounded-full shadow-md text-xs flex items-center gap-2 animate-in fade-in">
          <Navigation className="w-3.5 h-3.5 text-primary" />
          <span className="font-serif font-medium text-foreground">
            Nearest: {nearestPlaceName}
          </span>
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary text-[10px] px-1.5 py-0 h-4 rounded-full"
          >
            {nearestDistanceKm.toFixed(1)} km
          </Badge>
        </div>
      )}

      {/* Main Controls Floating Column */}
      <div className="flex flex-col gap-1.5 bg-white/95 backdrop-blur-md border border-border p-1.5 rounded-[14px] shadow-md">
        {/* Layers / Basemap Trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setLayersOpen(!layersOpen);
              setRegionsOpen(false);
            }}
            aria-label="Basemap layers setup"
            title="Map Style Layers"
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              layersOpen
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-sahn-bg"
            }`}
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Basemap Selection Flyout */}
          {layersOpen && (
            <div className="absolute top-0 right-11 w-56 bg-white border border-border rounded-[14px] shadow-xl p-2 flex flex-col gap-1 animate-in fade-in zoom-in-95">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-2 py-1">
                Sanctuary Tile Setup
              </span>
              {styles.map((s) => {
                const isSelected = currentStyle === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      onStyleChange(s.id);
                      setLayersOpen(false);
                    }}
                    className={`flex items-start justify-between px-2.5 py-2 rounded-lg text-left transition-colors ${
                      isSelected
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-sahn-bg text-foreground"
                    }`}
                  >
                    <div>
                      <div className="text-xs font-serif leading-tight">
                        {s.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5 leading-none">
                        {s.desc}
                      </div>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Regional Focus Presets Trigger */}
        <div className="relative">
          <button
            onClick={() => {
              setRegionsOpen(!regionsOpen);
              setLayersOpen(false);
            }}
            aria-label="Regional focus presets"
            title="Regional Focus"
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              regionsOpen
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-sahn-bg"
            }`}
          >
            <MapPin className="w-4 h-4" />
          </button>

          {/* Region presets popover */}
          {regionsOpen && (
            <div className="absolute top-0 right-11 w-52 bg-white border border-border rounded-[14px] shadow-xl p-2 flex flex-col gap-1 animate-in fade-in zoom-in-95">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground px-2 py-1">
                Regional Hubs
              </span>
              {regions.map((r) => (
                <button
                  key={r.name}
                  onClick={() => {
                    onSelectRegion(r.coords, r.zoom);
                    setRegionsOpen(false);
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-serif text-foreground hover:bg-sahn-bg text-left transition-colors"
                >
                  {r.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Geolocation Button ("Locate Me") */}
        <button
          onClick={onLocateUser}
          aria-label="Find my location"
          title="Locate nearest sanctuary"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-sahn-bg transition-colors"
        >
          <Crosshair className="w-4 h-4" />
        </button>

        <div className="w-6 h-px bg-border/80 mx-auto my-0.5" />

        {/* Zoom In */}
        <button
          onClick={onZoomIn}
          aria-label="Zoom In"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sahn-bg transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>

        {/* Zoom Out */}
        <button
          onClick={onZoomOut}
          aria-label="Zoom Out"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sahn-bg transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>

        {/* Reset North Compass */}
        <button
          onClick={onResetBearing}
          aria-label="Reset North"
          title="Reset Bearing"
          className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-sahn-bg transition-colors"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
