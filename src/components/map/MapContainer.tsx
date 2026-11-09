"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Database } from "@/types/database";
import { BasemapStyle } from "./MapControls";

type Place = Database["public"]["Tables"]["places"]["Row"];

export interface MapContainerHandle {
  zoomIn: () => void;
  zoomOut: () => void;
  resetBearing: () => void;
  flyTo: (coords: [number, number], zoom?: number) => void;
  setUserLocation: (coords: [number, number]) => void;
}

interface MapContainerProps {
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  basemapStyle?: BasemapStyle;
  onMapClick?: (coords: [number, number]) => void;
  interactivePinPlacement?: boolean;
  className?: string;
}

const TILE_URLS: Record<BasemapStyle, string> = {
  "sahn-warm": "https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  "osm-standard": "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  satellite: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  terrain: "https://tile.opentopomap.org/{z}/{x}/{y}.png",
};

export function getEffectiveTileUrl(style: BasemapStyle): string {
  const apiKey = process.env.NEXT_PUBLIC_MAP_API_KEY;
  if (style === "sahn-warm" && process.env.NEXT_PUBLIC_MAP_TILE_URL) {
    let custom = process.env.NEXT_PUBLIC_MAP_TILE_URL;
    if (apiKey && custom.includes("{key}")) {
      custom = custom.replace("{key}", apiKey);
    }
    return custom;
  }
  let url = TILE_URLS[style] || TILE_URLS["sahn-warm"];
  if (apiKey && style === "sahn-warm") {
    if (url.includes("{key}")) {
      url = url.replace("{key}", apiKey);
    } else if (url.includes("cartocdn.com") && !url.includes("api_key=")) {
      url = `${url}?api_key=${apiKey}`;
    }
  }
  return url;
}

const MapContainer = forwardRef<MapContainerHandle, MapContainerProps>(function MapContainer(
  {
    places,
    selectedPlace,
    onSelectPlace,
    basemapStyle = "sahn-warm",
    onMapClick,
    interactivePinPlacement = false,
    className = "",
  },
  ref
) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<{ [id: string]: maplibregl.Marker }>({});
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);
  const currentStyleRef = useRef<BasemapStyle>(basemapStyle);

  // Expose imperative map controls
  useImperativeHandle(ref, () => ({
    zoomIn: () => {
      mapRef.current?.zoomIn();
    },
    zoomOut: () => {
      mapRef.current?.zoomOut();
    },
    resetBearing: () => {
      mapRef.current?.resetNorthPitch({ duration: 600 });
    },
    flyTo: (coords: [number, number], zoom = 13.5) => {
      mapRef.current?.flyTo({
        center: coords,
        zoom,
        speed: 1.2,
        curve: 1.4,
        essential: true,
      });
    },
    setUserLocation: (coords: [number, number]) => {
      const map = mapRef.current;
      if (!map) return;

      if (!userMarkerRef.current) {
        const el = document.createElement("div");
        el.className = "w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center animate-pulse";
        const inner = document.createElement("div");
        inner.className = "w-2.5 h-2.5 rounded-full bg-white";
        el.appendChild(inner);

        userMarkerRef.current = new maplibregl.Marker({ element: el })
          .setLngLat(coords)
          .addTo(map);
      } else {
        userMarkerRef.current.setLngLat(coords);
      }

      map.flyTo({
        center: coords,
        zoom: 13,
        speed: 1.2,
        essential: true,
      });
    },
  }));

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initialLng = selectedPlace ? selectedPlace.longitude : 75.9234;
    const initialLat = selectedPlace ? selectedPlace.latitude : 11.0489;
    let customStyleUrl = process.env.NEXT_PUBLIC_MAP_STYLE_URL;
    const apiKey = process.env.NEXT_PUBLIC_MAP_API_KEY;
    if (customStyleUrl && apiKey && customStyleUrl.includes("{key}")) {
      customStyleUrl = customStyleUrl.replace("{key}", apiKey);
    }
    const tileUrl = getEffectiveTileUrl(basemapStyle);

    const defaultRasterStyle: maplibregl.StyleSpecification = {
      version: 8,
      sources: {
        "sufi-basemap": {
          type: "raster",
          tiles: [tileUrl],
          tileSize: 256,
          attribution: "&copy; OpenStreetMap & CartoDB",
        },
      },
      layers: [
        {
          id: "sufi-basemap-layer",
          type: "raster",
          source: "sufi-basemap",
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    };

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: customStyleUrl || defaultRasterStyle,
      center: [initialLng, initialLat],
      zoom: 11.5,
      attributionControl: false,
    });

    // Ensure map resizes to container width/height immediately after mount
    map.on("load", () => {
      map.resize();
    });

    const resizeTimer = setTimeout(() => {
      map.resize();
    }, 250);

    // Click handler for coordinate picking or deselection
    map.on("click", (e) => {
      if (onMapClick) {
        onMapClick([e.lngLat.lng, e.lngLat.lat]);
      }
    });

    mapRef.current = map;

    // Attach ResizeObserver to keep canvas sized accurately
    const ro = new ResizeObserver(() => {
      map.resize();
    });
    ro.observe(mapContainerRef.current);

    return () => {
      clearTimeout(resizeTimer);
      ro.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update Basemap Layer when basemapStyle prop changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || currentStyleRef.current === basemapStyle) return;

    currentStyleRef.current = basemapStyle;
    const tileUrl = getEffectiveTileUrl(basemapStyle);
    if (!tileUrl) return;

    const source = map.getSource("sufi-basemap") as maplibregl.RasterTileSource;
    if (source && source.setTiles) {
      source.setTiles([tileUrl]);
    } else {
      // Re-create raster source and layer if dynamic tile update is not supported
      if (map.getLayer("sufi-basemap-layer")) {
        map.removeLayer("sufi-basemap-layer");
      }
      if (map.getSource("sufi-basemap")) {
        map.removeSource("sufi-basemap");
      }
      map.addSource("sufi-basemap", {
        type: "raster",
        tiles: [tileUrl],
        tileSize: 256,
      });
      map.addLayer(
        {
          id: "sufi-basemap-layer",
          type: "raster",
          source: "sufi-basemap",
          minzoom: 0,
          maxzoom: 19,
        },
        undefined
      );
    }
  }, [basemapStyle]);

  // Update Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    places.forEach((place) => {
      const el = document.createElement("div");
      el.className = "sufi-pin-marker group";

      const isSelected = selectedPlace?.id === place.id;

      el.innerHTML = `
        <div class="relative flex flex-col items-center">
          <div class="w-10 h-10 rounded-full ${
            isSelected
              ? "bg-[#1F5C3A] ring-4 ring-[#1F5C3A]/30 scale-110 shadow-xl"
              : "bg-[#1F5C3A] hover:scale-105 shadow-md"
          } text-white flex items-center justify-center border-2 border-white transition-all duration-200">
            <svg class="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div class="w-2.5 h-2.5 bg-[#1F5C3A] rotate-45 -mt-1.5 rounded-xs"></div>
          <div class="mt-1 px-2.5 py-0.5 bg-white/95 backdrop-blur-sm rounded-full shadow-xs border border-[#E4E2D8] text-[11px] font-medium text-[#121512] whitespace-nowrap opacity-90 group-hover:opacity-100 font-serif">
            ${place.name_en}
          </div>
        </div>
      `;

      el.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectPlace(place);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([place.longitude, place.latitude])
        .addTo(map);

      markersRef.current[place.id] = marker;
    });
  }, [places, selectedPlace, onSelectPlace]);

  // Fly to selected place
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
        zoom: 13.5,
        speed: 1.2,
        essential: true,
      });
    }
  }, [selectedPlace]);

  return (
    <div className={`relative w-full h-full min-h-[420px] bg-[#EEF0E6] overflow-hidden ${className}`}>
      <div
        ref={mapContainerRef}
        className="w-full h-full absolute inset-0 min-h-[420px]"
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
});

export default MapContainer;
