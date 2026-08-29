/**
 * Fails when the SPA's entry chunk outgrows its gzip budget.
 *
 * The entry is on every page's critical path — nothing paints until it is
 * parsed — so growth there is a regression the suite should catch, not a
 * surprise in a Lighthouse run months later. Route chunks are exempt: they
 * are code-split precisely so they may grow with their feature.
 *
 * Run after `vite build`; CI does (.github/workflows/ci.yml).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

// History: 78.8 kB gzip when the audit measured it (2026-08), 93.7 kB after
// the @tanstack/react-router 1.170.32 lockfile update started bundling its
// once-lazy Match module into the entry. The budget tracks the honest floor
// with modest headroom — a wall against the next silent 15 kB jump, not a
// number to bump casually. The audit's entry trims (zod out of the entry via
// the lib/i18n → lib/zod edge, lazy date-field calendar) are the way back down.
const BUDGET_BYTES = 100_000;

const distDir = resolve(fileURLToPath(import.meta.url), "../../dist");
const indexHtml = readFileSync(resolve(distDir, "index.html"), "utf8");

const entrySrc = indexHtml.match(
  /<script type="module"[^>]*src="(\/assets\/[^"]+\.js)"/,
)?.[1];

if (entrySrc === undefined) {
  console.error(
    "check-bundle-budget: no module entry found in dist/index.html",
  );
  process.exit(1);
}

const entryBytes = readFileSync(resolve(distDir, `.${entrySrc}`));
const gzippedBytes = gzipSync(entryBytes).length;
const report = `${entrySrc}: ${(gzippedBytes / 1000).toFixed(1)} kB gzip (budget ${BUDGET_BYTES / 1000} kB)`;

if (gzippedBytes > BUDGET_BYTES) {
  console.error(`check-bundle-budget: entry chunk over budget — ${report}`);
  process.exit(1);
}

console.log(`check-bundle-budget: ${report}`);
