import { describe, expect, it } from "vitest";

import { documentFrom } from "../test/dom";
import { locateInRow, nextInputInRow } from "./locate";

describe("locateInRow", () => {
  it("returns the first fillable input of the row whose heading matches", () => {
    const doc = documentFrom(
      '<table><tr><th>19</th><td><input type="checkbox" id="c"><input id="v"></td></tr><tr><th>20</th><td><input id="w"></td></tr></table>',
    );

    expect(locateInRow(doc, /\b20\b/)?.id).toBe("w");
    expect(locateInRow(doc, /\b19\b/)?.id).toBe("v");
    expect(locateInRow(doc, /\b21\b/)).toBeNull();
  });
});

describe("nextInputInRow", () => {
  it("returns the fillable input after the given one in the same row", () => {
    const doc = documentFrom(
      '<table><tr><td><input id="a"></td><td><input id="b" type="hidden"><input id="c"></td></tr></table>',
    );
    const first = doc.querySelector<HTMLInputElement>("#a") as HTMLInputElement;

    expect(nextInputInRow(first)?.id).toBe("c");
  });

  it("returns null outside a table or at the end of the row", () => {
    const doc = documentFrom(
      '<input id="lone"><table><tr><td><input id="last"></td></tr></table>',
    );

    expect(
      nextInputInRow(doc.querySelector("#lone") as HTMLInputElement),
    ).toBeNull();
    expect(
      nextInputInRow(doc.querySelector("#last") as HTMLInputElement),
    ).toBeNull();
  });
});
