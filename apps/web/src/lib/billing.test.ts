import { expect, it } from "vitest";

import { formatRateDraft, parseRateToCents } from "./billing";

const NARROW_NBSP = " ";

it("keeps a plain amount as typed", () => {
  expect(formatRateDraft("550")).toBe("550");
});

it("groups thousands with a narrow no-break space", () => {
  expect(formatRateDraft("4800")).toBe(`4${NARROW_NBSP}800`);
});

it("normalises a typed dot to the French decimal comma", () => {
  expect(formatRateDraft("12.5")).toBe("12,5");
});

it("truncates the draft to two decimals rather than rounding it", () => {
  expect(formatRateDraft("1234,567")).toBe(`1${NARROW_NBSP}234,56`);
});

it("drops characters that cannot belong to an amount", () => {
  expect(formatRateDraft("55a0€")).toBe("550");
});

it("converts a grouped draft back to cents", () => {
  expect(parseRateToCents(`4${NARROW_NBSP}800,50`)).toBe(480_050);
});

it("reads a whole-euro amount as cents", () => {
  expect(parseRateToCents("550")).toBe(55_000);
});

it("rejects an empty draft", () => {
  expect(parseRateToCents("")).toBeNull();
});

it("rejects a zero rate", () => {
  expect(parseRateToCents("0")).toBeNull();
});

it("rejects a negative rate", () => {
  expect(parseRateToCents("-5")).toBeNull();
});

it("rejects a draft that holds no digits", () => {
  expect(parseRateToCents("abc")).toBeNull();
});

it("survives a round trip through the draft formatter", () => {
  expect(parseRateToCents(formatRateDraft("1234.5"))).toBe(123_450);
});
