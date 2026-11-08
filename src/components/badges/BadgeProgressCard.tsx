"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Compass,
  Lamp,
  Gift,
  Users,
  ShieldCheck,
  Check,
  Lock,
  Sparkles,
} from "lucide-react";

export interface UserStats {
  approvedEntriesCount: number;
  sourcedEntriesCount: number;
  verifiedOthersCount: number;
  isNazir: boolean;
  nazirArea?: string;
}

interface BadgeProgressCardProps {
  stats?: UserStats;
}

export function BadgeProgressCard({
  stats = {
    approvedEntriesCount: 1,
    sourcedEntriesCount: 1,
    verifiedOthersCount: 0,
    isNazir: false,
  },
}: BadgeProgressCardProps) {
  const badgeDefs = [
    {
      id: "musafir",
      name: "Musafir",
      title: "The Traveler",
      description: "Contribute 1 approved sanctuary entry with verified source",
      target: 1,
      current: stats.sourcedEntriesCount,
      unlocked: stats.sourcedEntriesCount >= 1,
      icon: Compass,
      type: "automatic",
    },
    {
      id: "misbah",
      name: "Misbah",
      title: "The Lantern",
      description: "Document 5 approved sanctuaries or gatherings with sources",
      target: 5,
      current: stats.sourcedEntriesCount,
      unlocked: stats.sourcedEntriesCount >= 5,
      icon: Lamp,
      type: "automatic",
    },
    {
      id: "hadiyya",
      name: "Hadiyya",
      title: "The Gift",
      description: "Offer 10 approved sanctuaries to the community with sources",
      target: 10,
      current: stats.sourcedEntriesCount,
      unlocked: stats.sourcedEntriesCount >= 10,
      icon: Gift,
      type: "automatic",
    },
    {
      id: "rafeeq",
      name: "Rafeeq",
      title: "The Companion",
      description: "Help verify or suggest corrections for 5 entries by others",
      target: 5,
      current: stats.verifiedOthersCount,
      unlocked: stats.verifiedOthersCount >= 5,
      icon: Users,
      type: "automatic",
    },
    {
      id: "nazir",
      name: "Nazir",
      title: "The Custodian",
      description: "Appointed by an administrator for regional area care",
      target: 1,
      current: stats.isNazir ? 1 : 0,
      unlocked: stats.isNazir,
      icon: ShieldCheck,
      type: "admin_granted",
      area: stats.nazirArea,
    },
  ];

  return (
    <Card className="rounded-[14px] border-border bg-white shadow-sm overflow-hidden">
      <CardContent className="p-4 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 border-b border-border/60 pb-3">
          <div>
            <div className="flex items-center gap-1.5 text-primary text-xs font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>Badges of Stewardship</span>
            </div>
            <h3 className="font-serif text-base font-bold text-foreground mt-0.5">
              Contributor Progress
            </h3>
            <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
              Everyday titles (no spiritual ranks). Awarded strictly for approved and sourced entries, never for volume alone.
            </p>
          </div>
        </div>

        {/* Badges List */}
        <div className="flex flex-col gap-2.5 mt-1">
          {badgeDefs.map((badge) => {
            const Icon = badge.icon;
            const progressPercent = Math.min(
              100,
              Math.round((badge.current / badge.target) * 100)
            );

            return (
              <div
                key={badge.id}
                className={`p-3 rounded-xl border transition-all ${
                  badge.unlocked
                    ? "bg-primary/5 border-primary/25"
                    : "bg-sahn-bg/60 border-border opacity-85"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center border ${
                        badge.unlocked
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-white text-muted-foreground border-border"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-serif text-sm font-semibold text-foreground">
                          {badge.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          ({badge.title})
                        </span>
                        {badge.unlocked ? (
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary border-transparent text-[9px] px-1.5 py-0 h-4 rounded-full flex items-center gap-0.5"
                          >
                            <Check className="w-2.5 h-2.5" />
                            <span>Earned</span>
                          </Badge>
                        ) : (
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {badge.current}/{badge.target}
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {badge.description}
                        {badge.area && (
                          <span className="font-semibold text-primary ml-1">
                            [{badge.area}]
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {!badge.unlocked && (
                    <Lock className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0 mt-1" />
                  )}
                </div>

                {/* Progress bar */}
                {!badge.unlocked && badge.type === "automatic" && (
                  <div className="mt-2.5">
                    <Progress value={progressPercent} className="h-1.5 bg-border/60" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
