import { describe, expect, it } from "vitest";

import { formatFrenchPhone, formatSiret, formatVatNumber } from "./identifiers";

describe("formatSiret", () => {
  it("groups the SIREN then the NIC", () => {
    expect(formatSiret("12345678200002")).toBe("123 456 782 00002");
  });

  it("regroups one that was spaced by hand", () => {
    expect(formatSiret("123456782 00002")).toBe("123 456 782 00002");
  });

  it("leaves an incomplete one alone rather than half-grouping it", () => {
    expect(formatSiret("12345678")).toBe("12345678");
    expect(formatSiret("")).toBe("");
  });
});

describe("formatVatNumber", () => {
  it("splits the country and key from the SIREN", () => {
    expect(formatVatNumber("FR11123456782")).toBe("FR11 123456782");
  });

  it("upper-cases what it recognises", () => {
    expect(formatVatNumber("fr11 123456782")).toBe("FR11 123456782");
  });

  it("leaves another country's number to that country", () => {
    expect(formatVatNumber("DE123456789")).toBe("DE123456789");
  });
});

describe("formatFrenchPhone", () => {
  it("reads a national number in pairs", () => {
    expect(formatFrenchPhone("0123456789")).toBe("01 23 45 67 89");
  });

  it("keeps the international prefix on its own", () => {
    expect(formatFrenchPhone("+33123456789")).toBe("+33 1 23 45 67 89");
  });

  it("leaves a number it does not recognise alone", () => {
    expect(formatFrenchPhone("+1 555 0100")).toBe("+1 555 0100");
    expect(formatFrenchPhone("01 23 45")).toBe("01 23 45");
  });
});
