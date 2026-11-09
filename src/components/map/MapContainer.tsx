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
  onExploreChange?: (exploring: boolean) => void;
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
    } else if (url.includes("cartocdn.com") && !url.includes("key=")) {
      url = `${url}?key=${apiKey}`;
    }
  }
  return url;
}

export function getMapStyle(style: BasemapStyle): string | maplibregl.StyleSpecification {
  const apiKey = process.env.NEXT_PUBLIC_MAP_API_KEY;
  const customStyleUrl = process.env.NEXT_PUBLIC_MAP_STYLE_URL;

  if (style === "sahn-warm") {
    if (customStyleUrl) {
      return apiKey && customStyleUrl.includes("{key}")
        ? customStyleUrl.replace("{key}", apiKey)
        : customStyleUrl;
    }
    // High-resolution vector style with Carto API key
    if (apiKey) {
      return `https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json?key=${apiKey}`;
    }
    // Fallback Carto raster tiles with maxzoom constraint
    return {
      version: 8,
      sources: {
        "sufi-basemap": {
          type: "raster",
          tiles: ["https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"],
          tileSize: 256,
          maxzoom: 19,
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
  }

  if (style === "osm-standard") {
    return {
      version: 8,
      sources: {
        "sufi-basemap": {
          type: "raster",
          tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
          tileSize: 256,
          maxzoom: 19,
          attribution: "&copy; OpenStreetMap contributors",
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
  }

  if (style === "satellite") {
    return {
      version: 8,
      sources: {
        "sufi-basemap": {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          maxzoom: 19,
          attribution: "&copy; Esri & Maxar",
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
  }

  // terrain (OpenTopoMap max native zoom is 17)
  return {
    version: 8,
    sources: {
      "sufi-basemap": {
        type: "raster",
        tiles: ["https://tile.opentopomap.org/{z}/{x}/{y}.png"],
        tileSize: 256,
        maxzoom: 17,
        attribution: "&copy; OpenTopoMap contributors",
      },
    },
    layers: [
      {
        id: "sufi-basemap-layer",
        type: "raster",
        source: "sufi-basemap",
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  };
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
    onExploreChange,
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

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: getMapStyle(basemapStyle),
      center: [initialLng, initialLat],
      zoom: 11.5,
      maxZoom: 19,
      attributionControl: false,
    });

    // Ensure map resizes to container width/height immediately after mount
    map.on("load", () => {
      map.resize();
    });

    let exploring = false;
    map.on("movestart", (e) => {
      if (!e.originalEvent || exploring) return;
      exploring = true;
      if (onExploreChange) onExploreChange(true);
    });
    map.on("moveend", () => {
      if (!exploring) return;
      exploring = false;
      if (onExploreChange) onExploreChange(false);
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

  // Update Basemap Style when basemapStyle prop changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || currentStyleRef.current === basemapStyle) return;

    currentStyleRef.current = basemapStyle;
    map.setStyle(getMapStyle(basemapStyle));
  }, [basemapStyle]);

  // Update Markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    const KIND_LETTER: Record<string, string> = {
      maqam: "M", zawiya: "Z", dargah: "D", gathering: "G",
    };

    places.forEach((place) => {
      const isSelected = selectedPlace?.id === place.id;
      const letter = KIND_LETTER[place.kind] ?? "•";

      // Root group wrapper — data-selected drives CSS state
      const el = document.createElement("div");
      el.className = "sufi-pin-marker group";
      el.dataset["selected"] = String(isSelected);

      // 40px rounded sanctuary pin (button for a11y)
      const btn = document.createElement("button");
      btn.type = "button";
      btn.setAttribute("aria-label", place.name_en);
      btn.title = place.name_en;
      btn.className = [
        "sufi-pin-btn",
        "relative flex size-10 cursor-pointer items-center justify-center",
        "rounded-[14px] border-2 border-white bg-[#1F5C3A] text-white",
        "shadow-md transition-all duration-200",
        isSelected ? "scale-110 !bg-[#121512] shadow-xl" : "",
      ].join(" ");

      // Category letter badge
      btn.innerHTML = `
        <svg width="18" height="20" viewBox="0 0 18 20" fill="none"
             stroke="currentColor" stroke-width="1.8"
             stroke-linejoin="round" stroke-linecap="round" aria-hidden="true">
          <path d="M9 1v3"/>
          <path d="M9 4C4.8 6.4 2.5 9.5 2.5 12.7V19h13v-6.3C15.5 9.5 13.2 6.4 9 4z"/>
          <path d="M7.5 19v-3.5a1.5 1.5 0 0 1 3 0V19"/>
        </svg>
        <span class="absolute -top-2 -right-2 flex size-5 items-center justify-center
                     rounded-full border border-[#E4E2D8] bg-[#FAF9F4]
                     font-serif text-[10px] font-bold text-[#1F5C3A]">
          ${letter}
        </span>
      `;

      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        onSelectPlace(place);
      });

      el.appendChild(btn);

      const marker = new maplibregl.Marker({ element: el, anchor: "bottom" })
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
