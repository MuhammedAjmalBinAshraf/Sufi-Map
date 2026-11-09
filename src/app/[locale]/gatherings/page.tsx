import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { BottomNav } from "@/components/navigation/BottomNav";
import { DesktopHeader } from "@/components/navigation/DesktopHeader";
import { LocaleSwitcher } from "@/components/common/LocaleSwitcher";
import { SAMPLE_GATHERINGS, SAMPLE_PERSONS } from "@/lib/sample-data";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, ChevronRight } from "lucide-react";

export default async function GatheringsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations();

  let gatherings = SAMPLE_GATHERINGS;
  let persons = SAMPLE_PERSONS;

  try {
    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      const supabase = createClient();
      const { data: gData } = await supabase
        .from("gatherings")
        .select("*")
        .eq("status", "approved");
      if (gData && gData.length > 0) gatherings = gData as any;

      const { data: pData } = await supabase
        .from("persons")
        .select("*")
        .eq("status", "approved");
      if (pData && pData.length > 0) persons = pData as any;
    }
  } catch {
    // Ignored
  }

  return (
    <div className="min-h-screen bg-sahn-bg pb-24 md:pb-12">
      {/* Desktop Header */}
      <DesktopHeader />

      {/* Mobile Top Floating App Bar */}
      <header className="md:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-border px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <Users className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-lg font-semibold text-foreground leading-none">
                {t("gatherings.title")}
              </h1>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                {t("gatherings.subtitle")}
              </p>
            </div>
          </div>
          <LocaleSwitcher />
        </div>
      </header>

      {/* Desktop Title Banner */}
      <div className="hidden md:block max-w-5xl mx-auto px-6 pt-8 pb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold text-foreground">
              {t("gatherings.title")}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {t("gatherings.subtitle")}
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 md:px-6 pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {gatherings.map((gathering) => {
          const person = persons.find((p) => p.id === gathering.person_id);
          const title =
            locale === "ml"
              ? gathering.title_ml
              : locale === "ar"
              ? gathering.title_ar
              : gathering.title_en;
          const venue =
            locale === "ml"
              ? gathering.venue_name_ml
              : locale === "ar"
              ? gathering.venue_name_ar
              : gathering.venue_name_en;
          const schedule =
            locale === "ml"
              ? gathering.schedule_ml
              : locale === "ar"
              ? gathering.schedule_ar
              : gathering.schedule_en;
          const personName = person
            ? locale === "ml"
              ? person.name_ml
              : locale === "ar"
              ? person.name_ar
              : person.name_en
            : null;

          return (
            <Card
              key={gathering.id}
              className="rounded-[14px] border-border bg-white shadow-sm overflow-hidden flex flex-col justify-between"
            >
              <CardContent className="p-5 flex flex-col h-full justify-between gap-3">
                <div>
                  <Badge
                    variant="secondary"
                    className="bg-primary/10 text-primary border-transparent text-[10px] uppercase font-semibold px-2.5 py-0.5 rounded-full mb-2"
                  >
                    Majlis / Halqa
                  </Badge>
                  <h2 className="font-serif text-base font-semibold text-foreground leading-snug">
                    {title}
                  </h2>

                  {person && (
                    <Link
                      href={`/persons/${person.id}`}
                      className="inline-flex items-center gap-1.5 mt-2.5 text-xs text-primary font-medium hover:underline"
                    >
                      <span>With {personName}</span>
                      <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </Link>
                  )}
                </div>

                <div className="flex flex-col gap-1.5 pt-3 border-t border-border/60">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="line-clamp-1">{venue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-primary font-medium">
                    <Calendar className="w-3.5 h-3.5 shrink-0" />
                    <span>{schedule}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </main>

      <BottomNav />
    </div>
  );
}
