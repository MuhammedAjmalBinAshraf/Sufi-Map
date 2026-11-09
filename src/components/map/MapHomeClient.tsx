"use client";

import React, { useState, useMemo, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Database } from "@/types/database";
import { LocaleSwitcher } from "@/components/common/LocaleSwitcher";
import { MapControls, BasemapStyle } from "@/components/map/MapControls";
import { MapContainerHandle } from "@/components/map/MapContainer";
import { SiteDetail } from "@/components/sufi/SiteDetail";
import { BadgesSheet } from "@/components/sufi/BadgesSheet";
import { MobileSheet } from "@/components/sufi/MobileSheet";
import { RotatingQuote } from "@/components/contribute/RotatingQuote";
import { SheetSnap } from "@/lib/sheet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search,
  Plus,
  Compass,
  MoonStar,
  Award,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
  Navigation,
} from "lucide-react";

type Place = Database["public"]["Tables"]["places"]["Row"];
type Quote = Database["public"]["Tables"]["quotes"]["Row"];

const MapContainer = dynamic(() => import("@/components/map/MapContainer"), {
  ssr: false,
  loading: () => (
    <div className="courtyard-pattern w-full h-full min-h-[420px] flex flex-col items-center justify-center gap-2">
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
  quotes?: Quote[];
}

export function MapHomeClient({ initialPlaces, quotes = [] }: MapHomeClientProps) {
  const t = useTranslations();
  const locale = useLocale();
  const mapRef = useRef<MapContainerHandle>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKind, setSelectedKind] = useState<string>("all");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [badgesOpen, setBadgesOpen] = useState(false);
  const [sheetSnap, setSheetSnap] = useState<SheetSnap>("half");

  // Exploration state: quote banner steps aside while panning/zooming
  const [exploring, setExploring] = useState(false);
  const returnTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  const onExploreChange = useCallback((on: boolean) => {
    if (returnTimer.current) clearTimeout(returnTimer.current);
    if (on) {
      setExploring(true);
    } else {
      returnTimer.current = setTimeout(() => setExploring(false), 5000);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (returnTimer.current) clearTimeout(returnTimer.current);
    };
  }, []);

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

  const selectPlace = (place: Place) => {
    setSelectedPlace(place);
    setSheetSnap("half");
  };

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
          selectPlace(closest);
        }
      },
      (err) => {
        console.warn("Geolocation denied or unavailable:", err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div className="relative flex h-dvh w-full overflow-hidden bg-background">
      {/* ─── 1. Desktop Sanctuary Sidebar (Collapsible) ─── */}
      <aside
        inert={!sidebarOpen}
        className={`hidden shrink-0 overflow-hidden bg-background transition-[width] duration-300 ease-out md:flex ${
          sidebarOpen ? "w-[420px] border-e border-border" : "w-0 border-none"
        }`}
      >
        <div className="flex w-[420px] shrink-0 flex-col h-full">
          {/* Header */}
          <header className="space-y-3.5 border-b border-border/80 p-5 pb-4 bg-card/60 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2">
              {/* Brand Logo & Name */}
              <div className="flex items-center gap-2.5">
                <span
                  className="flex size-9 items-center justify-center rounded-[14px] bg-primary text-primary-foreground shadow-xs"
                  aria-hidden
                >
                  <MoonStar className="size-4" />
                </span>
                <div>
                  <h1 className="font-serif text-xl font-semibold tracking-tight text-foreground leading-none">
                    {t("common.title")}
                  </h1>
                </div>
              </div>

              {/* Language Switcher + Sidebar Collapse Button */}
              <div className="flex items-center gap-1.5">
                <LocaleSwitcher />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                  aria-label={t("common.collapseMenu")}
                  title={t("common.collapseMenu")}
                  className="size-8 rounded-[10px] text-muted-foreground hover:text-foreground hover:bg-accent"
                >
                  <PanelLeftClose className="size-4 rtl:-scale-x-100" aria-hidden />
                </Button>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {t("common.tagline")}
            </p>

            {/* Quick Actions Bar */}
            <div className="flex items-center gap-2 pt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBadgesOpen(true)}
                className="h-8 rounded-[12px] text-xs font-medium border-border hover:bg-accent flex items-center gap-1.5 px-3"
              >
                <Award className="size-3.5 text-primary" aria-hidden />
                <span>Badges</span>
              </Button>

              <Link href="/contribute" className="flex-1">
                <Button
                  size="sm"
                  className="w-full h-8 rounded-[12px] bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-medium flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Plus className="size-3.5 stroke-[2.5]" aria-hidden />
                  <span>{t("home.contributeCTA")}</span>
                </Button>
              </Link>
            </div>
          </header>

          {/* Filter Bar (Only shown when not viewing a single place detail) */}
          {!selectedPlace && (
            <div className="border-b border-border/80 p-4 pb-3 space-y-2.5 bg-accent/20">
              <div className="relative">
                <Search className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden />
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("common.searchPlaceholder")}
                  className="h-10 bg-card ps-9 text-xs rounded-[12px] border-border shadow-2xs focus-visible:ring-primary"
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
                      className={`cursor-pointer whitespace-nowrap px-3 py-1 text-[11px] font-medium rounded-full transition-all duration-200 ${
                        isActive
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs"
                          : "bg-card text-muted-foreground border-border hover:text-foreground"
                      }`}
                    >
                      {chip.label}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {/* Sidebar Body Content: Either Place List OR SiteDetail */}
          <div className="min-h-0 flex-1 overflow-y-auto p-4">
            {selectedPlace ? (
              <SiteDetail
                place={selectedPlace}
                onBack={() => setSelectedPlace(null)}
                locale={locale}
              />
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
                  <span>Sanctuaries ({filteredPlaces.length})</span>
                  {nearestInfo && (
                    <span className="text-[11px] font-mono text-primary truncate max-w-[170px]">
                      Nearest: {nearestInfo.name} ({nearestInfo.distanceKm.toFixed(1)} km)
                    </span>
                  )}
                </div>

                {filteredPlaces.length === 0 ? (
                  <p className="px-1 py-12 text-center text-xs text-muted-foreground">
                    No sanctuaries found matching your criteria.
                  </p>
                ) : (
                  <ul className="space-y-2.5">
                    {filteredPlaces.map((place) => {
                      const primaryName =
                        locale === "ml"
                          ? place.name_ml
                          : locale === "ar"
                          ? place.name_ar
                          : place.name_en;

                      return (
                        <li key={place.id}>
                          <button
                            type="button"
                            onClick={() => selectPlace(place)}
                            className="card-lift w-full text-start p-3.5 rounded-[14px] border border-border bg-card cursor-pointer transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex items-center gap-1.5 mb-1">
                                  <Badge
                                    variant="parchment"
                                    className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0 h-4 rounded-full"
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

                              <div className="p-1 text-muted-foreground hover:text-primary">
                                <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                              </div>
                            </div>

                            <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                              {place.short_history_en}
                            </p>

                            <div className="mt-2.5 pt-2 border-t border-border/50 flex items-center justify-between text-[11px]">
                              <span className="text-muted-foreground font-mono">
                                {place.latitude.toFixed(4)}° N, {place.longitude.toFixed(4)}° E
                              </span>

                              <span className="font-medium text-primary flex items-center gap-1">
                                <Navigation className="w-3 h-3 fill-current" />
                                <span>View</span>
                              </span>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ─── 2. Main Map Viewport ─── */}
      <main className="relative min-w-0 flex-1 h-full">
        <MapContainer
          ref={mapRef}
          places={filteredPlaces}
          selectedPlace={selectedPlace}
          onSelectPlace={selectPlace}
          basemapStyle={basemapStyle}
          onExploreChange={onExploreChange}
        />

        {/* Desktop Expand Sidebar Floating Button (shown when sidebar is closed) */}
        {!sidebarOpen && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            aria-label={t("common.expandMenu")}
            title={t("common.expandMenu")}
            className="absolute start-5 top-5 z-20 hidden md:inline-flex bg-card shadow-float rounded-[12px] border-border hover:bg-accent"
          >
            <PanelLeftOpen className="size-4 rtl:-scale-x-100 text-foreground" aria-hidden />
          </Button>
        )}

        {/* Desktop: Floating Quote Banner on Top of the Map (fades out while exploring) */}
        {quotes.length > 0 && (
          <div
            className={`pointer-events-none absolute inset-x-0 top-5 z-20 hidden justify-center px-4 md:flex transition-all duration-300 ease-out ${
              exploring ? "opacity-0 -translate-y-2 pointer-events-none" : "opacity-100 translate-y-0"
            }`}
          >
            <div className="pointer-events-auto w-full max-w-xl">
              <RotatingQuote quotes={quotes} className="shadow-float" />
            </div>
          </div>
        )}

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

        {/* Mobile: Floating App Bar & Quote Banner */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 space-y-2 p-3 md:hidden">
          <div className="pointer-events-auto flex items-center justify-between gap-2 rounded-[14px] border border-border bg-card/95 p-2 ps-3 shadow-float backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span
                className="flex size-8 items-center justify-center rounded-[12px] bg-primary text-primary-foreground shadow-xs"
                aria-hidden
              >
                <MoonStar className="size-3.5" />
              </span>
              <h1 className="font-serif text-base font-semibold text-foreground">
                {t("common.title")}
              </h1>
            </div>

            <div className="flex items-center gap-1.5">
              <LocaleSwitcher />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setBadgesOpen(true)}
                aria-label="Badges"
                className="size-8 rounded-[10px] border-border"
              >
                <Award className="size-3.5 text-primary" aria-hidden />
              </Button>
              <Link href="/contribute">
                <Button size="icon" aria-label="Contribute" className="size-8 rounded-[10px] bg-primary text-primary-foreground">
                  <Plus className="size-3.5 stroke-[2.5]" aria-hidden />
                </Button>
              </Link>
            </div>
          </div>

          {quotes.length > 0 && (
            <div
              className={`pointer-events-auto transition-all duration-300 ease-out ${
                exploring ? "opacity-0 -translate-y-2 pointer-events-none" : "opacity-100 translate-y-0"
              }`}
            >
              <RotatingQuote quotes={quotes} className="shadow-float text-xs" />
            </div>
          )}
        </div>
      </main>

      {/* ─── 3. Mobile Draggable Bottom Sheet (peek / half / full) ─── */}
      <MobileSheet
        snap={sheetSnap}
        onSnapChange={setSheetSnap}
        peekLabel={
          selectedPlace
            ? (locale === "ml"
                ? selectedPlace.name_ml
                : locale === "ar"
                ? selectedPlace.name_ar
                : selectedPlace.name_en)
            : `${filteredPlaces.length} sanctuaries · swipe up for list`
        }
        header={
          !selectedPlace ? (
            <div className="space-y-2">
              <div className="relative">
                <Search className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden />
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("common.searchPlaceholder")}
                  className="h-10 bg-card ps-9 text-[16px] md:text-xs rounded-[12px] border-border shadow-2xs"
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
                      className={`cursor-pointer whitespace-nowrap px-3 py-1 text-[11px] font-medium rounded-full ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-card text-muted-foreground border-border"
                      }`}
                    >
                      {chip.label}
                    </Badge>
                  );
                })}
              </div>
            </div>
          ) : undefined
        }
      >
        {selectedPlace ? (
          <SiteDetail
            place={selectedPlace}
            onBack={() => setSelectedPlace(null)}
            locale={locale}
          />
        ) : (
          <ul className="space-y-2.5">
            {filteredPlaces.map((place) => {
              const primaryName =
                locale === "ml"
                  ? place.name_ml
                  : locale === "ar"
                  ? place.name_ar
                  : place.name_en;

              return (
                <li key={place.id}>
                  <button
                    type="button"
                    onClick={() => selectPlace(place)}
                    className="card-lift w-full text-start p-3 rounded-[14px] border border-border bg-card cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <Badge
                            variant="parchment"
                            className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0 h-4 rounded-full"
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
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground rtl:rotate-180" />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                      {place.short_history_en}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </MobileSheet>

      {/* ─── 4. Badges Slide-Out Sheet ─── */}
      <BadgesSheet
        open={badgesOpen}
        onOpenChange={setBadgesOpen}
        dir={locale === "ar" ? "rtl" : "ltr"}
      />
    </div>
  );
}
