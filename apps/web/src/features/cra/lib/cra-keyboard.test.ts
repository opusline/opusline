import { describe, expect, it } from "vitest";

import { nextCell } from "./cra-keyboard";

const shape = { columnCount: 7, ctrlKey: false, rowCount: 4 };
const middle = { column: 3, row: 1 };

describe("nextCell", () => {
  it.each([
    ["ArrowLeft", { column: 2, row: 1 }],
    ["ArrowRight", { column: 4, row: 1 }],
    ["ArrowUp", { column: 3, row: 0 }],
    ["ArrowDown", { column: 3, row: 2 }],
    ["Home", { column: 0, row: 1 }],
    ["End", { column: 6, row: 1 }],
    ["PageUp", { column: 3, row: 0 }],
    ["PageDown", { column: 3, row: 3 }],
  ])("moves on %s", (key, expected) => {
    expect(nextCell(middle, key, shape)).toEqual(expected);
  });

  it("wraps past the end of a week onto the next Monday", () => {
    expect(nextCell({ column: 6, row: 1 }, "ArrowRight", shape)).toEqual({
      column: 0,
      row: 2,
    });
  });

  it("wraps before the start of a week onto the previous Sunday", () => {
    expect(nextCell({ column: 0, row: 2 }, "ArrowLeft", shape)).toEqual({
      column: 6,
      row: 1,
    });
  });

  it("stops at the first cell of the month", () => {
    expect(nextCell({ column: 0, row: 0 }, "ArrowLeft", shape)).toEqual({
      column: 0,
      row: 0,
    });
  });

  it("stops at the last cell of the month", () => {
    expect(nextCell({ column: 6, row: 3 }, "ArrowRight", shape)).toEqual({
      column: 6,
      row: 3,
    });
  });

  it.each([
    ["ArrowUp", { column: 3, row: 0 }],
    ["ArrowDown", { column: 3, row: 3 }],
  ])("stays put on %s at its edge", (key, edge) => {
    expect(nextCell(edge, key, shape)).toEqual(edge);
  });

  it("jumps to the first cell on Ctrl+Home", () => {
    expect(nextCell(middle, "Home", { ...shape, ctrlKey: true })).toEqual({
      column: 0,
      row: 0,
    });
  });

  it("jumps to the last cell on Ctrl+End", () => {
    expect(nextCell(middle, "End", { ...shape, ctrlKey: true })).toEqual({
      column: 6,
      row: 3,
    });
  });

  it("leaves keys that are not the grid's business alone", () => {
    expect(nextCell(middle, "Enter", shape)).toBeNull();
    expect(nextCell(middle, "a", shape)).toBeNull();
  });
});
