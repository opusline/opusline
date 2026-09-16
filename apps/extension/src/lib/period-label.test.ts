import { describe, expect, it } from "vitest";

import { periodLabel } from "./period-label";

describe("periodLabel", () => {
  it("names a month in the given language", () => {
    expect(periodLabel("2026-07", "fr")).toBe("juillet 2026");
    expect(periodLabel("2026-07", "en")).toBe("July 2026");
  });

  it("hands a quarter to the catalog", () => {
    expect(periodLabel("2026-Q2", "fr")).toBe("quarter_label(2|2026)");
  });
});
