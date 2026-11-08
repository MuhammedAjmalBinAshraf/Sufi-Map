"use client";

import React, { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Database, PlaceKind } from "@/types/database";
import { LocaleSwitcher } from "@/components/common/LocaleSwitcher";
import { PlaceBottomSheet } from "@/components/sheet/PlaceBottomSheet";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, Compass } from "lucide-react";

type Place = Database["public"]["Tables"]["places"]["Row"];

// Dynamic import MapContainer with SSR disabled to prevent window is not defined
const MapContainer = dynamic(() => import("@/components/map/MapContainer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-[#EEF0E6] flex flex-col items-center justify-center gap-2">
      <Compass className="w-6 h-6 text-primary animate-spin" />
      <span className="text-xs text-muted-foreground font-serif">
        Opening Sanctuary Map...
      </span>
    </div>
  ),
});

interface MapHomeClientProps {
  initialPlaces: Place[];
}

export function MapHomeClient({ initialPlaces }: MapHomeClientProps) {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKind, setSelectedKind] = useState<string>("all");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(
    initialPlaces.length > 0 ? initialPlaces[0] : null
  );

  const filterChips = [
    { id: "all", label: t("filters.all") },
    { id: "maqam", label: t("filters.maqam") },
    { id: "dargah", label: t("filters.dargah") },
    { id: "zawiya", label: t("filters.zawiya") },
    { id: "gathering", label: t("filters.gathering") },
  ];

  const filteredPlaces = useMemo(() => {
    return initialPlaces.filter((place) => {
      // Kind filtering
      if (selectedKind !== "all" && place.kind !== selectedKind) {
        return false;
      }

      // Search query filtering across trilingual names & area
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

  return (
    <div className="relative flex-1 flex flex-col min-h-screen bg-sahn-bg overflow-hidden">
      {/* Top Floating App Bar & Search Zone */}
      <header className="sticky top-0 z-40 px-4 pt-3 pb-2 bg-sahn-bg/95 backdrop-blur-md border-b border-border/60">
        <div className="max-w-md mx-auto flex flex-col gap-2.5">
          {/* Header Row: Sanctuary Title & Locale Switcher */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                <Compass className="w-4 h-4 text-primary animate-[spin_60s_linear_infinite]" />
              </div>
              <div>
                <h1 className="font-serif text-lg font-semibold tracking-tight text-foreground leading-none">
                  {t("common.title")}
                </h1>
                <p className="text-[11px] text-muted-foreground mt-0.5 font-normal truncate max-w-[210px]">
                  {t("common.tagline")}
                </p>
              </div>
            </div>
            <LocaleSwitcher />
          </div>

          {/* Search Input Bar (Thumb Friendly) */}
          <div className="relative">
            <Search className="absolute left-3.5 rtl:left-auto rtl:right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("common.searchPlaceholder")}
              className="w-full h-11 pl-10 pr-4 rtl:pl-4 rtl:pr-10 bg-white border-border rounded-[14px] text-sm placeholder:text-muted-foreground/80 shadow-sm focus-visible:ring-primary"
            />
          </div>

          {/* Filter Chips Horizontal Scroll */}
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
                      ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                      : "bg-white text-muted-foreground border-border hover:text-foreground hover:bg-sahn-bg"
                  }`}
                >
                  {chip.label}
                </Badge>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main MapLibre GL Canvas */}
      <section className="relative flex-1 min-h-[380px] w-full">
        <MapContainer
          places={filteredPlaces}
          selectedPlace={selectedPlace}
          onSelectPlace={(place) => setSelectedPlace(place)}
        />

        {/* Floating Action Button (+) in Sanctuary Green */}
        <Link
          href="/contribute"
          className="absolute bottom-20 right-4 z-30"
          aria-label={t("home.contributeCTA")}
        >
          <Button
            size="icon"
            className="w-13 h-13 rounded-full bg-primary text-primary-foreground shadow-[0_4px_16px_rgba(31,92,58,0.35)] hover:bg-primary/95 active:scale-95 transition-all"
          >
            <Plus className="w-6 h-6 stroke-[2.25]" />
          </Button>
        </Link>
      </section>

      {/* Bottom Sheet for Selected Place */}
      <PlaceBottomSheet
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
      />
    </div>
  );
}
