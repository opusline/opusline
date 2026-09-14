// Drives assemble-release-notes.mjs the way release-please.yml does — as a
// command — against a scratch tree instead of the repository. The script takes
// its root from its own location, so a copy of it under <scratch>/scripts makes
// <scratch> the repository: no seam in the script, and the test still exercises
// the real argument parsing, the real file writes and the real exit codes.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";

const assembler = fileURLToPath(
  new URL("assemble-release-notes.mjs", import.meta.url),
);
const scratchRoots = [];

after(() => {
  for (const root of scratchRoots) {
    rmSync(root, { recursive: true, force: true });
  }
});

function releasesModule(entries) {
  const lines = [
    'import { m } from "@/paraglide/messages.js";',
    "",
    "export const RELEASES: Release[] = [",
    "  // release-notes:insert",
  ];

  for (const entry of entries) {
    lines.push(
      "  {",
      `    version: "${entry.version}",`,
      `    date: "${entry.date}",`,
      "    items: [",
    );
    for (const item of entry.items) {
      lines.push(
        "      {",
        `        kind: "${item.kind}",`,
        `        text: "${item.text}", // i18n-ignore`,
        "      },",
      );
    }
    lines.push("    ],", "  },");
  }

  lines.push("];", "");
  return lines.join("\n");
}

function scratchRepo({ released, entries = [], fragments = [] }) {
  const root = mkdtempSync(join(tmpdir(), "opusline-release-notes-"));
  scratchRoots.push(root);

  mkdirSync(join(root, "scripts"));
  copyFileSync(assembler, join(root, "scripts/assemble-release-notes.mjs"));
  mkdirSync(join(root, ".release-notes"));
  mkdirSync(join(root, "apps/web/src/lib"), { recursive: true });

  writeFileSync(
    join(root, ".release-please-manifest.json"),
    `${JSON.stringify({ ".": released }, null, 2)}\n`,
  );
  writeFileSync(
    join(root, "apps/web/src/lib/releases.ts"),
    releasesModule(entries),
  );
  for (const [index, fragment] of fragments.entries()) {
    writeFileSync(
      join(root, ".release-notes", `${index}-${fragment.kind}.json`),
      `${JSON.stringify(fragment, null, 2)}\n`,
    );
  }

  return root;
}

function assemble(root, ...args) {
  return execFileSync(
    process.execPath,
    [join(root, "scripts/assemble-release-notes.mjs"), ...args],
    // stderr piped rather than inherited: the failure cases below are expected,
    // and their messages would otherwise print as if the suite were breaking.
    { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
  );
}

function assembleFailing(root, ...args) {
  try {
    assemble(root, ...args);
  } catch (error) {
    return { status: error.status, stderr: error.stderr };
  }
  throw new Error("the assembler was expected to fail and did not");
}

function moduleSource(root) {
  return readFileSync(join(root, "apps/web/src/lib/releases.ts"), "utf8");
}

// The entries as the module now holds them, in file order: version, then each
// item's kind and the text it was written with, quotes and all.
function assembled(root) {
  const entries = [];
  let entry = null;

  for (const line of moduleSource(root).split("\n")) {
    const version = line.match(/^ {4}version: (.+),$/);
    if (version) {
      entry = { version: version[1], items: [] };
      entries.push(entry);
      continue;
    }
    const kind = line.match(/^ {8}kind: "(.+)",$/);
    if (kind) {
      entry.items.push({ kind: kind[1] });
      continue;
    }
    const text = line.match(/^ {8}text: (.+),( \/\/ i18n-ignore)?$/);
    if (text) {
      entry.items.at(-1).text = text[1];
      entry.items.at(-1).guardOptOut = text[2] !== undefined;
    }
  }

  return entries;
}

test("collects the pending fragments into the version asked for", () => {
  const root = scratchRepo({
    released: "0.27.0",
    fragments: [
      { kind: "fixed", text: "Stopped losing the timer on a refresh." },
      { kind: "new", text: "Subscriptions now file their own debits." },
    ],
  });

  assemble(root, "0.28.0");

  assert.deepEqual(assembled(root)[0], {
    version: '"0.28.0"',
    items: [
      {
        kind: "new",
        text: '"Subscriptions now file their own debits."',
        guardOptOut: true,
      },
      {
        kind: "fixed",
        text: '"Stopped losing the timer on a refresh."',
        guardOptOut: true,
      },
    ],
  });
});

test("consumes the fragments it folded in", () => {
  const root = scratchRepo({
    released: "0.27.0",
    fragments: [{ kind: "new", text: "Added the expense journal." }],
  });

  assemble(root, "0.28.0");

  assert.equal(existsSync(join(root, ".release-notes/0-new.json")), false);
});

test("leaves the entries that already shipped untouched", () => {
  const shipped = {
    version: "0.27.0",
    date: "2026-09-12",
    items: [{ kind: "improved", text: "Something released long ago." }],
  };
  const root = scratchRepo({
    released: "0.27.0",
    entries: [shipped],
    fragments: [{ kind: "new", text: "Added the expense journal." }],
  });

  assemble(root, "0.28.0");

  assert.deepEqual(assembled(root)[1], {
    version: '"0.27.0"',
    items: [
      {
        kind: "improved",
        text: '"Something released long ago."',
        guardOptOut: true,
      },
    ],
  });
});

test("re-versions an entry that was assembled but never released", () => {
  const root = scratchRepo({
    released: "0.27.0",
    entries: [
      {
        version: "0.28.0",
        date: "2026-09-13",
        items: [{ kind: "new", text: "Assembled while main moved under it." }],
      },
    ],
    fragments: [{ kind: "fixed", text: "Landed behind it." }],
  });

  assemble(root, "0.29.0");

  const entries = assembled(root);
  assert.equal(entries.length, 1);
  assert.deepEqual(entries[0].version, '"0.29.0"');
  assert.deepEqual(
    entries[0].items.map((item) => item.kind),
    ["new", "fixed"],
  );
});

test("carries a release with no fragments on a generic line", () => {
  const root = scratchRepo({ released: "0.27.0" });

  assemble(root, "0.28.0");

  assert.deepEqual(assembled(root)[0].items, [
    {
      kind: "improved",
      text: '"Updated the third-party libraries Opusline is built on."',
      guardOptOut: true,
    },
  ]);
});

// Biome prints a string holding more double quotes than single quotes
// single-quoted, and the assembled entry has to be formatter-clean or the
// release PR fails its own CI.
test("single-quotes a line that carries double quotes", () => {
  const root = scratchRepo({
    released: "0.27.0",
    fragments: [{ kind: "new", text: 'The "Encaissé" total is now yours.' }],
  });

  assemble(root, "0.28.0");

  assert.equal(
    assembled(root)[0].items[0].text,
    "'The \"Encaissé\" total is now yours.'",
  );
});

test("refuses to rewrite notes that have already shipped", () => {
  const root = scratchRepo({
    released: "0.27.0",
    entries: [
      {
        version: "0.27.0",
        date: "2026-09-12",
        items: [{ kind: "improved", text: "Something released long ago." }],
      },
    ],
  });

  const { status, stderr } = assembleFailing(root, "0.27.0");

  assert.equal(status, 1);
  assert.match(stderr, /at or below the last released version/);
});

test("refuses two fragments that say the same thing", () => {
  const text = "Subscriptions now file their own debits.";
  const root = scratchRepo({
    released: "0.27.0",
    fragments: [
      { kind: "new", text },
      { kind: "improved", text },
    ],
  });

  const { status, stderr } = assembleFailing(root, "0.28.0");

  assert.equal(status, 1);
  assert.match(stderr, /carry the same text/);
  assert.match(moduleSource(root), /release-notes:insert\n\];/);
});

test("reads the baseline from the second argument, not the manifest", () => {
  const root = scratchRepo({
    released: "0.28.0",
    entries: [
      {
        version: "0.28.0",
        date: "2026-09-13",
        items: [{ kind: "new", text: "Pending on the release branch." }],
      },
    ],
    fragments: [{ kind: "fixed", text: "Arrived after the notes were built." }],
  });

  assemble(root, "0.28.0", "0.27.0");

  assert.deepEqual(
    assembled(root)[0].items.map((item) => item.kind),
    ["new", "fixed"],
  );
});
