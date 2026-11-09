/** Mobile list sheet resting positions: a slim peek (map in focus), half, and full. */
export type SheetSnap = "peek" | "half" | "full";

export const SHEET_ORDER: SheetSnap[] = ["peek", "half", "full"];
export const PEEK_PX = 64;
const HALF_RATIO = 0.42;
const FULL_RATIO = 0.82;
/** Faster than this (px per ms) counts as a flick toward the next position. */
const FLICK_SPEED = 0.5;

export function sheetHeights(viewportHeight: number): Record<SheetSnap, number> {
  return { peek: PEEK_PX, half: viewportHeight * HALF_RATIO, full: viewportHeight * FULL_RATIO };
}

/**
 * Where the sheet should rest after a drag.
 * `velocity` is the change in sheet height per ms (positive = pulled up).
 */
export function snapSheet(height: number, viewportHeight: number, velocity = 0): SheetSnap {
  const heights = sheetHeights(viewportHeight);
  if (Math.abs(velocity) >= FLICK_SPEED) {
    const ahead = velocity > 0
      ? SHEET_ORDER.find((s) => heights[s] > height)
      : [...SHEET_ORDER].reverse().find((s) => heights[s] < height);
    return ahead ?? (velocity > 0 ? "full" : "peek");
  }
  return SHEET_ORDER.reduce((best, s) =>
    Math.abs(heights[s] - height) < Math.abs(heights[best] - height) ? s : best,
  );
}

/** Step one position up (+1) or down (-1), staying within peek..full. */
export function stepSheet(current: SheetSnap, direction: 1 | -1): SheetSnap {
  const i = SHEET_ORDER.indexOf(current) + direction;
  return SHEET_ORDER[Math.min(SHEET_ORDER.length - 1, Math.max(0, i))];
}
