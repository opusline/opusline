import { expect, it } from "vitest";

import { parseQuickEntry } from "./parse-quick-entry";

const TODAY = "2026-08-13";

it("reads the canvas line: supplier, amount, description and rate", () => {
  expect(parseQuickEntry("lunaprint 429 écran 20%", TODAY)).toEqual({
    supplier: "Lunaprint",
    ttcDraft: "429",
    description: "Écran",
    vatChoice: "fr20",
    category: 0,
  });
});

it("reads a day and month as the most recent such day", () => {
  expect(parseQuickEntry("lunaprint 14,39 12/08", TODAY).spentOn).toBe(
    "2026-08-12",
  );
  expect(parseQuickEntry("lunaprint 14,39 12/09", TODAY).spentOn).toBe(
    "2025-09-12",
  );
  expect(
    parseQuickEntry("lunaprint 14,39 31/02", TODAY).spentOn,
  ).toBeUndefined();
});

it("hands the amount over with a dot, whatever was typed", () => {
  expect(parseQuickEntry("lunaprint 14,39", TODAY).ttcDraft).toBe("14.39");
  expect(parseQuickEntry("lunaprint 429€", TODAY).ttcDraft).toBe("429");
});

it("tells a pro share from a rate, spaced or not", () => {
  const entry = parseQuickEntry(
    "callisto 29 forfait mobile 70 % pro 20 %",
    TODAY,
  );

  expect(entry.proShare).toBe("70");
  expect(entry.vatChoice).toBe("fr20");
  expect(entry.description).toBe("Forfait mobile");
  expect(entry.category).toBe(3);
  expect(parseQuickEntry("boulangerie 3 5,5%", TODAY).vatChoice).toBe("fr55");
});

it("reads the reverse-charge and exempt words", () => {
  expect(parseQuickEntry("orvella 48 cloud us", TODAY).vatChoice).toBe("nonEu");
  expect(parseQuickEntry("callisto 29 intracom", TODAY).vatChoice).toBe("eu");
  expect(parseQuickEntry("assurance 312 hors-tva", TODAY).vatChoice).toBe(
    "exempt",
  );
});

it("keeps a multi-word supplier before the amount", () => {
  expect(
    parseQuickEntry("maison vesterhus 46 déjeuner 10%", TODAY),
  ).toMatchObject({
    supplier: "Maison Vesterhus",
    description: "Déjeuner",
    category: 7,
  });
});

it("ignores a rate no chip covers", () => {
  expect(parseQuickEntry("papeterie 12 2,1%", TODAY).vatChoice).toBeUndefined();
});

it("reads nothing from nothing", () => {
  expect(parseQuickEntry("   ", TODAY)).toEqual({});
});
