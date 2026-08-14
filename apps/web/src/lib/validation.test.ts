import { describe, expect, it } from "vitest";

import { serverErrorMessage, serverFieldErrors } from "./validation";

const laravel422 = {
  message: "The given data was invalid.",
  errors: {
    paidOn: ["La date ne peut pas être dans le futur."],
    amount: ["Le montant doit être positif.", "Un second message ignoré."],
  },
};

describe("serverFieldErrors", () => {
  it("maps each field to its first message", () => {
    expect(serverFieldErrors(laravel422)).toEqual({
      paidOn: { message: "La date ne peut pas être dans le futur." },
      amount: { message: "Le montant doit être positif." },
    });
  });

  it.each([
    ["a network failure", new TypeError("fetch failed")],
    ["a bare 409 body", { message: "Conflit." }],
    ["null", null],
    ["a string", "boom"],
    ["errors that are not arrays", { errors: { paidOn: "pas un tableau" } }],
    ["an empty errors bag", { errors: {} }],
  ])("returns null for %s", (_label, error) => {
    expect(serverFieldErrors(error)).toBeNull();
  });
});

describe("serverErrorMessage", () => {
  it("surfaces the first field message of a 422 verbatim", () => {
    expect(serverErrorMessage(laravel422, "Échec.")).toBe(
      "La date ne peut pas être dans le futur.",
    );
  });

  it("surfaces a bare message body verbatim", () => {
    expect(serverErrorMessage({ message: "Conflit." }, "Échec.")).toBe(
      "Conflit.",
    );
  });

  it("falls back when the error carries no usable message", () => {
    expect(serverErrorMessage(new TypeError("fetch failed"), "Échec.")).toBe(
      "fetch failed",
    );
    expect(serverErrorMessage(null, "Échec.")).toBe("Échec.");
    expect(serverErrorMessage({ message: 42 }, "Échec.")).toBe("Échec.");
  });
});
