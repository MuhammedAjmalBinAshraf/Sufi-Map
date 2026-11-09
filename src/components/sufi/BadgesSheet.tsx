import { Check } from "lucide-react";

import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { BADGE_IDS, BADGES, badgeProgress } from "@/lib/badges";
import { useI18n } from "@/lib/i18n";
import { useSteward } from "@/lib/steward";
import { cn } from "@/lib/utils";

export function BadgesSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { t, dir } = useI18n();
  const { counts } = useSteward();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={dir === "rtl" ? "left" : "right"} className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl">{t("badges")}</SheetTitle>
          <SheetDescription>{t("badgesIntro")}</SheetDescription>
        </SheetHeader>
        <ul className="mt-6 space-y-3">
          {BADGE_IDS.map((id) => {
            const p = badgeProgress(id, counts);
            return (
              <li
                key={id}
                className={cn("card-lift rounded-[14px] border bg-card p-4", p.earned && "border-primary/40 bg-accent")}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "flex size-12 shrink-0 items-center justify-center rounded-[14px] border font-arabic-script text-lg",
                      p.earned ? "border-primary bg-primary text-primary-foreground" : "bg-accent text-primary",
                    )}
                    aria-hidden
                  >
                    {BADGES[id].arabic}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base">{t(`badge.${id}`)}</h3>
                      {p.earned ? (
                        <span className="flex items-center gap-1 text-xs font-medium text-primary">
                          <Check className="size-3.5" aria-hidden />
                          {t("earned")}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">{t("progress", { v: p.value, t: p.target })}</span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{t(`badge.${id}.desc`)}</p>
                  </div>
                </div>
                <Progress value={p.percent} className="mt-3 h-1.5 bg-border" aria-label={t(`badge.${id}`)} />
              </li>
            );
          })}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
