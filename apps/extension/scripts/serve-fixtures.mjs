// Serves fixtures/ on localhost with an index whose links carry sample
// payloads, so the fill can be walked through in a browser loaded with the
// --harness build and no portal login. Run `build:harness` first: the codec is
// read from the ESM copy that build writes to dist/harness.
import { readFile } from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  encodeHandoff,
  HANDOFF_FRAGMENT_KEY,
} from "../dist/harness/portal-handoff.mjs";

const fixturesDir = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../fixtures",
);
const port = Number(process.env.PORT ?? 4173);
const issuedAt = new Date().toISOString();

const samples = [
  {
    file: "urssaf-form.html",
    payload: {
      v: 1,
      portal: "urssaf",
      period: "2026-07",
      issuedAt,
      fields: { turnover: 10450 },
    },
  },
  {
    file: "ca3-form.html",
    payload: {
      v: 1,
      portal: "impots",
      period: "2026-07",
      issuedAt,
      fields: {
        A1: 10450,
        "2A": 0,
        "3B": 0,
        "08": 10450,
        "08_tax": 2090,
        19: 0,
        20: 310,
        21: 0,
        22: 0,
        32: 1780,
      },
    },
  },
];

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".md": "text/plain; charset=utf-8",
};

http
  .createServer(async (request, response) => {
    const url = new URL(request.url, `http://localhost:${port}`);
    if (url.pathname === "/") {
      response.writeHead(200, { "content-type": TYPES[".html"] });
      response.end(indexPage());
      return;
    }
    try {
      const file = path.join(fixturesDir, path.normalize(url.pathname));
      const body = await readFile(file);
      response.writeHead(200, {
        "content-type": TYPES[path.extname(file)] ?? "application/octet-stream",
      });
      response.end(body);
    } catch {
      response.writeHead(404);
      response.end("not found");
    }
  })
  .listen(port, () => {
    console.log(`fixtures harness on http://localhost:${port}/`);
  });

function indexPage() {
  const links = samples
    .map(
      ({ file, payload }) =>
        `<li><a href="/${file}#${HANDOFF_FRAGMENT_KEY}=${encodeHandoff(payload)}">${file}</a> — ${payload.portal}, ${payload.period}</li>`,
    )
    .join("\n");

  return `<!doctype html><meta charset="utf-8"><title>Opusline extension harness</title>
<h1>Opusline extension harness</h1>
<p>Load <code>dist/chrome-dev</code> (or <code>dist/firefox-dev</code>) in the browser, then open a fixture:</p>
<ul>${links}</ul>`;
}
