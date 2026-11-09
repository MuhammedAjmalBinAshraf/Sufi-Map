"use client";

import React, { useState, useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Check, Crosshair } from "lucide-react";
import { getEffectiveTileUrl } from "./MapContainer";

interface CoordinatePickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialLat?: number;
  initialLng?: number;
  onSelectCoordinates: (lat: number, lng: number) => void;
}

export function CoordinatePickerModal({
  open,
  onOpenChange,
  initialLat = 11.0489,
  initialLng = 75.9234,
  onSelectCoordinates,
}: CoordinatePickerModalProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  const [pickedLat, setPickedLat] = useState<number>(initialLat);
  const [pickedLng, setPickedLng] = useState<number>(initialLng);

  useEffect(() => {
    if (!open) {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      return;
    }

    const timer = setTimeout(() => {
      if (!mapContainerRef.current) return;

      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            "picker-osm": {
              type: "raster",
              tiles: [getEffectiveTileUrl("sahn-warm")],
              tileSize: 256,
              attribution: "&copy; OpenStreetMap & CartoDB",
            },
          },
          layers: [
            {
              id: "picker-layer",
              type: "raster",
              source: "picker-osm",
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: [initialLng, initialLat],
        zoom: 12,
        attributionControl: false,
      });

      // Draggable marker element
      const el = document.createElement("div");
      el.className = "w-8 h-8 rounded-full bg-[#1F5C3A] text-white flex items-center justify-center border-2 border-white shadow-xl cursor-grab";
      el.innerHTML = `
        <svg class="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
          <circle cx="12" cy="10" r="3"/>
        </svg>
      `;

      const marker = new maplibregl.Marker({
        element: el,
        draggable: true,
      })
        .setLngLat([initialLng, initialLat])
        .addTo(map);

      marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        setPickedLat(Number(lngLat.lat.toFixed(5)));
        setPickedLng(Number(lngLat.lng.toFixed(5)));
      });

      map.on("click", (e) => {
        marker.setLngLat(e.lngLat);
        setPickedLat(Number(e.lngLat.lat.toFixed(5)));
        setPickedLng(Number(e.lngLat.lng.toFixed(5)));
      });

      markerRef.current = marker;
      mapRef.current = map;

      map.on("load", () => {
        map.resize();
      });
    }, 150);

    return () => {
      clearTimeout(timer);
    };
  }, [open, initialLat, initialLng]);

  const handleConfirm = () => {
    onSelectCoordinates(pickedLat, pickedLng);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-[14px] bg-white border-border shadow-2xl p-4">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <MapPin className="w-4 h-4" />
            </div>
            <DialogTitle className="font-serif text-base font-semibold text-foreground">
              Select Sanctuary Coordinates
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Click anywhere on the map or drag the sanctuary pin to pick precise coordinates.
          </DialogDescription>
        </DialogHeader>

        {/* Map Picker Area */}
        <div className="relative w-full h-[320px] rounded-[12px] overflow-hidden border border-border my-2 bg-sahn-map">
          <div ref={mapContainerRef} className="w-full h-full" />
          <div className="absolute top-2 left-2 z-10 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-mono text-foreground border border-border shadow-xs">
            {pickedLat}° N, {pickedLng}° E
          </div>
        </div>

        {/* Confirm Action */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-muted-foreground font-mono">
            West Malappuram, Kerala
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-9 text-xs rounded-[10px]"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirm}
              className="h-9 text-xs rounded-[10px] bg-primary text-primary-foreground flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Use Coordinates</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
