"use client";

import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { Database } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Navigation,
  Bookmark,
  BookmarkCheck,
  Edit3,
  ExternalLink,
  Sparkles,
  X,
  Compass,
} from "lucide-react";

type Place = Database["public"]["Tables"]["places"]["Row"];

interface PlaceBottomSheetProps {
  place: Place | null;
  onClose: () => void;
}

export function PlaceBottomSheet({ place, onClose }: PlaceBottomSheetProps) {
  const t = useTranslations();
  const locale = useLocale();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!place) return;
    try {
      const savedList = JSON.parse(
        localStorage.getItem("sufi_saved_places") || "[]"
      );
      setIsSaved(savedList.includes(place.id));
    } catch {
      setIsSaved(false);
    }
  }, [place]);

  if (!place) return null;

  const toggleSave = () => {
    try {
      const savedList: string[] = JSON.parse(
        localStorage.getItem("sufi_saved_places") || "[]"
      );
      let updated: string[];
      if (savedList.includes(place.id)) {
        updated = savedList.filter((id) => id !== place.id);
        setIsSaved(false);
      } else {
        updated = [...savedList, place.id];
        setIsSaved(true);
      }
      localStorage.setItem("sufi_saved_places", JSON.stringify(updated));
    } catch {
      setIsSaved(!isSaved);
    }
  };

  const handleDirections = () => {
    const url = `https://www.openstreetmap.org/directions?route=;${place.latitude},${place.longitude}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Locale-dependent display values
  const primaryName =
    locale === "ml" ? place.name_ml : locale === "ar" ? place.name_ar : place.name_en;

  const shortHistory =
    locale === "ml"
      ? place.short_history_ml || place.short_history_en
      : locale === "ar"
      ? place.short_history_ar || place.short_history_en
      : place.short_history_en;

  const firstSource =
    place.sources && place.sources.length > 0 ? place.sources[0] : null;

  return (
    <Card className="fixed bottom-14 left-0 right-0 z-40 max-w-md mx-auto w-full bg-white rounded-t-[14px] rounded-b-none shadow-float border-t border-x-0 border-b-0 border-border animate-in slide-in-from-bottom duration-300">
      {/* Top Grab Handle & Close Bar */}
      <div className="flex items-center justify-between px-4 pt-2.5 pb-1">
        <div className="w-10 h-1 rounded-full bg-border/80 mx-auto" />
        <button
          onClick={onClose}
          aria-label={t("common.close")}
          className="p-1 -mr-1 rounded-full text-muted-foreground hover:text-foreground hover:bg-sahn-bg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <CardContent className="px-4 pb-4 pt-1">
        {/* Kind & Area Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-transparent text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full"
            >
              {place.kind}
            </Badge>
            <span className="text-[11px] text-muted-foreground truncate">
              {place.area}
            </span>
          </div>

          <Link
            href={`/places/${place.id}`}
            className="text-[11px] font-medium text-primary flex items-center gap-1 hover:underline"
          >
            <span>{t("home.openDetails")}</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        {/* Trilingual Title Header */}
        <div className="mt-2">
          <h2 className="font-serif text-xl font-semibold text-foreground leading-snug">
            {primaryName}
          </h2>
          <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground mt-0.5">
            {locale !== "en" && <span className="font-sans">{place.name_en}</span>}
            {locale !== "ml" && <span className="font-sans">{place.name_ml}</span>}
            {locale !== "ar" && (
              <span className="font-arabic" dir="rtl">
                {place.name_ar}
              </span>
            )}
          </div>
        </div>

        {/* Short History (2-3 lines) */}
        {shortHistory && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
            {shortHistory}
          </p>
        )}

        {/* Verified Source Citation */}
        {firstSource && (
          <div className="mt-2 text-[10px] text-muted-foreground flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3 h-3 text-primary shrink-0" />
            <span className="truncate">
              {t("common.verifiedSource")}: {firstSource.title}
              {firstSource.author ? ` (${firstSource.author})` : ""}
            </span>
          </div>
        )}

        {/* Action Buttons in Thumb Zone */}
        <div className="grid grid-cols-12 gap-2 mt-3.5">
          {/* Primary Directions CTA */}
          <Button
            onClick={handleDirections}
            className="col-span-6 h-11 bg-primary text-primary-foreground rounded-[14px] font-medium text-xs flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all shadow-sm"
          >
            <Navigation className="w-3.5 h-3.5 fill-current" />
            <span>{t("common.directions")}</span>
          </Button>

          {/* Ghost Save CTA */}
          <Button
            onClick={toggleSave}
            variant="outline"
            className={`col-span-3 h-11 bg-white border-border rounded-[14px] font-medium text-xs flex items-center justify-center gap-1.5 hover:bg-sahn-bg active:scale-[0.98] transition-all ${
              isSaved ? "text-primary border-primary/40 bg-primary/5" : "text-foreground"
            }`}
          >
            {isSaved ? (
              <BookmarkCheck className="w-3.5 h-3.5 fill-primary text-primary" />
            ) : (
              <Bookmark className="w-3.5 h-3.5 text-muted-foreground" />
            )}
            <span>{isSaved ? t("common.saved") : t("common.save")}</span>
          </Button>

          {/* Ghost Suggest Edit CTA */}
          <Link
            href={`/contribute?correction_for=${place.id}&type=place`}
            className="col-span-3 h-11"
          >
            <Button
              variant="outline"
              className="w-full h-11 bg-white border-border text-muted-foreground rounded-[14px] font-medium text-xs flex items-center justify-center gap-1 hover:text-foreground hover:bg-sahn-bg active:scale-[0.98] transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="truncate">{t("common.suggestEdit")}</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
