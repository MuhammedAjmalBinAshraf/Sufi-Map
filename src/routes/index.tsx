import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Award, MoonStar, PanelLeftClose, PanelLeftOpen, Plus, Settings } from "lucide-react";

import { BadgesSheet } from "@/components/sufi/BadgesSheet";
import { LanguageToggle } from "@/components/sufi/LanguageToggle";
import { MobileSheet } from "@/components/sufi/MobileSheet";
import { QuoteBanner } from "@/components/sufi/QuoteBanner";
import { SanctuaryMap } from "@/components/sufi/SanctuaryMap";
import { SettingsSheet } from "@/components/sufi/SettingsSheet";
import { SiteDetail } from "@/components/sufi/SiteDetail";
import { SiteFilters, SiteList } from "@/components/sufi/SiteList";
import { SubmitDialog } from "@/components/sufi/SubmitDialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { shouldShowQuote, usePreferences } from "@/lib/preferences";
import type { SheetSnap } from "@/lib/sheet";
import { cn } from "@/lib/utils";
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
  const { t, lang } = useI18n();
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<SiteKind | "all">("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [badgesOpen, setBadgesOpen] = useState(false);
  const [sheetSnap, setSheetSnap] = useState<SheetSnap>("half");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { prefs } = usePreferences();

  // The quote steps aside while the visitor moves the map, and returns after a quiet pause.
  const [exploring, setExploring] = useState(false);
  const returnTimer = useRef<number | undefined>(undefined);
  const onExploreChange = useCallback(
    (on: boolean) => {
      window.clearTimeout(returnTimer.current);
      if (on) setExploring(true);
      else returnTimer.current = window.setTimeout(() => setExploring(false), prefs.quoteReturnSeconds * 1000);
    },
    [prefs.quoteReturnSeconds],
  );
  useEffect(() => () => window.clearTimeout(returnTimer.current), []);
  const quoteVisible = shouldShowQuote(prefs.quoteMode, exploring);

  const sites = useMemo(() => filterSites(SITES, query, kind), [query, kind]);
  const selected = SITES.find((s) => s.id === selectedId) ?? null;

  const select = (id: string) => {
    setSelectedId(id);
    setSheetSnap("half");
  };

  const actions = (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="icon" onClick={() => setSettingsOpen(true)} aria-label={t("settings")}>
        <Settings aria-hidden />
      </Button>
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
    <div className="flex h-dvh w-full overflow-hidden bg-background">
      {/* Desktop: docked sanctuary sidebar */}
      <aside
        inert={!sidebarOpen}
        className={cn(
          "hidden shrink-0 overflow-hidden bg-background transition-[width] duration-300 ease-out md:flex",
          sidebarOpen ? "w-[420px] border-e" : "w-0",
        )}
      >
        <div className="flex w-[420px] shrink-0 flex-col">
        <header className="space-y-4 border-b p-6 pb-5">
          <div className="flex items-start justify-between gap-2">
            <Brand />
            <div className="flex items-center gap-1.5">
              <LanguageToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                aria-label={t("collapseMenu")}
                title={t("collapseMenu")}
              >
                <PanelLeftClose className="rtl:-scale-x-100" aria-hidden />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{t("tagline")}</p>
          {actions}
        </header>
        {filters && <div className="border-b p-6 py-4">{filters}</div>}
        <div className="min-h-0 flex-1 overflow-y-auto p-6 pt-4">{body}</div>
        </div>
      </aside>

      {/* Map */}
      <main className="relative min-w-0 flex-1">
        <SanctuaryMap sites={sites} selectedId={selectedId} onSelect={select} onExploreChange={onExploreChange} />

        {/* Mobile: floating header */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 space-y-2 p-3 md:hidden">
          <div className="pointer-events-auto flex items-center justify-between gap-2 rounded-[14px] border bg-card/95 p-2 ps-3 shadow-float backdrop-blur">
            <Brand compact />
            <div className="flex items-center gap-1.5">
              <Button variant="outline" size="icon" onClick={() => setSettingsOpen(true)} aria-label={t("settings")}>
                <Settings aria-hidden />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setBadgesOpen(true)} aria-label={t("badges")}>
                <Award aria-hidden />
              </Button>
              <Button size="icon" onClick={() => setSubmitOpen(true)} aria-label={t("contribute")}>
                <Plus aria-hidden />
              </Button>
            </div>
          </div>
          <QuoteBanner visible={quoteVisible} />
        </div>

        {/* Desktop: bring the list back when it is tucked away */}
        {!sidebarOpen && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            aria-label={t("expandMenu")}
            title={t("expandMenu")}
            className="absolute start-5 top-5 z-20 hidden bg-card shadow-float md:inline-flex"
          >
            <PanelLeftOpen className="rtl:-scale-x-100" aria-hidden />
          </Button>
        )}

        {/* Desktop: quote over the map */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 hidden justify-center p-5 md:flex">
          <QuoteBanner visible={quoteVisible} className="w-full max-w-xl" />
        </div>
      </main>

      {/* Mobile: thumb-zone sheet */}
      <MobileSheet
        snap={sheetSnap}
        onSnapChange={setSheetSnap}
        peekLabel={selected ? selected.name[lang] : t("sheetPeek", { n: sites.length })}
        header={filters}
      >
        {body}
      </MobileSheet>

      <SubmitDialog open={submitOpen} onOpenChange={setSubmitOpen} />
      <BadgesSheet open={badgesOpen} onOpenChange={setBadgesOpen} />
      <SettingsSheet open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  );
}

function Brand({ compact = false }: { compact?: boolean }) {
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="flex size-9 items-center justify-center rounded-[14px] bg-primary text-primary-foreground"
        aria-hidden
      >
        <MoonStar className="size-4" />
      </span>
      <h1 className={compact ? "text-lg" : "text-2xl"}>{t("appName")}</h1>
    </div>
  );
}
