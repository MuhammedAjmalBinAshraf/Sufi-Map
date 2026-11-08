"use client";

import React, { useState, useEffect } from "react";
import { Database } from "@/types/database";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Quote as QuoteIcon, Sparkles } from "lucide-react";

type Quote = Database["public"]["Tables"]["quotes"]["Row"];

interface RotatingQuoteProps {
  quotes: Quote[];
  className?: string;
}

export function RotatingQuote({ quotes, className = "" }: RotatingQuoteProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (quotes.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % quotes.length);
    }, 9000);

    return () => clearInterval(timer);
  }, [quotes.length, isPaused]);

  if (!quotes || quotes.length === 0) return null;

  const current = quotes[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? quotes.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % quotes.length);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative bg-white rounded-[14px] border border-border p-5 shadow-sm overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Decorative background watermark */}
      <QuoteIcon className="absolute -bottom-3 -right-3 w-20 h-20 text-primary/5 pointer-events-none select-none" />

      {/* Top Header Row with Indicator & Controls */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-primary">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Wisdom & Kindness</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handlePrev}
            aria-label="Previous quote"
            className="w-6 h-6 rounded-full hover:bg-sahn-bg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
          <span className="text-[10px] font-mono text-muted-foreground">
            {currentIndex + 1}/{quotes.length}
          </span>
          <button
            onClick={handleNext}
            aria-label="Next quote"
            className="w-6 h-6 rounded-full hover:bg-sahn-bg flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5 rtl:rotate-180" />
          </button>
        </div>
      </div>

      {/* Arabic Script */}
      <p
        className="font-arabic text-base sm:text-lg text-foreground text-center leading-relaxed tracking-normal"
        dir="rtl"
      >
        {current.arabic}
      </p>

      {/* English Translation */}
      <p className="font-serif text-xs text-muted-foreground text-center mt-2.5 leading-relaxed italic">
        "{current.english}"
      </p>

      {/* Source Attribution */}
      <div className="mt-2 text-center">
        <span className="inline-block text-[11px] font-mono text-primary/90 font-medium">
          — {current.source}
        </span>
      </div>
    </div>
  );
}
