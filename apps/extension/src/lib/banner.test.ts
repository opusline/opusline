import { describe, expect, it } from "vitest";

import { documentFrom } from "../test/dom";
import { BANNER_TAG, showBanner } from "./banner";

describe("showBanner", () => {
  it("mounts one host with a shadow root and removes it on dismiss", () => {
    const doc = documentFrom("<main></main>");
    let shadow: ShadowRoot | null = null;
    const original = doc.createElement.bind(doc);
    doc.createElement = ((tag: string) => {
      const element = original(tag);
      if (tag === BANNER_TAG) {
        const attach = element.attachShadow.bind(element);
        element.attachShadow = (init) => {
          shadow = attach(init);
          return shadow;
        };
      }
      return element;
    }) as typeof doc.createElement;

    showBanner(doc, {
      title: "Chiffres",
      filled: ["case A1"],
      skipped: ["case 20"],
    });
    showBanner(doc, { title: "Chiffres", filled: ["case A1"], skipped: [] });

    expect(doc.querySelectorAll(BANNER_TAG)).toHaveLength(1);
    const root = shadow as ShadowRoot | null;
    expect(root?.querySelector(".title")?.textContent).toBe("Chiffres");
    expect(root?.querySelector("[role=status]")).not.toBeNull();
    expect(root?.textContent).toContain("banner_filled(case A1)");
    expect(root?.textContent).not.toContain("banner_skipped");

    root?.querySelector("button")?.click();

    expect(doc.querySelector(BANNER_TAG)).toBeNull();
  });
});
