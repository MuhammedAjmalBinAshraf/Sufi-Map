import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Award, Plus } from "lucide-react";

import { BadgesSheet } from "@/components/sufi/BadgesSheet";
import { LanguageToggle } from "@/components/sufi/LanguageToggle";
import { MobileSheet } from "@/components/sufi/MobileSheet";
import { QuoteBanner } from "@/components/sufi/QuoteBanner";
import { SanctuaryMap } from "@/components/sufi/SanctuaryMap";
import { SiteDetail } from "@/components/sufi/SiteDetail";
import { SiteFilters, SiteList } from "@/components/sufi/SiteList";
import { SubmitDialog } from "@/components/sufi/SubmitDialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { filterSites, SITES, type SiteKind } from "@/lib/sites";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sufi Map — Dargahs, Maqams & Gatherings of Kerala" },
      {
        name: "description",
        content: "A calm map of Sufi dargahs, maqams, zawiyas and gatherings across Kerala, cared for by humble stewards.",
      },
      { property: "og:title", content: "Sufi Map — Sanctuaries of remembrance in Kerala" },
      {
        property: "og:description",
        content: "Find dargahs, maqams, zawiyas and gatherings across Kerala, in English, Malayalam and Arabic.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const { t, dir } = useI18n();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<SiteKind | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [badgesOpen, setBadgesOpen] = useState(false);
  const [sheetExpanded, setSheetExpanded] = useState(false);

  const sites = useMemo(() => filterSites(SITES, query, kind), [query, kind]);
  const selected = SITES.find((s) => s.id === selectedId) ?? null;

  const select = (id: string) => {
    setSelectedId(id);
    setSheetExpanded(false);
  };

  const actions = (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={() => setBadgesOpen(true)} aria-label={t("badges")}>
        <Award aria-hidden />
      </Button>
      <Button onClick={() => setSubmitOpen(true)}>
        <Plus aria-hidden />
        {t("contribute")}
      </Button>
    </div>
  );

  const body = selected ? (
    <SiteDetail site={selected} onBack={() => setSelectedId(null)} />
  ) : (
    <SiteList sites={sites} onSelect={select} />
  );
  const filters = !selected && (
    <SiteFilters query={query} onQueryChange={setQuery} kind={kind} onKindChange={setKind} />
  );

  return (
    <div dir={dir} className="flex h-dvh w-full overflow-hidden bg-background">
      {/* Desktop: docked sanctuary sidebar */}
      <aside className="hidden w-[420px] shrink-0 flex-col border-e bg-background md:flex">
        <header className="space-y-4 border-b p-6 pb-5">
          <div className="flex items-start justify-between gap-3">
            <Brand />
            <LanguageToggle />
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm text-muted-foreground">{t("tagline")}</p>
          </div>
          {actions}
        </header>
        {filters && <div className="border-b p-6 py-4">{filters}</div>}
        <div className="min-h-0 flex-1 overflow-y-auto p-6 pt-4">{body}</div>
      </aside>

      {/* Map */}
      <main className="relative min-w-0 flex-1">
        <SanctuaryMap sites={sites} selectedId={selectedId} onSelect={select} />

        {/* Mobile: floating header */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 space-y-2 p-3 md:hidden">
          <div className="pointer-events-auto flex items-center justify-between gap-2 rounded-[14px] border bg-card/95 p-2 ps-3 shadow-float backdrop-blur">
            <Brand compact />
            <div className="flex items-center gap-1.5">
              <LanguageToggle />
              <Button variant="outline" size="icon" onClick={() => setBadgesOpen(true)} aria-label={t("badges")}>
                <Award aria-hidden />
              </Button>
              <Button size="icon" onClick={() => setSubmitOpen(true)} aria-label={t("contribute")}>
                <Plus aria-hidden />
              </Button>
            </div>
          </div>
          <QuoteBanner className="pointer-events-auto" />
        </div>

        {/* Desktop: quote over the map */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden justify-center p-5 md:flex">
          <QuoteBanner className="pointer-events-auto w-full max-w-xl" />
        </div>
      </main>

      {/* Mobile: thumb-zone sheet */}
      <MobileSheet expanded={sheetExpanded} onExpandedChange={setSheetExpanded} header={filters}>
        {body}
      </MobileSheet>

      <SubmitDialog open={submitOpen} onOpenChange={setSubmitOpen} />
      <BadgesSheet open={badgesOpen} onOpenChange={setBadgesOpen} />
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="flex size-9 items-center justify-center rounded-[14px] bg-primary font-arabic-script text-base text-primary-foreground"
        aria-hidden
      >
        صوف
      </span>
      <h1 className={compact ? "text-lg" : "text-2xl"}>{t("appName")}</h1>
    </div>
  );
}
