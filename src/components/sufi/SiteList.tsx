import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useI18n } from "@/lib/i18n";
import { DISTRICTS, SITE_KINDS, type Site, type SiteKind } from "@/lib/sites";
import { useSteward } from "@/lib/steward";
import { cn } from "@/lib/utils";

import { KindBadge } from "./KindBadge";

interface SiteListProps {
  sites: Site[];
  query: string;
  onQueryChange: (q: string) => void;
  kind: SiteKind | "all";
  onKindChange: (k: SiteKind | "all") => void;
  onSelect: (id: string) => void;
}

export function SiteFilters({ query, onQueryChange, kind, onKindChange }: Omit<SiteListProps, "sites" | "onSelect">) {
  const { t } = useI18n();
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          type="search"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchPlaceholder")}
          className="h-11 bg-card ps-9 text-[16px] md:text-base"
        />
      </div>
      <ToggleGroup
        type="single"
        value={kind}
        onValueChange={(v) => onKindChange((v || "all") as SiteKind | "all")}
        className="flex-wrap justify-start gap-1.5"
      >
        {(["all", ...SITE_KINDS] as const).map((k) => (
          <ToggleGroupItem
            key={k}
            value={k}
            variant="outline"
            size="sm"
            className="h-8 bg-card px-3 text-xs transition-all duration-250 ease-out data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
          >
            {k === "all" ? t("filterAll") : t(`kind.${k}`)}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

export function SiteList({ sites, onSelect }: Pick<SiteListProps, "sites" | "onSelect">) {
  const { t, pick } = useI18n();
  const { counts } = useSteward();

  if (sites.length === 0) {
    return <p className="px-1 py-10 text-center text-sm text-muted-foreground">{t("noResults")}</p>;
  }

  return (
    <div>
      <p className="mb-2 px-1 text-xs font-medium text-muted-foreground">{t("resultsCount", { n: sites.length })}</p>
      <ul className="space-y-2.5">
        {sites.map((site) => (
          <li key={site.id}>
            <button
              type="button"
              onClick={() => onSelect(site.id)}
              className="card-lift w-full cursor-pointer rounded-[14px] border bg-card p-4 text-start hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-base leading-snug">{pick(site.name)}</h3>
                <KindBadge kind={site.kind} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {pick(DISTRICTS[site.district])}
                {site.schedule && <> · {pick(site.schedule)}</>}
              </p>
              <p className={cn("mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground")}>{pick(site.summary)}</p>
              {counts.saved.includes(site.id) && (
                <p className="mt-2 text-xs font-medium text-primary">{t("saved")}</p>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
