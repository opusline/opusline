import { describe, expect, it } from "vitest";

import {
  currencySymbol,
  formatAmount,
  formatAmountWithCents,
  formatRate,
  formatRateDraft,
  formatSignedDraft,
  formatWholeAmount,
  type MoneyFormat,
  monthlyBillableHours,
  parseRateToCents,
  parseSignedAmountToCents,
  projectMissionMonth,
} from "./billing";

const NARROW_NBSP = " ";
const NBSP = " ";

const EUR: MoneyFormat = { locale: "fr-FR", currency: "EUR" };
const USD: MoneyFormat = { locale: "en-US", currency: "USD" };

describe("formatting amounts", () => {
  it("shows whole euros the French way", () => {
    expect(formatWholeAmount(EUR, 122_400)).toBe(`1${NARROW_NBSP}224${NBSP}€`);
  });

  it("shows whole dollars the US way", () => {
    expect(formatWholeAmount(USD, 122_400)).toBe("$1,224");
  });

  it("keeps the cents when asked", () => {
    expect(formatAmountWithCents(EUR, 51_000)).toBe(`510,00${NBSP}€`);
    expect(formatAmountWithCents(USD, 51_000)).toBe("$510.00");
  });

  it("seeds an editable draft without a symbol", () => {
    expect(formatAmount(EUR, 480_050)).toBe(`4${NARROW_NBSP}800,5`);
    expect(formatAmount(USD, 480_050)).toBe("4,800.5");
  });
});

describe("formatting rates", () => {
  it("labels a daily rate", () => {
    expect(formatRate(EUR, 55_000, 0)).toBe(`550${NBSP}€/j`);
    expect(formatRate(USD, 55_000, 0)).toBe("$550/j");
  });

  it("keeps the cents of an hourly rate", () => {
    expect(formatRate(EUR, 8_550, 1)).toBe(`85,5${NBSP}€/h`);
  });

  it("labels a fixed price", () => {
    expect(formatRate(EUR, 480_000, 2)).toBe(
      `4${NARROW_NBSP}800${NBSP}€ forfait`,
    );
  });
});

describe("the currency symbol", () => {
  it("is the bare glyph in the currency's home locale", () => {
    expect(currencySymbol(EUR)).toBe("€");
    expect(currencySymbol(USD)).toBe("$");
  });

  it("is what the locale calls a foreign currency", () => {
    expect(currencySymbol({ locale: "fr-FR", currency: "USD" })).toBe("$US");
  });
});

describe("French rate drafts", () => {
  it("keeps a plain amount as typed", () => {
    expect(formatRateDraft("fr-FR", "550")).toBe("550");
  });

  it("groups thousands with a narrow no-break space", () => {
    expect(formatRateDraft("fr-FR", "4800")).toBe(`4${NARROW_NBSP}800`);
  });

  it("normalises a typed dot to the French decimal comma", () => {
    expect(formatRateDraft("fr-FR", "12.5")).toBe("12,5");
  });

  it("truncates the draft to two decimals rather than rounding it", () => {
    expect(formatRateDraft("fr-FR", "1234,567")).toBe(`1${NARROW_NBSP}234,56`);
  });

  it("drops characters that cannot belong to an amount", () => {
    expect(formatRateDraft("fr-FR", "55a0€")).toBe("550");
  });

  it("converts a grouped draft back to cents", () => {
    expect(parseRateToCents("fr-FR", `4${NARROW_NBSP}800,50`)).toBe(480_050);
  });

  it("reads a whole-euro amount as cents", () => {
    expect(parseRateToCents("fr-FR", "550")).toBe(55_000);
  });

  it("rejects an empty draft", () => {
    expect(parseRateToCents("fr-FR", "")).toBeNull();
  });

  it("rejects a zero rate", () => {
    expect(parseRateToCents("fr-FR", "0")).toBeNull();
  });

  it("rejects a negative rate", () => {
    expect(parseRateToCents("fr-FR", "-5")).toBeNull();
  });

  it("rejects a draft that holds no digits", () => {
    expect(parseRateToCents("fr-FR", "abc")).toBeNull();
  });

  it("survives a round trip through the draft formatter", () => {
    expect(parseRateToCents("fr-FR", formatRateDraft("fr-FR", "1234.5"))).toBe(
      123_450,
    );
  });
});

describe("signed amounts", () => {
  it("reads a positive balance as cents", () => {
    expect(parseSignedAmountToCents("fr-FR", `14${NARROW_NBSP}820,50`)).toBe(
      1_482_050,
    );
  });

  it("accepts an overdraft with an ascii minus", () => {
    expect(parseSignedAmountToCents("fr-FR", "-350,25")).toBe(-35_025);
  });

  it("accepts an overdraft with a unicode minus", () => {
    expect(parseSignedAmountToCents("fr-FR", "−350,25")).toBe(-35_025);
  });

  it("accepts zero", () => {
    expect(parseSignedAmountToCents("fr-FR", "0")).toBe(0);
  });

  it("rejects an empty draft", () => {
    expect(parseSignedAmountToCents("fr-FR", "")).toBeNull();
  });

  it("rejects a lone minus", () => {
    expect(parseSignedAmountToCents("fr-FR", "-")).toBeNull();
  });

  it("round-trips through the signed draft formatter", () => {
    expect(
      parseSignedAmountToCents("fr-FR", formatSignedDraft("fr-FR", "-14820,5")),
    ).toBe(-1_482_050);
  });

  it("keeps the minus while grouping the draft", () => {
    expect(formatSignedDraft("fr-FR", "-14820,5")).toBe(
      `-14${NARROW_NBSP}820,5`,
    );
  });
});

describe("US rate drafts", () => {
  it("groups thousands with a comma and keeps the dot decimal", () => {
    expect(formatRateDraft("en-US", "4800.5")).toBe("4,800.5");
  });

  it("regroups commas the user typed themselves", () => {
    expect(formatRateDraft("en-US", "1,234.56")).toBe("1,234.56");
  });

  it("keeps a misplaced comma in the draft instead of erasing it", () => {
    // Stripping it would turn "1,5" into a parseable "15" — the parser must be
    // the one to reject it, so the draft has to preserve the mistake.
    expect(formatRateDraft("en-US", "1,5")).toBe("1,5");
    expect(
      parseRateToCents("en-US", formatRateDraft("en-US", "1,5")),
    ).toBeNull();
  });

  it("regroups its own comma when a keystroke outgrows it", () => {
    // The controlled input holds "4,800"; the next digit hands back "4,8000".
    // That comma is the formatter's, not the typist's — it must move, not wedge
    // the field in an unparseable state.
    expect(formatRateDraft("en-US", "4,8000")).toBe("48,000");
  });

  it("reaches five digits one keystroke at a time", () => {
    const typed = "48000";
    let draft = "";

    for (const key of typed) {
      draft = formatRateDraft("en-US", draft + key);
    }

    expect(draft).toBe("48,000");
    expect(parseRateToCents("en-US", draft)).toBe(4_800_000);
  });

  it("converts a grouped draft back to cents", () => {
    expect(parseRateToCents("en-US", "1,234.56")).toBe(123_456);
  });

  it("refuses a comma that cannot be a thousands group", () => {
    // "1,5" typed by someone who means one and a half must be an error,
    // never fifteen.
    expect(parseRateToCents("en-US", "1,5")).toBeNull();
  });

  it("survives a round trip through the draft formatter", () => {
    expect(parseRateToCents("en-US", formatRateDraft("en-US", "1234.5"))).toBe(
      123_450,
    );
  });
});

describe("projectMissionMonth", () => {
  const ACRE_RATE_BP = 1_230;
  const STANDARD_RATE_BP = 2_600;
  const SEVEN_HOUR_DAY = 420;

  it("has nothing to project before a rate is typed", () => {
    expect(
      projectMissionMonth(null, 0, STANDARD_RATE_BP, SEVEN_HOUR_DAY),
    ).toEqual({ monthlyCents: null, provisionCents: null, netCents: null });
  });

  it("projects a daily rate over a typical month", () => {
    const projection = projectMissionMonth(
      55_000,
      0,
      STANDARD_RATE_BP,
      SEVEN_HOUR_DAY,
    );

    expect(projection.monthlyCents).toBe(1_100_000);
    expect(projection.provisionCents).toBe(286_000);
    expect(projection.netCents).toBe(814_000);
  });

  it("projects an hourly rate over the account's own workday", () => {
    expect(
      projectMissionMonth(8_500, 1, STANDARD_RATE_BP, SEVEN_HOUR_DAY)
        .monthlyCents,
    ).toBe(1_190_000);

    expect(
      projectMissionMonth(8_500, 1, STANDARD_RATE_BP, 480).monthlyCents,
    ).toBe(1_360_000);
  });

  it("bills a forfait its price, whatever the days", () => {
    expect(
      projectMissionMonth(900_000, 2, STANDARD_RATE_BP, SEVEN_HOUR_DAY)
        .monthlyCents,
    ).toBe(900_000);
  });

  it("provisions at the account's own rate, not a national default", () => {
    const projection = projectMissionMonth(
      55_000,
      0,
      ACRE_RATE_BP,
      SEVEN_HOUR_DAY,
    );

    expect(projection.provisionCents).toBe(135_300);
    expect(projection.netCents).toBe(964_700);
  });

  it("reports the hours its monthly figure assumed", () => {
    expect(monthlyBillableHours(SEVEN_HOUR_DAY)).toBe(140);
    expect(monthlyBillableHours(480)).toBe(160);
  });
});
