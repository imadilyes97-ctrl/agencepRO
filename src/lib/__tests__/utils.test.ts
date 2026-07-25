import { describe, it, expect } from "vitest";
import { cn, formatDZD, generateRef, truncate } from "../utils";

describe("cn", () => {
  it("merges class names", () => {
    const result = cn("text-sm", "text-lg");
    expect(result).toBe("text-lg");
  });

  it("handles conditional classes", () => {
    const result = cn("base", false && "hidden", "extra");
    expect(result).toContain("base");
    expect(result).toContain("extra");
    expect(result).not.toContain("hidden");
  });
});

describe("formatDZD", () => {
  it("formats zero", () => {
    const result = formatDZD(0);
    expect(result).toContain("0");
  });

  it("formats a positive amount", () => {
    const result = formatDZD(15000);
    expect(result).toContain("15");
  });
});

describe("generateRef", () => {
  it("generates a reference with prefix and year", () => {
    const ref = generateRef("D", 1);
    expect(ref).toMatch(/^D-\d{4}-000001$/);
  });

  it("pads sequence to 6 digits", () => {
    const ref = generateRef("FAC", 42);
    expect(ref).toMatch(/^FAC-\d{4}-000042$/);
  });
});

describe("truncate", () => {
  it("returns full text if short enough", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("truncates with ellipsis", () => {
    expect(truncate("hello world", 5)).toBe("hell…");
  });

  it("returns empty string for empty input", () => {
    expect(truncate("", 10)).toBe("");
  });
});
