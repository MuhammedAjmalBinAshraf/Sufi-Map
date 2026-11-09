"use client";

import React, { useState, useEffect } from "react";
import { Pause } from "lucide-react";
import { Database } from "@/types/database";

type Quote = Database["public"]["Tables"]["quotes"]["Row"];

interface RotatingQuoteProps {
  quotes: Quote[];
  className?: string;
}

const ROTATE_MS = 9000;

/**
 * Rotating sacred words — hover/focus pauses rotation.
 * Quotes crossfade with 700ms opacity transition.
 * Dot indicators expand to 24px when active.
 */
export function RotatingQuote({ quotes, className = "" }: RotatingQuoteProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (quotes.length <= 1 || paused) return;
    const timer = window.setInterval(
      () => setCurrentIndex((i) => (i + 1) % quotes.length),
      ROTATE_MS
    );
    return () => window.clearInterval(timer);
  }, [quotes.length, paused]);

  if (!quotes || quotes.length === 0) return null;

  return (
    <figure
      className={`relative rounded-[14px] border bg-card/95 px-5 py-4 shadow-float
        backdrop-blur transition-all duration-300 ease-out ${className}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      tabIndex={0}
      aria-roledescription="carousel"
      aria-label="Wisdom &amp; Kindness"
    >
      {/* Header row */}
      <div className="mb-3 flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        <span>Wisdom &amp; Kindness</span>
        <span
          className={`flex items-center gap-1 transition-opacity duration-250 ${
            paused ? "opacity-100" : "opacity-0"
          }`}
        >
          <Pause className="size-3" aria-hidden />
          Paused
        </span>
      </div>

      {/* Quote grid — all stacked, only active is visible */}
      <div className="grid">
        {quotes.map((q, i) => (
          <blockquote
            key={q.id ?? i}
            aria-hidden={i !== currentIndex}
            className={`col-start-1 row-start-1 transition-opacity duration-700 ease-in-out ${
              i === currentIndex
                ? "opacity-100"
                : "pointer-events-none opacity-0"
            }`}
          >
            <p
              dir="rtl"
              lang="ar"
              className="font-arabic-script text-xl text-foreground"
            >
              {q.arabic}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              &ldquo;{q.english}&rdquo;
            </p>
            <figcaption className="mt-2 text-xs font-medium text-primary">
              — {q.source}
            </figcaption>
          </blockquote>
        ))}
      </div>

      {/* Dot indicators */}
      {quotes.length > 1 && (
        <div className="mt-3 flex gap-1.5" aria-hidden>
          {quotes.map((q, i) => (
            <button
              key={q.id ?? i}
              type="button"
              tabIndex={-1}
              onClick={() => setCurrentIndex(i)}
              data-active={String(i === currentIndex)}
              className="quote-dot"
            />
          ))}
        </div>
      )}
    </figure>
  );
}
