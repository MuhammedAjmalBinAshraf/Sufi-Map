"use client";

import React, { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Database } from "@/types/database";

type Place = Database["public"]["Tables"]["places"]["Row"];

interface MapContainerProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  className?: string;
}

export default function MapContainer({
  places,
  selectedPlace,
  onSelectPlace,
  className = "",
}: MapContainerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [id: string]: maplibregl.Marker }>({});

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const tileUrl =
      process.env.NEXT_PUBLIC_MAP_TILE_URL ||
      "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

    // Initial center on West Malappuram, Kerala (approx Tirurangadi/Mampuram)
    const initialLng = selectedPlace ? selectedPlace.longitude : 75.9234;
    const initialLat = selectedPlace ? selectedPlace.latitude : 11.0489;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: [tileUrl],
            tileSize: 256,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: "osm-tiles",
            type: "raster",
            source: "osm",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [initialLng, initialLat],
      zoom: 11.5,
      attributionControl: false,
    });

    // Add minimal navigation control
    map.addControl(
      new maplibregl.NavigationControl({ showCompass: true, showZoom: true }),
      "top-right"
    );

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers when places change
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear previous markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    places.forEach((place) => {
      // Create sanctuary styled pin element
      const el = document.createElement("div");
      el.className = "sufi-pin-marker cursor-pointer group";

      const isSelected = selectedPlace?.id === place.id;

      el.innerHTML = `
        <div class="relative flex flex-col items-center">
          <div class="w-9 h-9 rounded-full ${
            isSelected
              ? "bg-[#1F5C3A] ring-4 ring-[#1F5C3A]/30 scale-110"
              : "bg-[#1F5C3A] hover:scale-105"
          } text-white shadow-lg flex items-center justify-center border-2 border-white transition-all duration-200">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div class="w-2.5 h-2.5 bg-[#1F5C3A] rotate-45 -mt-1 rounded-xs"></div>
          <div class="mt-1 px-2 py-0.5 bg-white/95 backdrop-blur-sm rounded-full shadow-sm border border-[#E4E2D8] text-[10px] font-medium text-[#121512] whitespace-nowrap opacity-90 group-hover:opacity-100">
            ${place.name_en}
          </div>
        </div>
      `;

      el.addEventListener("click", () => {
        onSelectPlace(place);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([place.longitude, place.latitude])
        .addTo(map);

      markersRef.current[place.id] = marker;
    });
  }, [places, selectedPlace, onSelectPlace]);

  // Fly to selected place when selection changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedPlace) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      map.setCenter([selectedPlace.longitude, selectedPlace.latitude]);
    } else {
      map.flyTo({
        center: [selectedPlace.longitude, selectedPlace.latitude],
        zoom: 13,
        speed: 1.2,
        curve: 1.4,
        essential: true,
      });
    }
  }, [selectedPlace]);

  return (
    <div className={`relative w-full h-full bg-[#EEF0E6] ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
