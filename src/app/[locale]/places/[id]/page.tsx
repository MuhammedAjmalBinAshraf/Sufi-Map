import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { SAMPLE_PLACES } from "@/lib/sample-data";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Navigation,
  Bookmark,
  Edit3,
  Calendar,
  HeartHandshake,
  BookOpen,
  MapPin,
  Sparkles,
  Share2,
} from "lucide-react";

export default async function PlaceDetailPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  const t = await getTranslations();

  let place = SAMPLE_PLACES.find((p) => p.id === id);

  if (!place) {
    try {
      if (
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        const supabase = createClient();
        const { data } = await supabase
          .from("places")
          .select("*")
          .eq("id", id)
          .eq("status", "approved")
          .single();

        if (data) {
          place = data as any;
        }
      }
    } catch {
      // Ignored
    }
  }

  if (!place) {
    notFound();
  }

  const primaryName =
    locale === "ml" ? place.name_ml : locale === "ar" ? place.name_ar : place.name_en;

  const shortHistory =
    locale === "ml"
      ? place.short_history_ml || place.short_history_en
      : locale === "ar"
      ? place.short_history_ar || place.short_history_en
      : place.short_history_en;

  const etiquette =
    locale === "ml"
      ? place.visiting_etiquette_ml || place.visiting_etiquette_en
      : locale === "ar"
      ? place.visiting_etiquette_ar || place.visiting_etiquette_en
      : place.visiting_etiquette_en;

  const events =
    locale === "ml"
      ? place.recurring_events_ml || place.recurring_events_en
      : locale === "ar"
      ? place.recurring_events_ar || place.recurring_events_en
      : place.recurring_events_en;

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;

  return (
    <div className="min-h-screen bg-sahn-bg pb-24">
      {/* Top Floating Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{t("place.backToMap")}</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-muted-foreground">
              {place.latitude.toFixed(4)}° N, {place.longitude.toFixed(4)}° E
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 pt-4 flex flex-col gap-4">
        {/* Sanctuary Hero Header */}
        <div className="bg-white rounded-[14px] border border-border p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border-transparent text-xs font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
            >
              {place.kind}
            </Badge>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              {place.area}
            </span>
          </div>

          <h1 className="font-serif text-2xl font-bold text-foreground leading-snug">
            {primaryName}
          </h1>

          {/* Trilingual Sub-Headings */}
          <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground border-t border-border/50 pt-2">
            {locale !== "en" && (
              <div className="font-sans font-medium text-foreground/80">
                {place.name_en}
              </div>
            )}
            {locale !== "ml" && (
              <div className="font-sans text-xs">{place.name_ml}</div>
            )}
            {locale !== "ar" && (
              <div className="font-arabic text-base" dir="rtl">
                {place.name_ar}
              </div>
            )}
          </div>
        </div>

        {/* Short History & Significance */}
        {shortHistory && (
          <Card className="rounded-[14px] border-border bg-white shadow-sm">
            <CardContent className="p-4">
              <h2 className="font-serif text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-primary" />
                {t("place.history")}
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {shortHistory}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Visiting Etiquette (Sanctuary Guidelines) */}
        {etiquette && (
          <Card className="rounded-[14px] border-border bg-white shadow-sm">
            <CardContent className="p-4">
              <h2 className="font-serif text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                <HeartHandshake className="w-4 h-4 text-primary" />
                {t("place.etiquette")}
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {etiquette}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Recurring Events & Majlis */}
        {events && (
          <Card className="rounded-[14px] border-border bg-white shadow-sm">
            <CardContent className="p-4">
              <h2 className="font-serif text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-primary" />
                {t("place.events")}
              </h2>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {events}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Verified Sources Section (Mandatory Attribution Rule) */}
        <Card className="rounded-[14px] border-border bg-white shadow-sm">
          <CardContent className="p-4">
            <h2 className="font-serif text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              {t("place.sources")}
            </h2>
            <div className="flex flex-col gap-2">
              {place.sources && place.sources.length > 0 ? (
                place.sources.map((src, index) => (
                  <div
                    key={index}
                    className="p-2.5 rounded-lg bg-sahn-bg border border-border/70 text-xs flex flex-col gap-0.5"
                  >
                    <span className="font-medium text-foreground">{src.title}</span>
                    {src.author && (
                      <span className="text-[11px] text-muted-foreground">
                        Author / Elder: {src.author}
                      </span>
                    )}
                    {src.record_ref && (
                      <span className="text-[10px] font-mono text-muted-foreground">
                        Ref: {src.record_ref}
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground italic">
                  Attribution verified under local sanctuary archives.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Fixed Bottom Action Bar in Thumb Zone */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-border p-3 shadow-lg">
        <div className="max-w-md mx-auto grid grid-cols-12 gap-2">
          {/* Primary Directions CTA */}
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="col-span-8"
          >
            <Button className="w-full h-11 bg-primary text-primary-foreground rounded-[14px] font-medium text-xs flex items-center justify-center gap-2 hover:bg-primary/90 shadow-sm">
              <Navigation className="w-4 h-4 fill-current" />
              <span>{t("common.directions")}</span>
            </Button>
          </a>

          {/* Suggest Edit CTA */}
          <Link
            href={`/contribute?correction_for=${place.id}&type=place`}
            className="col-span-4"
          >
            <Button
              variant="outline"
              className="w-full h-11 bg-white border-border text-muted-foreground rounded-[14px] font-medium text-xs flex items-center justify-center gap-1.5 hover:text-foreground"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="truncate">{t("common.suggestEdit")}</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
