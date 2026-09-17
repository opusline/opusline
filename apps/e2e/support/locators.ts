import type { Locator, Page } from "@playwright/test";

/**
 * A test id is a static literal, so it greps from the spec to the component;
 * whatever varies — a mission, a date, a reference — rides beside it in its own
 * data attribute: `byTestId(page, "week-cell", { mission: "callisto-front" })`
 * finds `data-testid="week-cell" data-mission="callisto-front"`.
 */
export function byTestId(
  root: Page | Locator,
  testId: string,
  data: Record<string, string | number> = {},
): Locator {
  const dataAttributes = Object.entries(data)
    .map(([name, value]) => `[data-${name}="${value}"]`)
    .join("");

  return root.locator(`[data-testid="${testId}"]${dataAttributes}`);
}
