"use client";

import React, { useState, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Database } from "@/types/database";
import { DesktopHeader } from "@/components/navigation/DesktopHeader";
import { LocaleSwitcher } from "@/components/common/LocaleSwitcher";
import { PlaceBottomSheet } from "@/components/sheet/PlaceBottomSheet";
import { MapControls, BasemapStyle } from "@/components/map/MapControls";
import { MapContainerHandle } from "@/components/map/MapContainer";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  Plus,
  Compass,
  MapPin,
  Sparkles,
  Navigation,
  Bookmark,
  Edit3,
  ExternalLink,
  ChevronRight,
  Layers,
} from "lucide-react";

type Place = Database["public"]["Tables"]["places"]["Row"];

const MapContainer = dynamic(() => import("@/components/map/MapContainer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[420px] bg-[#EEF0E6] flex flex-col items-center justify-center gap-2">
      <Compass className="w-8 h-8 text-primary animate-spin" />
      <span className="text-xs text-muted-foreground font-serif">
        Opening Sanctuary Map...
      </span>
    </div>
  ),
});

function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

interface MapHomeClientProps {
  initialPlaces: Place[];
}

export function MapHomeClient({ initialPlaces }: MapHomeClientProps) {
  const t = useTranslations();
  const locale = useLocale();
  const mapRef = useRef<MapContainerHandle>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKind, setSelectedKind] = useState<string>("all");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(
    initialPlaces.length > 0 ? initialPlaces[0] : null
  );

  // Map Setup States
  const [basemapStyle, setBasemapStyle] = useState<BasemapStyle>("sahn-warm");
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [nearestInfo, setNearestInfo] = useState<{ name: string; distanceKm: number } | null>(null);

  const filterChips = [
    { id: "all", label: t("filters.all") },
    { id: "maqam", label: t("filters.maqam") },
    { id: "dargah", label: t("filters.dargah") },
    { id: "zawiya", label: t("filters.zawiya") },
    { id: "gathering", label: t("filters.gathering") },
  ];

  const filteredPlaces = useMemo(() => {
    return initialPlaces.filter((place) => {
      if (selectedKind !== "all" && place.kind !== selectedKind) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName =
          place.name_en.toLowerCase().includes(q) ||
          place.name_ml.toLowerCase().includes(q) ||
          place.name_ar.toLowerCase().includes(q) ||
          place.area.toLowerCase().includes(q);
        if (!matchesName) return false;
      }
      return true;
    });
  }, [initialPlaces, selectedKind, searchQuery]);

  // Geolocation handler
  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        setUserLocation(coords);
        mapRef.current?.setUserLocation(coords);

        // Find nearest sanctuary
        if (initialPlaces.length > 0) {
          let closest = initialPlaces[0];
          let minDistance = calculateDistanceKm(
            pos.coords.latitude,
            pos.coords.longitude,
            closest.latitude,
            closest.longitude
          );

          initialPlaces.forEach((p) => {
            const dist = calculateDistanceKm(
              pos.coords.latitude,
              pos.coords.longitude,
              p.latitude,
              p.longitude
            );
            if (dist < minDistance) {
              minDistance = dist;
              closest = p;
            }
          });

          setNearestInfo({
            name: closest.name_en,
            distanceKm: minDistance,
          });
          setSelectedPlace(closest);
        }
      },
      (err) => {
        console.warn("Geolocation denied or unavailable:", err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="relative flex flex-col min-h-screen w-full bg-sahn-bg overflow-hidden">
      {/* 1. Desktop Full-Width Header (Shown on >= md) */}
      <DesktopHeader />

      {/* 2. Mobile Floating App Bar (Shown on < md) */}
      <header className="md:hidden sticky top-0 z-40 px-4 pt-3 pb-2 bg-sahn-bg/95 backdrop-blur-md border-b border-border/60">
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <Compass className="w-4 h-4 text-primary animate-[spin_60s_linear_infinite]" />
              </div>
              <div>
                <h1 className="font-serif text-lg font-semibold tracking-tight text-foreground leading-none">
                  {t("common.title")}
                </h1>
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate max-w-[210px]">
                  {t("common.tagline")}
                </p>
              </div>
            </div>
            <LocaleSwitcher />
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("common.searchPlaceholder")}
              className="w-full h-11 pl-10 pr-4 rtl:pl-4 rtl:pr-10 bg-white border-border rounded-[14px] text-sm placeholder:text-muted-foreground/80 shadow-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {filterChips.map((chip) => {
              const isActive = selectedKind === chip.id;
              return (
                <Badge
                  key={chip.id}
                  onClick={() => setSelectedKind(chip.id)}
                  variant={isActive ? "default" : "outline"}
                  className={`cursor-pointer whitespace-nowrap px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
                      : "bg-white text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  {chip.label}
                </Badge>
              );
            })}
          </div>
        </div>
      </header>

      {/* 3. Main Body: Responsive Split Screen Layout */}
      <div className="flex-1 flex flex-col md:flex-row w-full h-[calc(100vh-64px)] relative overflow-hidden">
        {/* Left Desktop Sanctuary Sidebar (Visible on md and above) */}
        <aside aria-label="Sanctuary Sidebar" className="hidden md:flex flex-col w-[420px] h-full border-r border-border bg-white shadow-xs z-20 overflow-hidden shrink-0">
          {/* Sidebar Top Search & Chips */}
          <div className="p-4 border-b border-border/70 flex flex-col gap-3 bg-sahn-bg/40">
            <div className="relative">
              <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sanctuaries, maqams..."
                className="h-10 pl-9 pr-3 rtl:pl-3 rtl:pr-9 bg-white border-border rounded-[12px] text-xs shadow-xs focus-visible:ring-primary"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {filterChips.map((chip) => {
                const isActive = selectedKind === chip.id;
                return (
                  <Badge
                    key={chip.id}
                    onClick={() => setSelectedKind(chip.id)}
                    variant={isActive ? "default" : "outline"}
                    className={`cursor-pointer whitespace-nowrap px-3 py-1 text-[11px] font-medium rounded-full transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-white text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    {chip.label}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Sidebar Places List */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>Sanctuaries in West Malappuram</span>
              <span className="font-mono text-[11px]">
                {filteredPlaces.length} entries
              </span>
            </div>

            {filteredPlaces.map((place) => {
              const isSelected = selectedPlace?.id === place.id;
              const primaryName =
                locale === "ml"
                  ? place.name_ml
                  : locale === "ar"
                  ? place.name_ar
                  : place.name_en;

              return (
                <div
                  key={place.id}
                  onClick={() => setSelectedPlace(place)}
                  className={`card-lift w-full text-start p-3.5 rounded-[14px] border cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-primary/5 border-primary shadow-sm"
                      : "bg-white border-border hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary border-transparent text-[10px] font-semibold uppercase tracking-wider px-2 py-0 h-4 rounded-full"
                        >
                          {place.kind}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground">
                          {place.area}
                        </span>
                      </div>
                      <h3 className="font-serif text-base font-semibold text-foreground leading-snug">
                        {primaryName}
                      </h3>
                      {locale !== "en" && (
                        <span className="text-xs text-muted-foreground block font-sans">
                          {place.name_en}
                        </span>
                      )}
                    </div>

                    <Link
                      href={`/places/${place.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="p-1 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
                    >
                      <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                    </Link>
                  </div>

                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                    {place.short_history_en}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between text-[11px]">
                    <span className="text-muted-foreground font-mono">
                      {place.latitude.toFixed(4)}° N, {place.longitude.toFixed(4)}° E
                    </span>

                    <a
                      href={`https://www.openstreetmap.org/directions?route=;${place.latitude},${place.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="font-medium text-primary flex items-center gap-1 hover:underline"
                    >
                      <Navigation className="w-3 h-3 fill-current" />
                      <span>Directions</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right Map Canvas (Spans full viewport height and width) */}
        <main className="flex-1 w-full h-full relative min-h-[420px]">
          <MapContainer
            ref={mapRef}
            places={filteredPlaces}
            selectedPlace={selectedPlace}
            onSelectPlace={(place) => setSelectedPlace(place)}
            basemapStyle={basemapStyle}
          />

          {/* Floating In-App Map Controls (Basemaps, Locate Me, Region hubs) */}
          <MapControls
            currentStyle={basemapStyle}
            onStyleChange={setBasemapStyle}
            onLocateUser={handleLocateUser}
            onZoomIn={() => mapRef.current?.zoomIn()}
            onZoomOut={() => mapRef.current?.zoomOut()}
            onResetBearing={() => mapRef.current?.resetBearing()}
            onSelectRegion={(coords, zoom) => mapRef.current?.flyTo(coords, zoom)}
            nearestPlaceName={nearestInfo?.name}
            nearestDistanceKm={nearestInfo?.distanceKm}
          />

          {/* Mobile Floating Action Button (+) */}
          <Link
            href="/contribute"
            className="md:hidden absolute bottom-20 right-4 z-30"
            aria-label={t("home.contributeCTA")}
          >
            <Button
              size="icon"
              className="w-13 h-13 rounded-full bg-primary text-primary-foreground shadow-[0_4px_16px_rgba(31,92,58,0.35)] hover:bg-primary/95 active:scale-95 transition-all"
            >
              <Plus className="w-6 h-6 stroke-[2.25]" />
            </Button>
          </Link>
        </main>
      </div>

      {/* 4. Mobile Bottom Sheet (Shown only on small screens) */}
      <div className="md:hidden">
        <PlaceBottomSheet
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      </div>
    </div>
  );
}
