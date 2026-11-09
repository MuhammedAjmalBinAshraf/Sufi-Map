export interface StewardCounts {
  /** Distinct sanctuaries opened. */
  visited: string[];
  /** Sanctuaries kept as companions. */
  saved: string[];
  submissions: number;
  corrections: number;
}

export const EMPTY_COUNTS: StewardCounts = { visited: [], saved: [], submissions: 0, corrections: 0 };

export const BADGE_IDS = ["musafir", "rafeeq", "misbah", "hadiyya", "nazir"] as const;
export type BadgeId = (typeof BADGE_IDS)[number];

export const BADGES: Record<BadgeId, { arabic: string; target: number; measure: (c: StewardCounts) => number }> = {
  musafir: { arabic: "مسافر", target: 5, measure: (c) => c.visited.length },
  rafeeq: { arabic: "رفيق", target: 3, measure: (c) => c.saved.length },
  misbah: { arabic: "مصباح", target: 1, measure: (c) => c.submissions },
  hadiyya: { arabic: "هدية", target: 3, measure: (c) => c.submissions },
  nazir: { arabic: "ناظر", target: 2, measure: (c) => c.corrections },
};

export function badgeProgress(id: BadgeId, counts: StewardCounts) {
  const { target, measure } = BADGES[id];
  const value = Math.min(measure(counts), target);
  return { value, target, earned: value >= target, percent: Math.round((value / target) * 100) };
}
