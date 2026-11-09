"use client";

import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  CalendarDays,
  Navigation,
  PencilLine,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Database } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

type Place = Database["public"]["Tables"]["places"]["Row"];

interface SiteDetailProps {
  place: Place;
  onBack: () => void;
  locale: string;
}

export function SiteDetail({ place, onBack, locale }: SiteDetailProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [correcting, setCorrecting] = useState(false);
  const [correctionNote, setCorrectionNote] = useState("");
  const [correctionSent, setCorrectionSent] = useState(false);

  useEffect(() => {
    try {
      const savedList: string[] = JSON.parse(
        localStorage.getItem("sufi_saved_places") || "[]"
      );
      setIsSaved(savedList.includes(place.id));
    } catch {
      setIsSaved(false);
    }
  }, [place.id]);

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

  const handleSendCorrection = () => {
    try {
      const pending = JSON.parse(
        localStorage.getItem("sufi_corrections") || "[]"
      );
      pending.push({
        placeId: place.id,
        placeName: place.name_en,
        note: correctionNote,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("sufi_corrections", JSON.stringify(pending));
    } catch {
      // ignore
    }
    setCorrectionSent(true);
    setTimeout(() => {
      setCorrectionSent(false);
      setCorrectionNote("");
      setCorrecting(false);
    }, 1500);
  };

  const primaryName =
    locale === "ml"
      ? place.name_ml
      : locale === "ar"
      ? place.name_ar
      : place.name_en;

  const shortHistory =
    locale === "ml"
      ? place.short_history_ml || place.short_history_en
      : locale === "ar"
      ? place.short_history_ar || place.short_history_en
      : place.short_history_en;

  const firstSource =
    place.sources && place.sources.length > 0 ? place.sources[0] : null;

  return (
    <article className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
      <div className="mb-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="-ms-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-[10px]"
        >
          <ArrowLeft className="w-4 h-4 mr-1 rtl:rotate-180" aria-hidden />
          <span>Back to List</span>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Badge variant="parchment" className="capitalize text-[11px] px-2.5 py-0.5">
          {place.kind}
        </Badge>
        <span className="text-xs text-muted-foreground">{place.area}</span>
      </div>

      <h2 className="mt-3 text-2xl font-serif font-semibold leading-tight text-foreground">
        {primaryName}
      </h2>

      {locale !== "en" && (
        <p className="mt-1 text-xs text-muted-foreground font-sans">
          {place.name_en}
        </p>
      )}

      {place.recurring_events_en && (
        <div className="mt-3 flex items-start gap-2 rounded-[14px] bg-accent px-3 py-2 text-xs text-foreground">
          <CalendarDays className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden />
          <div>
            <span className="font-medium text-muted-foreground">Gathering / Event: </span>
            <span>
              {locale === "ml"
                ? place.recurring_events_ml || place.recurring_events_en
                : locale === "ar"
                ? place.recurring_events_ar || place.recurring_events_en
                : place.recurring_events_en}
            </span>
          </div>
        </div>
      )}

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground font-sans">
        {shortHistory}
      </p>

      {firstSource && (
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
          <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
          <span className="truncate">
            Source: {firstSource.title}
            {firstSource.author ? ` (${firstSource.author})` : ""}
          </span>
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-2">
        <Button
          asChild
          className="h-11 bg-primary text-primary-foreground rounded-[14px] hover:bg-primary/90 font-medium text-xs flex items-center justify-center gap-2 shadow-sm active:scale-[0.98] transition-all"
        >
          <a
            href={`https://www.openstreetmap.org/directions?route=;${place.latitude},${place.longitude}`}
            target="_blank"
            rel="noreferrer"
          >
            <Navigation className="w-3.5 h-3.5 fill-current" aria-hidden />
            <span>Directions</span>
          </a>
        </Button>

        <Button
          variant="outline"
          onClick={toggleSave}
          aria-pressed={isSaved}
          className={`h-11 rounded-[14px] font-medium text-xs flex items-center justify-center gap-1.5 border-border active:scale-[0.98] transition-all ${
            isSaved ? "text-primary border-primary/40 bg-primary/5" : "text-foreground bg-white"
          }`}
        >
          {isSaved ? (
            <BookmarkCheck className="w-3.5 h-3.5 fill-primary text-primary" aria-hidden />
          ) : (
            <Bookmark className="w-3.5 h-3.5" aria-hidden />
          )}
          <span>{isSaved ? "Saved" : "Save"}</span>
        </Button>
      </div>

      <Button
        variant="ghost"
        onClick={() => setCorrecting(true)}
        className="mt-2.5 w-full text-xs text-muted-foreground hover:text-foreground hover:bg-accent rounded-[12px] flex items-center justify-center gap-1.5"
      >
        <PencilLine className="w-3.5 h-3.5" aria-hidden />
        <span>Suggest Correction</span>
      </Button>

      <p className="mt-6 border-t border-border pt-4 text-[11px] text-muted-foreground leading-relaxed">
        * Every sanctuary record is verified by community stewards. No real historical assertion is published without source attribution.
      </p>

      {/* Suggest Correction Dialog */}
      <Dialog open={correcting} onOpenChange={setCorrecting}>
        <DialogContent className="max-w-md bg-white rounded-[14px] border border-border">
          <DialogHeader>
            <DialogTitle className="font-serif text-xl">Suggest Correction</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Help us maintain sacred reverence and historical accuracy for {primaryName}.
            </DialogDescription>
          </DialogHeader>

          {correctionSent ? (
            <div className="py-6 text-center text-sm font-medium text-primary">
              Thank you. Your correction has been submitted to moderators.
            </div>
          ) : (
            <>
              <Textarea
                value={correctionNote}
                onChange={(e) => setCorrectionNote(e.target.value)}
                placeholder="What details should be updated? (e.g. coordinates, etiquette, source reference...)"
                rows={4}
                className="bg-card rounded-[12px] border-border text-xs"
              />
              <DialogFooter className="mt-3">
                <Button
                  onClick={handleSendCorrection}
                  disabled={correctionNote.trim().length < 5}
                  className="bg-primary text-primary-foreground rounded-[12px] text-xs h-9 px-4 hover:bg-primary/90"
                >
                  Send Suggestion
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </article>
  );
}
