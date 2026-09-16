// Builds dist/chrome and dist/firefox (or dist/*-dev with --harness). Content
// scripts are classic scripts in Chrome, so each entry is its own IIFE build;
// the two browsers share the bundle and differ only by manifest.
import { cp, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "vite";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const isHarness = process.argv.includes("--harness");
const flavour = isHarness ? "-dev" : "";
const HARNESS_MATCHES = ["http://localhost/*", "http://127.0.0.1/*"];

const chromeDir = path.join(root, `dist/chrome${flavour}`);
const firefoxDir = path.join(root, `dist/firefox${flavour}`);

await rm(chromeDir, { recursive: true, force: true });
await rm(firefoxDir, { recursive: true, force: true });
await mkdir(chromeDir, { recursive: true });

for (const entry of await contentEntries()) {
  await build({
    root,
    configFile: path.join(root, "vite.config.ts"),
    logLevel: "warn",
    build: {
      outDir: chromeDir,
      emptyOutDir: false,
      minify: false,
      sourcemap: false,
      target: "es2022",
      lib: {
        entry: path.join(root, "src/content", `${entry}.ts`),
        formats: ["iife"],
        name: "opusline",
        fileName: () => `${entry}.js`,
      },
    },
  });
}

await cp(path.join(root, "_locales"), path.join(chromeDir, "_locales"), {
  recursive: true,
});
await cp(path.join(root, "icons"), path.join(chromeDir, "icons"), {
  recursive: true,
});
await cp(chromeDir, firefoxDir, { recursive: true });

if (isHarness) {
  await buildHarnessCodec();
}

const base = await readJson("manifest.base.json");
await writeManifest(chromeDir, await readJson("manifest.chrome.json"));
await writeManifest(firefoxDir, await readJson("manifest.firefox.json"));

console.log(
  `built ${path.relative(root, chromeDir)} and ${path.relative(root, firefoxDir)}`,
);

// Node cannot run the codec's TypeScript source directly (its imports carry no
// extensions), so the harness server reads an ESM build of the package instead.
async function buildHarnessCodec() {
  await build({
    root,
    configFile: path.join(root, "vite.config.ts"),
    logLevel: "warn",
    build: {
      outDir: path.join(root, "dist/harness"),
      emptyOutDir: true,
      minify: false,
      sourcemap: false,
      target: "node26",
      lib: {
        entry: path.join(root, "../../packages/portal-handoff/src/index.ts"),
        formats: ["es"],
        fileName: () => "portal-handoff.mjs",
      },
    },
  });
}

async function contentEntries() {
  const files = await readdir(path.join(root, "src/content"));

  return files
    .filter((file) => file.endsWith(".ts") && !file.endsWith(".test.ts"))
    .map((file) => file.slice(0, -".ts".length))
    .sort();
}

async function readJson(file) {
  return JSON.parse(await readFile(path.join(root, file), "utf8"));
}

async function writeManifest(outDir, overlay) {
  const manifest = { ...base, ...overlay };
  if (isHarness) {
    manifest.content_scripts = manifest.content_scripts.map((script) => ({
      ...script,
      matches: [...script.matches, ...HARNESS_MATCHES],
    }));
  }
  await writeFile(
    path.join(outDir, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
}
