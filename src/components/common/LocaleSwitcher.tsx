"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useTransition } from "react";
import { Globe } from "lucide-react";

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: "en" | "ml" | "ar") => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground bg-white/80 backdrop-blur-sm border border-border/80 rounded-full px-2 py-1 shadow-sm">
      <Globe className="w-3.5 h-3.5 text-primary" />
      <button
        onClick={() => handleLocaleChange("en")}
        disabled={isPending}
        className={`px-1.5 py-0.5 rounded-full transition-colors ${
          locale === "en"
            ? "bg-primary text-primary-foreground font-semibold"
            : "hover:text-foreground"
        }`}
      >
        EN
      </button>
      <span className="text-border">|</span>
      <button
        onClick={() => handleLocaleChange("ml")}
        disabled={isPending}
        className={`px-1.5 py-0.5 rounded-full transition-colors ${
          locale === "ml"
            ? "bg-primary text-primary-foreground font-semibold"
            : "hover:text-foreground"
        }`}
      >
        മല
      </button>
      <span className="text-border">|</span>
      <button
        onClick={() => handleLocaleChange("ar")}
        disabled={isPending}
        className={`px-1.5 py-0.5 rounded-full transition-colors ${
          locale === "ar"
            ? "bg-primary text-primary-foreground font-semibold"
            : "hover:text-foreground"
        }`}
      >
        عر
      </button>
    </div>
  );
}
