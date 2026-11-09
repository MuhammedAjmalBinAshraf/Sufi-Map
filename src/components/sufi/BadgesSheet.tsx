"use client";

import React, { useState, useEffect } from "react";
import { Check, Compass, Award, Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface BadgesSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dir?: "ltr" | "rtl";
}

interface BadgeItem {
  id: string;
  name: string;
  arabic: string;
  desc: string;
  target: number;
}

const BADGES: BadgeItem[] = [
  {
    id: "musafir",
    name: "Musafir",
    arabic: "مسافر",
    desc: "The Traveler: 1 approved entry with verified source",
    target: 1,
  },
  {
    id: "misbah",
    name: "Misbah",
    arabic: "مصباح",
    desc: "The Lantern: 5 approved entries with verified sources",
    target: 5,
  },
  {
    id: "hadiyya",
    name: "Hadiyya",
    arabic: "هدية",
    desc: "The Gift: 10 approved entries with verified sources",
    target: 10,
  },
  {
    id: "rafeeq",
    name: "Rafeeq",
    arabic: "رفيق",
    desc: "The Companion: Verified or suggested 5 valid corrections",
    target: 5,
  },
  {
    id: "nazir",
    name: "Nazir",
    arabic: "ناظر",
    desc: "The Custodian: Moderator-appointed area caretaker",
    target: 1,
  },
];

export function BadgesSheet({ open, onOpenChange, dir = "ltr" }: BadgesSheetProps) {
  const [counts, setCounts] = useState<{ approved: number; corrections: number }>({
    approved: 0,
    corrections: 0,
  });

  useEffect(() => {
    try {
      const contrib = JSON.parse(localStorage.getItem("sufi_contributions") || "[]");
      const corr = JSON.parse(localStorage.getItem("sufi_corrections") || "[]");
      setCounts({
        approved: Array.isArray(contrib) ? contrib.length : 0,
        corrections: Array.isArray(corr) ? corr.length : 0,
      });
    } catch {
      setCounts({ approved: 0, corrections: 0 });
    }
  }, [open]);

  const getProgress = (id: string, target: number) => {
    let value = 0;
    if (id === "musafir" || id === "misbah" || id === "hadiyya") {
      value = counts.approved;
    } else if (id === "rafeeq") {
      value = counts.corrections;
    } else {
      value = 0; // Nazir is assigned by moderators
    }
    const percent = Math.min(100, Math.round((value / target) * 100));
    const earned = value >= target && target > 0;
    return { value, target, percent, earned };
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={dir === "rtl" ? "left" : "right"}
        className="w-full overflow-y-auto sm:max-w-md bg-white border-border"
      >
        <SheetHeader>
          <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase tracking-wider mb-1">
            <Award className="w-4 h-4" />
            <span>Community Stewardship</span>
          </div>
          <SheetTitle className="font-serif text-2xl text-foreground">
            Steward Badges
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground leading-relaxed">
            Badges recognize everyday care and verified research. They carry no spiritual rank or claim of stations.
          </SheetDescription>
        </SheetHeader>

        <ul className="mt-6 space-y-3">
          {BADGES.map((b) => {
            const p = getProgress(b.id, b.target);
            return (
              <li
                key={b.id}
                className={`card-lift rounded-[14px] border p-4 transition-all ${
                  p.earned ? "border-primary/40 bg-accent/60" : "bg-card border-border"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex size-12 shrink-0 items-center justify-center rounded-[14px] border font-arabic text-lg ${
                      p.earned
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "bg-accent border-border text-primary font-bold"
                    }`}
                    aria-hidden
                  >
                    {b.arabic}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-serif text-base font-medium text-foreground">
                        {b.name}
                      </h3>
                      {p.earned ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-primary">
                          <Check className="size-3.5" aria-hidden />
                          Earned
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-muted-foreground">
                          {p.value} / {p.target}
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                      {b.desc}
                    </p>
                  </div>
                </div>
                <Progress
                  value={p.percent}
                  className="mt-3 h-1.5 bg-border [&>div]:bg-primary"
                />
              </li>
            );
          })}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
