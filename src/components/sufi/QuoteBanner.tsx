import { useEffect, useState } from "react";
import { Pause } from "lucide-react";

import { useI18n } from "@/lib/i18n";
import { QUOTES } from "@/lib/quotes";
import { cn } from "@/lib/utils";

const ROTATE_MS = 9000;

/** Rotating sacred words; hovering or focusing pauses the rotation. */
export function QuoteBanner({ className }: { className?: string }) {
  const { lang, t, pick } = useI18n();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => setIndex((i) => (i + 1) % QUOTES.length), ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <figure
      className={cn("relative rounded-[14px] border bg-card/95 px-5 py-4 shadow-float backdrop-blur", className)}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label={t("quoteLabel")}
    >
      <div className="mb-2 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        <span>{t("quoteLabel")}</span>
        <span className={cn("flex items-center gap-1 transition-opacity duration-250 ease-out", paused ? "opacity-100" : "opacity-0")}>
          <Pause className="size-3" aria-hidden />
          {t("quotePaused")}
        </span>
      </div>
      <div className="grid">
        {QUOTES.map((q, i) => (
          <blockquote
            key={q.id}
            aria-hidden={i !== index}
            className={cn(
              "col-start-1 row-start-1 transition-opacity duration-700 ease-in-out",
              i === index ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <p dir="rtl" lang="ar" className="font-arabic-script text-xl text-foreground">
              {q.arabic}
            </p>
            {lang !== "ar" && (
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{q.translation[lang]}</p>
            )}
            <figcaption className="mt-2 text-xs font-medium text-primary">{pick(q.source)}</figcaption>
          </blockquote>
        ))}
      </div>
      <div className="mt-3 flex gap-1.5" aria-hidden>
        {QUOTES.map((q, i) => (
          <button
            key={q.id}
            type="button"
            tabIndex={-1}
            onClick={() => setIndex(i)}
            className={cn(
              "h-1 cursor-pointer rounded-full transition-all duration-250 ease-out",
              i === index ? "w-6 bg-primary" : "w-2 bg-border hover:bg-muted-foreground",
            )}
          />
        ))}
      </div>
    </figure>
  );
}
