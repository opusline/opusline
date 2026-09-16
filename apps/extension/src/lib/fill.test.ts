import { describe, expect, it, vi } from "vitest";

import { documentFrom } from "../test/dom";
import { fillFields, setInputValue } from "./fill";

describe("setInputValue", () => {
  it("writes through the prototype setter and fires input then change", () => {
    const doc = documentFrom('<input id="ca" type="text">');
    const input = doc.getElementById("ca") as HTMLInputElement;
    const events: string[] = [];
    input.addEventListener("input", (event) => events.push(event.type));
    input.addEventListener("change", (event) => events.push(event.type));
    const setter = vi.spyOn(HTMLInputElement.prototype, "value", "set");

    setInputValue(input, "10450");

    expect(input.value).toBe("10450");
    expect(setter).toHaveBeenCalledWith("10450");
    expect(events).toEqual(["input", "change"]);
  });
});

describe("fillFields", () => {
  const fields = [
    {
      key: "a",
      locate: (doc: Document) => doc.querySelector<HTMLInputElement>("#a"),
    },
    {
      key: "b",
      locate: (doc: Document) => doc.querySelector<HTMLInputElement>("#b"),
    },
    {
      key: "c",
      locate: (doc: Document) => doc.querySelector<HTMLInputElement>("#c"),
    },
  ] as const;

  it("fills only the fields the values carry and reports each one", () => {
    const doc = documentFrom('<input id="a"><input id="b">');

    const outcome = fillFields(fields, { a: 12, c: 3 }, doc);

    expect(doc.querySelector<HTMLInputElement>("#a")?.value).toBe("12");
    expect(doc.querySelector<HTMLInputElement>("#b")?.value).toBe("");
    expect(outcome).toEqual({
      filled: [{ key: "a", value: "12" }],
      skipped: [{ key: "c", reason: "missing" }],
    });
  });

  it("leaves locked inputs untouched and says so", () => {
    const doc = documentFrom(
      '<input id="a" readonly value="old"><input id="b" disabled>',
    );

    const outcome = fillFields(fields, { a: 1, b: 2 }, doc);

    expect(doc.querySelector<HTMLInputElement>("#a")?.value).toBe("old");
    expect(outcome.filled).toEqual([]);
    expect(outcome.skipped).toEqual([
      { key: "a", reason: "readonly" },
      { key: "b", reason: "readonly" },
    ]);
  });
});
