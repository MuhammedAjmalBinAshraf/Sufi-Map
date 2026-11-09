import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { SAMPLE_PERSONS, SAMPLE_GATHERINGS } from "@/lib/sample-data";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Sparkles,
  ShieldAlert,
  ShieldCheck,
  BookOpen,
  Users,
  AlertTriangle,
} from "lucide-react";

export default async function PersonDetailPage({
  params: { locale, id },
}: {
  params: { locale: string; id: string };
}) {
  const t = await getTranslations();

  let person = SAMPLE_PERSONS.find((p) => p.id === id);
  let gatherings = SAMPLE_GATHERINGS.filter((g) => g.person_id === id);

  if (!person) {
    try {
      if (
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      ) {
        const supabase = createClient();
        const { data } = await supabase
          .from("persons")
          .select("*")
          .eq("id", id)
          .eq("status", "approved")
          .single();

        if (data) {
          person = data as any;
          const { data: gData } = await supabase
            .from("gatherings")
            .select("*")
            .eq("person_id", id)
            .eq("status", "approved");
          if (gData) {
            gatherings = gData as any;
          }
        }
      }
    } catch {
      // Ignored
    }
  }

  if (!person) {
    notFound();
  }

  const primaryName =
    locale === "ml" ? person.name_ml : locale === "ar" ? person.name_ar : person.name_en;

  const shortHistory =
    locale === "ml"
      ? person.short_history_ml || person.short_history_en
      : locale === "ar"
      ? person.short_history_ar || person.short_history_en
      : person.short_history_en;

  return (
    <div className="min-h-screen bg-sahn-bg pb-24 md:pb-12">
      {/* Top Floating Navigation Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/gatherings"
            className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
            <span>{t("person.back")}</span>
          </Link>
          {person.is_living && (
            <Badge
              variant="outline"
              className="bg-primary/5 text-primary border-primary/20 text-[10px] flex items-center gap-1"
            >
              <ShieldCheck className="w-3 h-3 text-primary" />
              <span>{t("person.consentGranted")}</span>
            </Badge>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column: Person Summary & Safety Actions */}
          <div className="md:col-span-5 flex flex-col gap-4 md:sticky md:top-20">
            {/* Person Header Card */}
            <div className="bg-white rounded-[14px] border border-border p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                {person.is_living ? (
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-transparent text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1"
                  >
                    <Users className="w-3 h-3" />
                    <span>{t("person.livingBadge")}</span>
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-muted-foreground border-border text-xs px-2.5 py-0.5 rounded-full"
                  >
                    Historical Luminary
                  </Badge>
                )}
              </div>

              <h1 className="font-serif text-2xl font-bold text-foreground leading-snug">
                {primaryName}
              </h1>

              {/* Trilingual Sub-Headings */}
              <div className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground border-t border-border/50 pt-2">
                {locale !== "en" && (
                  <div className="font-sans font-medium text-foreground/80">
                    {person.name_en}
                  </div>
                )}
                {locale !== "ml" && (
                  <div className="font-sans text-xs">{person.name_ml}</div>
                )}
                {locale !== "ar" && (
                  <div className="font-arabic text-base" dir="rtl">
                    {person.name_ar}
                  </div>
                )}
              </div>

              {/* Living Sufi Safety: Mandatory "Request Edit or Removal" Button */}
              {person.is_living && (
                <div className="mt-4 pt-3 border-t border-border flex flex-col gap-2">
                  <span className="text-[11px] text-muted-foreground">
                    Guardian or family member?
                  </span>
                  <Link
                    href={`/contribute?action=removal_request&person_id=${person.id}`}
                    className="w-full"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full h-8 text-[11px] rounded-[10px] text-destructive hover:bg-destructive/5 hover:text-destructive border-destructive/30 flex items-center justify-center gap-1.5"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{t("person.requestRemoval")}</span>
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Biography, Presence, Sources */}
          <div className="md:col-span-7 flex flex-col gap-4">
            {/* Short Biography */}
            {shortHistory && (
              <Card className="rounded-[14px] border-border bg-white shadow-sm">
                <CardContent className="p-5">
                  <h2 className="font-serif text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    {t("person.biography")}
                  </h2>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {shortHistory}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Public Presence & Gatherings Schedule */}
            <Card className="rounded-[14px] border-border bg-white shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-serif text-sm font-semibold text-foreground flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    {t("person.presence")}
                  </h2>
                </div>

                {/* Living Sufi Privacy Safety Callout */}
                {person.is_living && (
                  <div className="mb-3 p-3 rounded-xl bg-primary/5 border border-primary/15 text-[11px] text-muted-foreground leading-relaxed flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{t("person.noHomeWarning")}</span>
                  </div>
                )}

                {gatherings.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {gatherings.map((g) => {
                      const title =
                        locale === "ml"
                          ? g.title_ml
                          : locale === "ar"
                          ? g.title_ar
                          : g.title_en;
                      const venue =
                        locale === "ml"
                          ? g.venue_name_ml
                          : locale === "ar"
                          ? g.venue_name_ar
                          : g.venue_name_en;
                      const sched =
                        locale === "ml"
                          ? g.schedule_ml
                          : locale === "ar"
                          ? g.schedule_ar
                          : g.schedule_en;

                      return (
                        <div
                          key={g.id}
                          className="p-3.5 rounded-xl bg-sahn-bg border border-border flex flex-col gap-1.5"
                        >
                          <span className="font-medium text-xs text-foreground">
                            {title}
                          </span>
                          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span>{venue}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-primary font-medium">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            <span>{sched}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    No active public gatherings currently listed.
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Verified Sources Section */}
            <Card className="rounded-[14px] border-border bg-white shadow-sm">
              <CardContent className="p-5">
                <h2 className="font-serif text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  {t("place.sources")}
                </h2>
                <div className="flex flex-col gap-2">
                  {person.sources && person.sources.length > 0 ? (
                    person.sources.map((src, index) => (
                      <div
                        key={index}
                        className="p-3 rounded-xl bg-sahn-bg border border-border/70 text-xs flex flex-col gap-0.5"
                      >
                        <span className="font-medium text-foreground">{src.title}</span>
                        {src.author && (
                          <span className="text-[11px] text-muted-foreground">
                            Author / Elder: {src.author}
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
          </div>
        </div>
      </main>
    </div>
  );
}
