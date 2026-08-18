import { expect, it } from "vitest";

import type { ClientFormValues } from "./client-form";
import { clientVatRateValidator, toClientPayload } from "./client-form";

const values: ClientFormValues = {
  name: "Vesterhus",
  type: 0,
  siret: "",
  vatNumber: "",
  defaultVatRate: "",
  billingAddressLine1: "",
  billingAddressLine2: "",
  billingPostalCode: "",
  billingCity: "",
  billingCountry: "",
  billingContactName: "",
  billingEmail: "",
  color: 0,
  paymentTermsDays: 45,
};

it("blocks the drafts the payload would read as following the account", () => {
  const validate = clientVatRateValidator("fr-FR");

  expect(validate({ value: "beaucoup" })).toEqual({
    message: expect.any(String),
  });
  expect(validate({ value: "101" })).toEqual({ message: expect.any(String) });
});

it("lets an empty rate through, since that is the usual answer", () => {
  const validate = clientVatRateValidator("fr-FR");

  expect(validate({ value: "" })).toBeUndefined();
  expect(validate({ value: "0" })).toBeUndefined();
  expect(validate({ value: "5,5" })).toBeUndefined();
});

it("keeps a client billed at zero apart from one that follows the account", () => {
  expect(
    toClientPayload({ ...values, defaultVatRate: "0" }, "fr-FR")
      .defaultVatRateBp,
  ).toBe(0);
  expect(toClientPayload(values, "fr-FR").defaultVatRateBp).toBeNull();
});

it("reads the rate in the user's own notation", () => {
  expect(
    toClientPayload({ ...values, defaultVatRate: "5,5" }, "fr-FR")
      .defaultVatRateBp,
  ).toBe(550);
});
