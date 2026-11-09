"use client";

import React, { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { PEEK_PX, snapSheet, stepSheet, type SheetSnap } from "@/lib/sheet";
import { cn } from "@/lib/utils";

const SNAP_CLASS: Record<SheetSnap, string> = {
  peek: "h-16",
  half: "h-[42dvh]",
  full: "h-[82dvh]",
};

interface MobileSheetProps {
  snap: SheetSnap;
  onSnapChange: (v: SheetSnap) => void;
  peekLabel: ReactNode;
  header?: ReactNode;
  children: ReactNode;
}

/** Thumb-zone bottom sheet: drag the handle down to give the map focus, up to read the list. */
export function MobileSheet({
  snap,
  onSnapChange,
  peekLabel,
  header,
  children,
}: MobileSheetProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const drag = useRef<{
    startY: number;
    startH: number;
    lastH: number;
    lastT: number;
    v: number;
    moved: boolean;
  } | null>(null);
  const suppressClick = useRef(false);
  const [dragHeight, setDragHeight] = useState<number | null>(null);

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    const h = sectionRef.current?.getBoundingClientRect().height ?? 0;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      startY: e.clientY,
      startH: h,
      lastH: h,
      lastT: e.timeStamp,
      v: 0,
      moved: false,
    };
  };

  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d) return;
    if (!d.moved && Math.abs(e.clientY - d.startY) < 6) return;
    d.moved = true;
    const max = window.innerHeight * 0.92;
    const h = Math.min(max, Math.max(PEEK_PX, d.startH + (d.startY - e.clientY)));
    const dt = e.timeStamp - d.lastT;
    if (dt > 0) d.v = (h - d.lastH) / dt;
    d.lastH = h;
    d.lastT = e.timeStamp;
    setDragHeight(h);
  };

  const onPointerUp = (e: PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d?.moved) return;
    suppressClick.current = true;
    const v = e.timeStamp - d.lastT > 80 ? 0 : d.v;
    onSnapChange(snapSheet(d.lastH, window.innerHeight, v));
    setDragHeight(null);
  };

  const onClick = () => {
    if (suppressClick.current) {
      suppressClick.current = false;
      return;
    }
    onSnapChange(snap === "full" ? "half" : stepSheet(snap, 1));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    onSnapChange(stepSheet(snap, e.key === "ArrowUp" ? 1 : -1));
  };

  const dragging = dragHeight !== null;
  const peeking = snap === "peek" && !dragging;

  return (
    <section
      ref={sectionRef}
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 flex flex-col overflow-hidden rounded-t-[14px] border-t border-border bg-background shadow-float md:hidden",
        !dragging && "transition-[height] duration-300 ease-out",
        !dragging && SNAP_CLASS[snap],
      )}
      style={dragging ? { height: dragHeight } : undefined}
    >
      <button
        type="button"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClick={onClick}
        onKeyDown={onKeyDown}
        className="flex w-full shrink-0 cursor-grab touch-none select-none flex-col items-center gap-2 pb-2 pt-3 active:cursor-grabbing"
        aria-expanded={snap !== "peek"}
        aria-label="Drag down to focus the map, up to read the list"
      >
        <span className="h-1.5 w-10 rounded-full bg-border" />
        {peeking && (
          <span className="text-xs font-medium text-muted-foreground truncate px-4">
            {peekLabel}
          </span>
        )}
      </button>

      <div
        inert={peeking}
        className={cn(
          "flex min-h-0 flex-1 flex-col",
          peeking && "invisible"
        )}
      >
        {header && <div className="px-4 pb-3">{header}</div>}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {children}
        </div>
      </div>
    </section>
  );
}
