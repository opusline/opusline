import { readdirSync, readFileSync } from "node:fs";

import { expect, it } from "vitest";

import { m } from "@/paraglide/messages.js";

/**
 * Paraglide compiles a missing `fr` key as a silent fallback to `en`, so the
 * recompiled output stays self-consistent and the drift guard's diff stays
 * clean: a dropped French string would ship as English with no signal at all.
 *
 * The API's LangCatalogTest asserts the same parity on its own catalogs.
 */
function catalog(locale: "en" | "fr"): Record<string, unknown> {
  const { $schema, ...messages } = JSON.parse(
    readFileSync(`${process.cwd()}/messages/${locale}.json`, "utf8"),
  ) as Record<string, unknown>;

  return messages;
}

const en = catalog("en");
const fr = catalog("fr");

it("translates every English message into French", () => {
  expect(Object.keys(fr).sort()).toEqual(Object.keys(en).sort());
});

it("keeps the catalogs sorted, so a new key lands in one obvious place", () => {
  for (const [locale, messages] of [
    ["en", en],
    ["fr", fr],
  ] as const) {
    const keys = Object.keys(messages);

    expect(keys, `${locale}.json is out of order`).toEqual([...keys].sort());
  }
});

it("gives every message the same interpolation parameters in both languages", () => {
  const parametersOf = (value: unknown): string[] =>
    [...JSON.stringify(value).matchAll(/\{(\w+)\}/g)]
      .map((match) => match[1])
      .sort();

  for (const key of Object.keys(en)) {
    expect(
      parametersOf(fr[key]),
      `${key} interpolates different values`,
    ).toEqual(parametersOf(en[key]));
  }
});

it("compiles every message into the runtime", () => {
  for (const key of Object.keys(en)) {
    expect(
      m,
      `${key} is in the catalog but not in the compiled output`,
    ).toHaveProperty(key);
  }
});

it("ships no message the app never reads", () => {
  // Adding a key and forgetting the call site leaves the old hardcoded string
  // on screen and every other check green — the catalogs stay at parity, the
  // compiler emits it, and nothing renders it.
  const sources = readdirSync(`${process.cwd()}/src`, {
    withFileTypes: true,
    recursive: true,
  })
    .filter((entry) => entry.isFile() && /\.tsx?$/.test(entry.name))
    .map((entry) => `${entry.parentPath}/${entry.name}`)
    .filter((file) => !file.includes("/paraglide/"))
    .map((file) => readFileSync(file, "utf8"))
    .join("\n");

  // `m.key(…)` at a call site, `m.key` in an enum-label map, and the accessor
  // form a Record<Enum, () => string> uses.
  const referenced = new Set(
    [...sources.matchAll(/\bm\.([a-z0-9_]+)/g)].map((match) => match[1]),
  );

  expect(
    Object.keys(en).filter((key) => !referenced.has(key)),
    "these keys are in the catalogs but nothing reads them",
  ).toEqual([]);
});
