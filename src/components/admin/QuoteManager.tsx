"use client";

import React, { useState } from "react";
import { Database } from "@/types/database";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Quote as QuoteIcon,
  Plus,
  CheckCircle2,
  ToggleLeft,
  ToggleRight,
  Sparkles,
} from "lucide-react";

type Quote = Database["public"]["Tables"]["quotes"]["Row"];

interface QuoteManagerProps {
  initialQuotes: Quote[];
}

export function QuoteManager({ initialQuotes }: QuoteManagerProps) {
  const [quotes, setQuotes] = useState<Quote[]>(initialQuotes);
  const [showAddForm, setShowAddForm] = useState(false);
  const [arabic, setArabic] = useState("");
  const [english, setEnglish] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const supabase = createClient() as any;
      await supabase
        .from("quotes")
        .update({ active: !currentActive })
        .eq("id", id);
    } catch {
      // Local state update
    }

    setQuotes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, active: !currentActive } : q))
    );
  };

  const handleAddQuote = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const newQuote: Quote = {
      id: `q-${Date.now()}`,
      created_at: new Date().toISOString(),
      created_by: null,
      arabic,
      english,
      source,
      active: true,
    };

    try {
      const supabase = createClient() as any;
      const {
        data: { user },
      } = await supabase.auth.getUser();

      await supabase.from("quotes").insert({
        arabic,
        english,
        source,
        active: true,
        created_by: user ? user.id : null,
      });
    } catch {
      // Local state update
    }

    setQuotes([newQuote, ...quotes]);
    setArabic("");
    setEnglish("");
    setSource("");
    setShowAddForm(false);
    setLoading(false);
    setNotice("New quotation added successfully.");
    setTimeout(() => setNotice(null), 3000);
  };

  return (
    <Card className="rounded-[14px] border-border bg-white shadow-sm overflow-hidden">
      <CardContent className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <QuoteIcon className="w-4 h-4 text-primary" />
            <div>
              <h3 className="font-serif text-sm font-semibold text-foreground">
                Sanctuary Quotations
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Wisdom & Kindness rotating cards
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="h-8 text-xs rounded-[8px] bg-primary text-primary-foreground flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Quote</span>
          </Button>
        </div>

        {notice && (
          <div className="p-2.5 rounded-lg bg-primary/10 text-primary text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{notice}</span>
          </div>
        )}

        {/* Add Quote Inline Form */}
        {showAddForm && (
          <form
            onSubmit={handleAddQuote}
            className="p-3.5 rounded-xl bg-sahn-bg border border-border flex flex-col gap-3 animate-in fade-in"
          >
            <span className="text-xs font-semibold text-foreground">
              New Verified Quotation
            </span>

            <div className="flex flex-col gap-1">
              <Label className="text-xs">Arabic Text (Amiri Font)</Label>
              <Textarea
                dir="rtl"
                required
                rows={2}
                value={arabic}
                onChange={(e) => setArabic(e.target.value)}
                placeholder="النص العربي مع التشكيل..."
                className="font-arabic text-sm rounded-[8px] bg-white"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs">English Translation</Label>
              <Textarea
                required
                rows={2}
                value={english}
                onChange={(e) => setEnglish(e.target.value)}
                placeholder="Accurate, graceful English translation..."
                className="text-xs rounded-[8px] bg-white font-serif"
              />
            </div>

            <div className="flex flex-col gap-1">
              <Label className="text-xs">Classical Source Citation</Label>
              <Input
                required
                value={source}
                onChange={(e) => setSource(e.target.value)}
                placeholder="e.g. Sahih al-Bukhari 69, or Al-Hikam #26"
                className="h-9 text-xs rounded-[8px] bg-white font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 mt-1">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setShowAddForm(false)}
                className="h-8 text-xs rounded-[8px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                size="sm"
                className="h-8 text-xs rounded-[8px] bg-primary text-primary-foreground"
              >
                {loading ? "Saving..." : "Save Quote"}
              </Button>
            </div>
          </form>
        )}

        {/* Quotations List */}
        <div className="flex flex-col gap-2.5">
          {quotes.map((q) => (
            <div
              key={q.id}
              className={`p-3 rounded-xl border flex flex-col gap-1.5 transition-all ${
                q.active
                  ? "bg-white border-border"
                  : "bg-sahn-bg/50 border-dashed border-border/80 opacity-70"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-primary font-medium">
                  {q.source}
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleActive(q.id, q.active)}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                >
                  {q.active ? (
                    <span className="text-primary font-medium flex items-center gap-1">
                      <ToggleRight className="w-5 h-5 text-primary" /> Active
                    </span>
                  ) : (
                    <span className="text-muted-foreground flex items-center gap-1">
                      <ToggleLeft className="w-5 h-5" /> Inactive
                    </span>
                  )}
                </button>
              </div>

              <p className="font-arabic text-sm text-foreground" dir="rtl">
                {q.arabic}
              </p>
              <p className="font-serif text-xs text-muted-foreground italic">
                "{q.english}"
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
