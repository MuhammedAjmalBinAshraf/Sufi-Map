import { describe, expect, it } from "vitest";

import { snapSheet, stepSheet } from "@/lib/sheet";

const VH = 800; // peek 64px, half 336px, full 656px

describe("mobile list sheet dragging", () => {
  it("rests at the slim peek when dragged down near the bottom, focusing the map", () => {
    expect(snapSheet(120, VH)).toBe("peek");
  });

  it("rests at half when released near the middle", () => {
    expect(snapSheet(360, VH)).toBe("half");
  });

  it("rests at full when released near the top", () => {
    expect(snapSheet(600, VH)).toBe("full");
  });

  it("a quick downward flick from half drops to the peek", () => {
    expect(snapSheet(300, VH, -1)).toBe("peek");
  });

  it("a quick upward flick from the peek opens to half", () => {
    expect(snapSheet(90, VH, 1)).toBe("half");
  });

  it("stepping down from peek stays at peek", () => {
    expect(stepSheet("peek", -1)).toBe("peek");
  });
});
