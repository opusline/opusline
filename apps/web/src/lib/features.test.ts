import { isRedirect } from "@tanstack/react-router";
import { expect, it } from "vitest";

import { hasFeature, INVOICING, requireInvoicing } from "./features";

it("reads a feature off the account's flags", () => {
  expect(hasFeature({ features: [INVOICING] }, INVOICING)).toBe(true);
  expect(hasFeature({ features: [] }, INVOICING)).toBe(false);
});

it("sends an account without the beta back to the ledger", () => {
  let thrown: unknown;

  try {
    requireInvoicing({ features: [] });
  } catch (error) {
    thrown = error;
  }

  expect(isRedirect(thrown)).toBe(true);
  expect(() => requireInvoicing({ features: [INVOICING] })).not.toThrow();
});
