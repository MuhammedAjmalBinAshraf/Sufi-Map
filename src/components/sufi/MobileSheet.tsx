import type { ReactNode } from "react";

import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Thumb-zone bottom sheet: peeks over the map, expands to read the list. */
export function MobileSheet({
  expanded,
  onExpandedChange,
  header,
  children,
}: {
  expanded: boolean;
  onExpandedChange: (v: boolean) => void;
  header: ReactNode;
  children: ReactNode;
}) {
  const { t } = useI18n();
  return (
    <section
      className={cn(
        "fixed inset-x-0 bottom-0 z-20 flex flex-col rounded-t-[14px] border-t bg-background shadow-float transition-[height] duration-300 ease-out md:hidden",
        expanded ? "h-[82dvh]" : "h-[42dvh]",
      )}
    >
      <button
        type="button"
        onClick={() => onExpandedChange(!expanded)}
        className="flex w-full cursor-pointer justify-center pb-2 pt-3"
        aria-expanded={expanded}
        aria-label={expanded ? t("showMap") : t("showList")}
      >
        <span className="h-1.5 w-10 rounded-full bg-border" />
      </button>
      <div className="px-4 pb-3">{header}</div>
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{children}</div>
    </section>
  );
}
