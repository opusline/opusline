import { expect, it } from "vitest";

import type { ClientFormValues } from "./client-form";
import {
  clientVatRateValidator,
  parseClientVatRate,
  toClientPayload,
} from "./client-form";

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

it("leaves an untouched rate following the account", () => {
  expect(parseClientVatRate("fr-FR", "")).toBeNull();
  expect(parseClientVatRate("fr-FR", "   ")).toBeNull();
});

it("keeps a client billed at zero apart from one that follows the account", () => {
  expect(parseClientVatRate("fr-FR", "0")).toBe(0);
});

it("reads a rate in the user's own notation", () => {
  expect(parseClientVatRate("fr-FR", "5,5")).toBe(550);
  expect(parseClientVatRate("fr-FR", "20")).toBe(2000);
});

it("refuses a rate that is not one", () => {
  expect(parseClientVatRate("fr-FR", "beaucoup")).toBeNull();
  expect(parseClientVatRate("fr-FR", "101")).toBeNull();
});

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

it("carries the rate into the payload", () => {
  expect(
    toClientPayload({ ...values, defaultVatRate: "0" }, "fr-FR")
      .defaultVatRateBp,
  ).toBe(0);
  expect(toClientPayload(values, "fr-FR").defaultVatRateBp).toBeNull();
});
