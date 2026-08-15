// Folds the pending .release-notes/ fragments into the in-app release notes.
// Run when the release-please PR is open and the next version is known:
//
//   node scripts/assemble-release-notes.mjs 0.11.0
//
// The inserted entry is normal reviewed source — reorder items or add a
// headline by hand before committing. scripts/release-notes-guard.sh keeps the
// release red until the entry exists.
import { readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const fragmentsDir = join(repoRoot, ".release-notes");
const releasesModule = join(repoRoot, "apps/web/src/lib/releases.ts");
const insertMarker = "  // release-notes:insert";
const kindOrder = ["new", "improved", "fixed"];

function fail(message) {
  console.error(message);
  process.exit(1);
}

const version = process.argv[2];
if (!version || !/^\d+\.\d+\.\d+$/.test(version)) {
  fail("Usage: node scripts/assemble-release-notes.mjs <major.minor.patch>");
}

const source = readFileSync(releasesModule, "utf8");
if (!source.includes(insertMarker)) {
  fail(
    `${releasesModule} lost its "${insertMarker.trim()}" marker (expected at two-space indentation).`,
  );
}
if (source.includes(`version: "${version}"`)) {
  fail(`Release ${version} already has an entry in ${releasesModule}.`);
}

const fragmentFiles = readdirSync(fragmentsDir)
  .filter((name) => name.endsWith(".json"))
  .sort();
if (fragmentFiles.length === 0) {
  fail(`No fragments in ${fragmentsDir} — nothing to assemble.`);
}

const items = fragmentFiles.map((name) => {
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
items.sort((a, b) => kindOrder.indexOf(a.kind) - kindOrder.indexOf(b.kind));

const seenTexts = new Set();
for (const item of items) {
  if (seenTexts.has(item.text)) {
    fail(
      `Two fragments carry the same text ("${item.text}") — merge or reword one before assembling.`,
    );
  }
  seenTexts.add(item.text);
}

const quote = (text) => JSON.stringify(text);
const now = new Date();
const pad = (part) => String(part).padStart(2, "0");
const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const entry = [
  "  {",
  `    version: ${quote(version)},`,
  `    date: ${quote(date)},`,
  "    items: [",
  ...items.flatMap((item) => [
    "      {",
    `        kind: ${quote(item.kind)},`,
    `        text: ${quote(item.text)},`,
    "      },",
  ]),
  "    ],",
  "  },",
].join("\n");

writeFileSync(
  releasesModule,
  source.replace(insertMarker, () => `${insertMarker}\n${entry}`),
);
for (const item of items) {
  rmSync(item.path);
}

console.log(
  `Added ${version} (${items.length} item${items.length === 1 ? "" : "s"}) to ${releasesModule} and removed the fragments.`,
);
console.log(
  "Review the entry, optionally add a headline, then commit both changes.",
);
