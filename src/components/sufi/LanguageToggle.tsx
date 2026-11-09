import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LANGS, useI18n } from "@/lib/i18n";
import type { Lang } from "@/lib/sites";

export function LanguageToggle() {
  const { lang, setLang, t } = useI18n();
  return (
    <ToggleGroup
      type="single"
      size="sm"
      value={lang}
      onValueChange={(v) => v && setLang(v as Lang)}
      aria-label={t("language")}
      className="rounded-[14px] border bg-accent p-0.5"
    >
      {LANGS.map((l) => (
        <ToggleGroupItem
          key={l.id}
          value={l.id}
          className="h-7 min-w-9 px-2 text-xs data-[state=on]:bg-card data-[state=on]:text-primary data-[state=on]:shadow-sm"
        >
          {l.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
