import { Link } from "@tanstack/react-router";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LanguageToggle } from "@/components/sufi/LanguageToggle";
import { useI18n } from "@/lib/i18n";
import {
  QUOTE_MODES,
  QUOTE_RETURN_OPTIONS,
  usePreferences,
  type QuoteMode,
  type QuoteReturnSeconds,
} from "@/lib/preferences";

export function SettingsSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { t, dir } = useI18n();
  const { prefs, update } = usePreferences();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={dir === "rtl" ? "left" : "right"} className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="text-2xl">{t("settings")}</SheetTitle>
          <SheetDescription>{t("settingsIntro")}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <section className="space-y-3 rounded-[14px] border bg-card p-4">
            <h3 className="text-base">{t("language")}</h3>
            <LanguageToggle />
          </section>

          <section className="space-y-3 rounded-[14px] border bg-card p-4">
            <div>
              <h3 className="text-base">{t("quoteLabel")}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t("quoteSettingHint")}</p>
            </div>
            <RadioGroup
              value={prefs.quoteMode}
              onValueChange={(v) => update({ quoteMode: v as QuoteMode })}
              aria-label={t("quoteLabel")}
            >
              {QUOTE_MODES.map((mode) => (
                <Label
                  key={mode}
                  htmlFor={`quote-mode-${mode}`}
                  className="flex cursor-pointer items-center gap-3 rounded-[14px] border p-3 font-normal transition-colors duration-200 has-[[data-state=checked]]:border-primary/50 has-[[data-state=checked]]:bg-accent"
                >
                  <RadioGroupItem id={`quote-mode-${mode}`} value={mode} />
                  {t(`quoteMode.${mode}`)}
                </Label>
              ))}
            </RadioGroup>

            {prefs.quoteMode === "explore" && (
              <div className="space-y-2 pt-1">
                <p className="text-sm font-medium">{t("quoteReturn")}</p>
                <ToggleGroup
                  type="single"
                  size="sm"
                  value={String(prefs.quoteReturnSeconds)}
                  onValueChange={(v) => v && update({ quoteReturnSeconds: Number(v) as QuoteReturnSeconds })}
                  aria-label={t("quoteReturn")}
                  className="justify-start rounded-[14px] border bg-accent p-0.5"
                >
                  {QUOTE_RETURN_OPTIONS.map((s) => (
                    <ToggleGroupItem
                      key={s}
                      value={String(s)}
                      className="h-7 min-w-12 px-2 text-xs data-[state=on]:bg-card data-[state=on]:text-primary data-[state=on]:shadow-sm"
                    >
                      {t("seconds", { n: s })}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </div>
            )}
          </section>

          {/* Legal / Google Verification Links */}
          <section className="space-y-2 border-t pt-5 text-xs text-muted-foreground">
            <p className="font-mono uppercase tracking-wider text-[10px]">Legal & Policies</p>
            <div className="flex items-center gap-4">
              <Link to="/privacy" onClick={() => onOpenChange(false)} className="text-primary hover:underline">
                Privacy Policy
              </Link>
              <span>·</span>
              <Link to="/terms" onClick={() => onOpenChange(false)} className="text-primary hover:underline">
                Terms of Service
              </Link>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
