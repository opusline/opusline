import { describe, expect, it } from "vitest";

import { isDurationKey, nextCell } from "./week-keyboard";

const shape = { columnCount: 6, ctrlKey: false, rowCount: 3 };
const middle = { column: 2, row: 1 };

describe("nextCell", () => {
  it.each([
    ["ArrowLeft", { column: 1, row: 1 }],
    ["ArrowRight", { column: 3, row: 1 }],
    ["ArrowUp", { column: 2, row: 0 }],
    ["ArrowDown", { column: 2, row: 2 }],
    ["Home", { column: 0, row: 1 }],
    ["End", { column: 5, row: 1 }],
  ])("moves on %s", (key, expected) => {
    expect(nextCell(middle, key, shape)).toEqual(expected);
  });

  it.each([
    ["ArrowLeft", { column: 0, row: 0 }],
    ["ArrowUp", { column: 0, row: 0 }],
  ])("clamps at the top-left corner on %s", (key) => {
    expect(nextCell({ column: 0, row: 0 }, key, shape)).toEqual({
      column: 0,
      row: 0,
    });
  });

  it.each(["ArrowRight", "ArrowDown"])(
    "clamps at the bottom-right corner on %s",
    (key) => {
      expect(nextCell({ column: 5, row: 2 }, key, shape)).toEqual({
        column: 5,
        row: 2,
      });
    },
  );

  it("jumps to the first cell on Ctrl+Home", () => {
    expect(nextCell(middle, "Home", { ...shape, ctrlKey: true })).toEqual({
      column: 0,
      row: 0,
    });
  });

  it("jumps to the last cell on Ctrl+End", () => {
    expect(nextCell(middle, "End", { ...shape, ctrlKey: true })).toEqual({
      column: 5,
      row: 2,
    });
  });

  it("pages by whole screens, clamped to the grid", () => {
    expect(nextCell(middle, "PageDown", shape)).toEqual({ column: 2, row: 2 });
    expect(nextCell(middle, "PageUp", shape)).toEqual({ column: 2, row: 0 });
  });

  it("leaves keys it does not own alone", () => {
    expect(nextCell(middle, "a", shape)).toBeNull();
  });
});

it.each(["0", "9", ",", "."])("opens the editor on %s", (key) => {
  expect(isDurationKey(key)).toBe(true);
});

it.each(["a", "Enter", "Shift", " "])("ignores %s", (key) => {
  expect(isDurationKey(key)).toBe(false);
});
