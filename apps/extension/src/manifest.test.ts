import { readFileSync } from "node:fs";
import path from "node:path";
import { PORTALS } from "@opusline/portal-handoff";
import { describe, expect, it } from "vitest";

type Manifest = {
  version: string;
  host_permissions?: string[];
  content_scripts: { matches: string[]; js: string[]; run_at: string }[];
};

const base = JSON.parse(readManifest("manifest.base.json")) as Manifest;
const firefox = JSON.parse(readManifest("manifest.firefox.json")) as {
  browser_specific_settings: {
    gecko: { data_collection_permissions: { required: string[] } };
  };
};

// jsdom rewrites import.meta.url to an http origin; Vitest runs from the package root.
function readManifest(file: string): string {
  return readFileSync(path.join(process.cwd(), file), "utf8");
}

function matchesPattern(pattern: string, url: string): boolean {
  const [, scheme, host, path] =
    /^(\*|https?):\/\/([^/]+)(\/.*)$/.exec(pattern) ?? [];
  const target = new URL(url);
  const schemeOk =
    scheme === "*"
      ? /^https?:$/.test(target.protocol)
      : `${scheme}:` === target.protocol;
  const hostOk = host.startsWith("*.")
    ? target.hostname === host.slice(2) ||
      target.hostname.endsWith(host.slice(1))
    : target.hostname === host;
  const pathOk = new RegExp(`^${path.replaceAll("*", ".*")}$`).test(
    target.pathname,
  );

  return schemeOk && hostOk && pathOk;
}

describe("manifest", () => {
  it("runs a content script on every portal landing page, at document_start", () => {
    for (const script of base.content_scripts) {
      expect(script.run_at).toBe("document_start");
    }
    const covered = Object.values(PORTALS).filter(({ url }) =>
      base.content_scripts.some((script) =>
        script.matches.some((pattern) => matchesPattern(pattern, url)),
      ),
    );

    expect(covered.map(({ url }) => url).sort()).toEqual(
      Object.values(PORTALS)
        .map(({ url }) => url)
        .sort(),
    );
  });

  it("asks for no host permission beyond the content-script matches", () => {
    expect(base.host_permissions).toBeUndefined();
  });

  it("carries a store-shaped version", () => {
    expect(base.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it("is stamped with the release version like every other versioned file", () => {
    const releaseManifest = JSON.parse(
      readFileSync(
        path.join(process.cwd(), "../../.release-please-manifest.json"),
        "utf8",
      ),
    ) as Record<string, string>;

    expect(base.version).toBe(releaseManifest["."]);
  });

  it("declares to Firefox that nothing is collected", () => {
    expect(
      firefox.browser_specific_settings.gecko.data_collection_permissions
        .required,
    ).toEqual(["none"]);
  });
});
