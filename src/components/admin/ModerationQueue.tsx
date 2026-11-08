"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  MapPin,
  Calendar,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

interface PendingItem {
  id: string;
  type: "place" | "person" | "gathering" | "correction";
  title: string;
  subtitle: string;
  kind?: string;
  sources: Array<{ title: string; author?: string }>;
  isLiving?: boolean;
  consentStatus?: string;
  createdAt: string;
}

export function ModerationQueue() {
  const t = useTranslations("admin");

  // Sample pending review items for review
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([
    {
      id: "p-sample-1",
      type: "place",
      title: "Tanur Valiya Kulangara Juma Masjid",
      subtitle: "Historical coastal sanctuary in Tanur, Malappuram",
      kind: "maqam",
      sources: [
        {
          title: "Malabar District Gazetteer (W. Logan)",
          author: "William Logan, 1887",
        },
      ],
      createdAt: "Today at 2:15 PM",
    },
    {
      id: "p-sample-2",
      type: "person",
      title: "Ustadh Muhammad al-Bukhari",
      subtitle: "Lecturer in Malappuram",
      isLiving: true,
      consentStatus: "granted",
      sources: [
        {
          title: "Consent document on file signed by student council",
          author: "Registrar",
        },
      ],
      createdAt: "Yesterday at 6:40 PM",
    },
    {
      id: "p-sample-3",
      type: "gathering",
      title: "Monthly Mawlid & Burdah Halqa",
      subtitle: "Ponnani Port Masjid Public Hall (Every 1st Friday)",
      sources: [
        {
          title: "Ponnani Mahallu Committee Announcement",
          author: "Secretary",
        },
      ],
      createdAt: "Nov 7 at 8:00 AM",
    },
  ]);

  const [activeItemForReject, setActiveItemForReject] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleApprove = async (item: PendingItem) => {
    try {
      const supabase = createClient() as any;
      const tableName =
        item.type === "place"
          ? "places"
          : item.type === "person"
          ? "persons"
          : item.type === "gathering"
          ? "gatherings"
          : "corrections";

      await supabase
        .from(tableName)
        .update({
          status: "approved",
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", item.id);
    } catch {
      // Local state update
    }

    setPendingItems((prev) => prev.filter((p) => p.id !== item.id));
    setActionNotice(`Approved "${item.title}" successfully.`);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const handleReject = async (itemId: string) => {
    if (!rejectReason.trim()) return;

    try {
      const supabase = createClient() as any;
      const item = pendingItems.find((p) => p.id === itemId);
      if (item) {
        const tableName =
          item.type === "place"
            ? "places"
            : item.type === "person"
            ? "persons"
            : item.type === "gathering"
            ? "gatherings"
            : "corrections";

        await supabase
          .from(tableName)
          .update({
            status: "rejected",
            review_notes: rejectReason,
            reviewed_at: new Date().toISOString(),
          })
          .eq("id", itemId);
      }
    } catch {
      // Local state update
    }

    setPendingItems((prev) => prev.filter((p) => p.id !== itemId));
    setActiveItemForReject(null);
    setRejectReason("");
    setActionNotice("Item rejected with notes.");
    setTimeout(() => setActionNotice(null), 3000);
  };

  return (
    <div className="flex flex-col gap-4">
      {actionNotice && (
        <div className="p-3 rounded-xl bg-primary/10 text-primary text-xs font-medium flex items-center gap-2 border border-primary/20">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionNotice}</span>
        </div>
      )}

      {pendingItems.length === 0 ? (
        <div className="py-12 bg-white rounded-[14px] border border-border flex flex-col items-center text-center p-6 gap-2">
          <CheckCircle2 className="w-10 h-10 text-primary" />
          <h3 className="font-serif text-base font-semibold text-foreground">
            {t("emptyQueue")}
          </h3>
          <p className="text-xs text-muted-foreground">
            All submitted entries have been verified and processed.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {pendingItems.map((item) => (
            <Card
              key={item.id}
              className="rounded-[14px] border-border bg-white shadow-sm overflow-hidden"
            >
              <CardContent className="p-4 flex flex-col gap-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className="bg-primary/10 text-primary text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full"
                    >
                      {item.type}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      {item.createdAt}
                    </span>
                  </div>

                  {item.isLiving && (
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        item.consentStatus === "granted"
                          ? "bg-primary/5 text-primary border-primary/30"
                          : "bg-destructive/5 text-destructive border-destructive/30"
                      }`}
                    >
                      Consent: {item.consentStatus}
                    </Badge>
                  )}
                </div>

                <div>
                  <h3 className="font-serif text-base font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    {item.subtitle}
                  </p>
                </div>

                {/* Sources Verification */}
                <div className="p-2.5 rounded-lg bg-sahn-bg border border-border/70 text-xs flex flex-col gap-1">
                  <span className="font-semibold text-[11px] text-primary flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Submitted Source:
                  </span>
                  {item.sources.map((src, i) => (
                    <div key={i} className="text-[11px] text-foreground">
                      {src.title} {src.author ? `— ${src.author}` : ""}
                    </div>
                  ))}
                </div>

                {/* Reject dialog inline */}
                {activeItemForReject === item.id ? (
                  <div className="p-3 rounded-xl bg-destructive/5 border border-destructive/20 flex flex-col gap-2 mt-1">
                    <span className="text-xs font-semibold text-destructive">
                      {t("rejectNotesPrompt")}
                    </span>
                    <Input
                      autoFocus
                      required
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="e.g. Source could not be verified; Private address not allowed"
                      className="h-9 text-xs rounded-[8px] bg-white border-destructive/30"
                    />
                    <div className="flex items-center justify-end gap-2 mt-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setActiveItemForReject(null);
                          setRejectReason("");
                        }}
                        className="h-8 text-xs rounded-[8px]"
                      >
                        {t("cancel")}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleReject(item.id)}
                        disabled={!rejectReason.trim()}
                        className="h-8 text-xs rounded-[8px]"
                      >
                        Confirm Rejection
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-border/60">
                    <Button
                      onClick={() => handleApprove(item)}
                      className="h-10 bg-primary text-primary-foreground rounded-[12px] text-xs font-medium hover:bg-primary/90 flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t("approve")}</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setActiveItemForReject(item.id)}
                      className="h-10 border-border text-destructive hover:bg-destructive/5 rounded-[12px] text-xs font-medium flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{t("reject")}</span>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
