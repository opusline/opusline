import { expect, it } from "vitest";

import { isPasswordConfirmationRequired } from "./password-confirmation";

it("recognises the 423 the API answers before a sensitive change", () => {
  expect(isPasswordConfirmationRequired({ status: 423 })).toBe(true);
  expect(isPasswordConfirmationRequired({ status: 422 })).toBe(false);
  expect(isPasswordConfirmationRequired(null)).toBe(false);
});
