"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useTransition } from "react";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: "en" | "ml" | "ar") => {
    if (newLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  const langs = [
    { id: "en", label: "EN" },
    { id: "ml", label: "മല" },
    { id: "ar", label: "عر" },
  ] as const;

  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className="inline-flex items-center rounded-[12px] border border-border bg-accent p-0.5 shadow-xs"
    >
      {langs.map((l) => {
        const isActive = locale === l.id;
        return (
          <button
            key={l.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => handleLocaleChange(l.id)}
            disabled={isPending}
            className={`h-7 min-w-8 px-2 text-xs font-medium transition-all duration-200 rounded-[10px] ${
              isActive
                ? "bg-white text-primary shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}
