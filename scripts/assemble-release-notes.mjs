// Folds the pending .release-notes/ fragments into the in-app release notes.
// Run when the release-please PR is open and the next version is known:
//
//   node scripts/assemble-release-notes.mjs 0.11.0
//
// The second argument is the last version actually released, and defaults to
// .release-please-manifest.json. Release Please assembles on its own branch,
// where that manifest has already been bumped to the version being released —
// passing main's version instead is what keeps the pending entry recognisable
// as pending, rather than frozen by its own release.
//
//   node scripts/assemble-release-notes.mjs 0.11.0 0.10.3
//
// That version is a prediction, not a fact: release-please recomputes it on
// every push to main, so a 0.21.3 becomes a 0.22.0 the moment a feat lands
// behind it, and fragments keep arriving after the notes were assembled. So
// this does not append — it REBUILDS the pending entry. Everything above the
// last released version in .release-please-manifest.json is unreleased and
// therefore still editable: it is reclaimed, merged with whatever fragments are
// pending now, and written back under the version asked for. Run it again after
// main moved and the same entry is re-versioned and topped up, instead of being
// stranded on a version that will never be tagged.
//
// scripts/release-notes-guard.sh keeps the release red until the entry exists,
// so a release with no fragments pending (dependency bumps only) gets a single
// generic line instead of nothing.
import { readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fragmentsDir = join(repoRoot, ".release-notes");
const releasesModule = join(repoRoot, "apps/web/src/lib/releases.ts");
const manifestFile = join(repoRoot, ".release-please-manifest.json");
const insertMarker = "  // release-notes:insert";
const arrayEnd = "];";
const kindOrder = ["new", "improved", "fixed"];
const fallbackText = "Updated the third-party libraries Opusline is built on.";

function fail(message) {
  console.error(message);
  process.exit(1);
}

// Mirrors compareVersions in apps/web/src/lib/semver.ts. Duplicated rather than
// imported: this is a root .mjs and that is TypeScript inside the web app.
function compareVersions(a, b) {
  const left = a.split(".").map(Number);
  const right = b.split(".").map(Number);

  for (let index = 0; index < Math.max(left.length, right.length); index++) {
    const difference = (left[index] ?? 0) - (right[index] ?? 0);
    if (difference !== 0) {
      return Math.sign(difference);
    }
  }

  return 0;
}

const semver = /^\d+\.\d+\.\d+$/;
const version = process.argv[2];
const baseline = process.argv[3];
if (!version || !semver.test(version) || (baseline && !semver.test(baseline))) {
  fail(
    "Usage: node scripts/assemble-release-notes.mjs <major.minor.patch> [<last-released>]",
  );
}

let manifest;
try {
  manifest = JSON.parse(readFileSync(manifestFile, "utf8"));
} catch (error) {
  fail(`${manifestFile} is not valid JSON: ${error.message}`);
}
const manifestVersion = manifest["."];
if (typeof manifestVersion !== "string" || !semver.test(manifestVersion)) {
  fail(`Could not read the "." version from ${manifestFile}.`);
}
const releasedVersion = baseline ?? manifestVersion;
if (compareVersions(version, releasedVersion) <= 0) {
  fail(
    `Release ${version} is at or below the last released version (${releasedVersion}) — its notes have shipped and are frozen.`,
  );
}

// Biome's quoteStyle "double" is a preference, not absolute: a string holding
// more double quotes than single quotes is printed single-quoted (fewer
// escapes). Mirror that choice so the assembled entry is already
// formatter-clean and the assembly PR does not fail its own CI.
const quote = (text) => {
  const countOf = (character) => text.split(character).length - 1;
  if (countOf('"') <= countOf("'")) {
    return JSON.stringify(text);
  }
  const escaped = JSON.stringify(text)
    .slice(1, -1)
    .replaceAll('\\"', '"')
    .replaceAll("'", "\\'");
  return `'${escaped}'`;
};

const unquote = (literal, where) => {
  const asJson = literal.startsWith("'")
    ? `"${literal.slice(1, -1).replaceAll("\\'", "'").replaceAll('"', '\\"')}"`
    : literal;
  try {
    const value = JSON.parse(asJson);
    if (typeof value !== "string") {
      throw new TypeError("not a string");
    }
    return value;
  } catch {
    fail(`${where}: could not read a string literal from ${literal}`);
  }
};

const source = readFileSync(releasesModule, "utf8");
if (!source.includes(insertMarker)) {
  fail(
    `${releasesModule} lost its "${insertMarker.trim()}" marker (expected at two-space indentation).`,
  );
}

const lines = source.split("\n");
const markerIndex = lines.indexOf(insertMarker);

// The entries between the marker and the array's close. Every one of them is
// script-generated, so the shape is rigid and anything else is a corruption
// worth stopping on rather than parsing around.
const blocks = [];
let cursor = markerIndex + 1;
while (cursor < lines.length && lines[cursor] !== arrayEnd) {
  if (lines[cursor] !== "  {") {
    fail(
      `${releasesModule}:${cursor + 1}: expected a release entry to open with "  {", found: ${lines[cursor]}`,
    );
  }
  let end = cursor + 1;
  while (end < lines.length && lines[end] !== "  },") {
    end++;
  }
  if (end === lines.length) {
    fail(
      `${releasesModule}:${cursor + 1}: release entry is never closed with "  },".`,
    );
  }
  blocks.push({ start: cursor, end, lines: lines.slice(cursor, end + 1) });
  cursor = end + 1;
}
if (cursor === lines.length) {
  fail(
    `${releasesModule}: the RELEASES array is never closed with "${arrayEnd}".`,
  );
}
const arrayEndIndex = cursor;

const entryField = /^ {4}(version|date): (.+),$/;
const itemField = /^ {8}(kind|text): (.+?),(?: \/\/ i18n-ignore)?$/;

function blockVersion(block) {
  for (const [offset, line] of block.lines.entries()) {
    const match = line.match(/^ {4}version: (.+),$/);
    if (match) {
      return unquote(match[1], `${releasesModule}:${block.start + offset + 1}`);
    }
  }
  fail(`${releasesModule}:${block.start + 1}: release entry has no version.`);
}

// Biome moves a value it cannot fit onto its own line after the key. Fold those
// back so the field regexes see one line, keeping each field's real line number
// for the error messages.
function foldLines(block) {
  const folded = [];
  for (let offset = 0; offset < block.lines.length; offset++) {
    const line = block.lines[offset];
    const at = block.start + offset + 1;
    if (/^ +\w+:$/.test(line) && offset + 1 < block.lines.length) {
      offset++;
      folded.push({ at, text: `${line} ${block.lines[offset].trim()}` });
      continue;
    }
    folded.push({ at, text: line });
  }
  return folded;
}

function parseBlock(block) {
  const where = `${releasesModule}:${block.start + 1}`;
  const entry = { items: [] };
  const folded = foldLines(block);
  let item = null;

  for (const [offset, { at, text: line }] of folded.entries()) {
    const position = `${releasesModule}:${at}`;
    if (offset === 0 || offset === folded.length - 1) {
      continue;
    }
    if (line === "    items: [" || line === "    ],") {
      continue;
    }
    if (line === "      {") {
      item = {};
      continue;
    }
    if (line === "      },") {
      if (!item?.kind || !item?.text) {
        fail(`${position}: release item is missing its kind or text.`);
      }
      entry.items.push(item);
      item = null;
      continue;
    }

    const inItem = line.match(itemField);
    if (inItem && item) {
      item[inItem[1]] = unquote(inItem[2], position);
      continue;
    }
    const field = line.match(entryField);
    if (field && !item) {
      entry[field[1]] = unquote(field[2], position);
      continue;
    }
    fail(`${position}: unexpected line in a release entry: ${line}`);
  }

  if (!entry.version || !entry.date) {
    fail(`${where}: release entry is missing its version or date.`);
  }
  for (const parsedItem of entry.items) {
    if (!kindOrder.includes(parsedItem.kind)) {
      fail(
        `${where}: "${parsedItem.kind}" is not one of ${kindOrder.join(", ")}.`,
      );
    }
  }
  return entry;
}

// Only the unreleased entries are read in full. The ones already shipped are
// frozen, and years of them have been reworded and reflowed by hand — parsing
// those strictly would fail on prose this script has no business touching.
const pending = blocks.filter(
  (block) => compareVersions(blockVersion(block), releasedVersion) > 0,
);
const reclaimed = pending.map((block) => parseBlock(block));

const fragmentFiles = readdirSync(fragmentsDir)
  .filter((name) => name.endsWith(".json"))
  .sort();

const fragments = fragmentFiles.map((name) => {
  const path = join(fragmentsDir, name);
  let fragment;
  try {
    fragment = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    fail(`${path} is not valid JSON: ${error.message}`);
  }
  if (!kindOrder.includes(fragment.kind)) {
    fail(`${path}: "kind" must be one of ${kindOrder.join(", ")}.`);
  }
  if (typeof fragment.text !== "string" || fragment.text.trim() === "") {
    fail(`${path}: "text" must be a non-empty string.`);
  }
  return { kind: fragment.kind, text: fragment.text.trim(), path };
});

const seenFragmentTexts = new Set();
for (const fragment of fragments) {
  if (seenFragmentTexts.has(fragment.text)) {
    fail(
      `Two fragments carry the same text ("${fragment.text}") — merge or reword one before assembling.`,
    );
  }
  seenFragmentTexts.add(fragment.text);
}

// Reclaimed lines first, in the order they were already published in, then the
// fragments that arrived since. A fragment repeating a line already reclaimed
// is a top-up artefact, not an authoring mistake, so it is dropped quietly —
// unlike two fragments saying the same thing, which is caught above.
const merged = [];
const seenTexts = new Set();
for (const item of [
  ...reclaimed.flatMap((entry) => entry.items),
  ...fragments,
]) {
  if (seenTexts.has(item.text)) {
    continue;
  }
  seenTexts.add(item.text);
  merged.push({ kind: item.kind, text: item.text });
}

// Dependency bumps merge without a fragment, and a release may hold nothing
// else. The entry still has to exist for the guard, so it says this instead —
// and it steps aside the moment a real line joins the release.
const withoutFallback = merged.filter((item) => item.text !== fallbackText);
const items =
  withoutFallback.length > 0
    ? withoutFallback
    : [{ kind: "improved", text: fallbackText }];
items.sort((a, b) => kindOrder.indexOf(a.kind) - kindOrder.indexOf(b.kind));

const now = new Date();
const pad = (part) => String(part).padStart(2, "0");
const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

// Re-dating an entry whose content did not move would rewrite the file on every
// no-op run, and the workflow decides whether to push by diffing the tree.
const sameAs = (entry) =>
  entry.version === version &&
  entry.items.length === items.length &&
  entry.items.every(
    (item, index) =>
      item.kind === items[index].kind && item.text === items[index].text,
  );
const unchanged = reclaimed.length === 1 && sameAs(reclaimed[0]);
const date = unchanged ? reclaimed[0].date : today;

// Release notes are English prose that still names French things — « Prochaine
// échéance », Déclarations, a CRA. They are content, not UI copy, so they never
// belong in the catalogs, and every assembled line carries the guard's named
// opt-out.
//
// Unconditionally, not just for the lines that look French today: this used to
// test one character range of its own, and the moment scripts/i18n-guard.sh
// learned about « » the two disagreed and the assembly PR failed its own CI.
// The exemption is categorical, so the marker is too.
const guardOptOut = () => " // i18n-ignore";
const entry = [
  "  {",
  `    version: ${quote(version)},`,
  `    date: ${quote(date)},`,
  "    items: [",
  ...items.flatMap((item) => [
    "      {",
    `        kind: ${quote(item.kind)},`,
    `        text: ${quote(item.text)},${guardOptOut()}`,
    "      },",
  ]),
  "    ],",
  "  },",
].join("\n");

// Reassembled from the surviving blocks rather than spliced at an offset: the
// pending entries sit at the top today, but nothing in the file enforces that.
const rebuilt = [
  ...lines.slice(0, markerIndex + 1),
  ...entry.split("\n"),
  ...blocks
    .filter((block) => !pending.includes(block))
    .flatMap((block) => block.lines),
  ...lines.slice(arrayEndIndex),
].join("\n");

writeFileSync(releasesModule, rebuilt);
for (const fragment of fragments) {
  rmSync(fragment.path);
}

const reclaimedVersions = reclaimed
  .map((released) => released.version)
  .filter((reclaimedVersion) => reclaimedVersion !== version);
if (reclaimedVersions.length > 0) {
  console.log(
    `Reclaimed ${reclaimedVersions.join(", ")} — ${reclaimedVersions.length === 1 ? "that version was" : "those versions were"} never released, so ${reclaimedVersions.length === 1 ? "its" : "their"} notes move into ${version}.`,
  );
}
console.log(
  `${version} now carries ${items.length} item${items.length === 1 ? "" : "s"} in ${releasesModule}${fragments.length > 0 ? `, and ${fragments.length} fragment${fragments.length === 1 ? " was" : "s were"} consumed` : ""}.`,
);
