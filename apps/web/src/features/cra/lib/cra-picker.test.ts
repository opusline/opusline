import { expect, it } from "vitest";

import { craItemKey, groupCras, matchesQuery } from "./cra-picker";
import { craItem } from "./fixtures";

const items = [
  craItem({ id: null, month: "2026-07", status: 0 }),
  craItem({ id: 2, month: "2026-06", status: 1 }),
  craItem({
    id: 3,
    month: "2026-05",
    status: 2,
    missionName: "Lunaprint maintenance",
    clientName: "Lunaprint",
  }),
];

it("files each CRA under what it is waiting on", () => {
  const groups = groupCras(items, "");

  expect(groups.map((group) => group.label)).toEqual([
    "À produire",
    "En attente de signature",
    "Signés",
  ]);
});

it("leaves out a group nothing falls into", () => {
  const groups = groupCras([items[0]], "");

  expect(groups).toHaveLength(1);
  expect(groups[0].label).toBe("À produire");
});

it("matches on the mission", () => {
  expect(matchesQuery(items[0], "callisto")).toBe(true);
});

it("matches on the client", () => {
  expect(matchesQuery(items[0], "nordlys")).toBe(true);
});

it("matches on the month as the API writes it", () => {
  expect(matchesQuery(items[0], "2026-07")).toBe(true);
});

it("matches on the month as a human writes it", () => {
  expect(matchesQuery(items[0], "juillet")).toBe(true);
});

it("ignores accents in either direction", () => {
  // Folding applies to both sides, so neither the typist nor the mission name has to
  // guess which spelling the other used.
  expect(
    matchesQuery(craItem({ missionName: "Refonte éditoriale" }), "editoriale"),
  ).toBe(true);
  expect(
    matchesQuery(craItem({ missionName: "Refonte editoriale" }), "éditoriale"),
  ).toBe(true);
});

it("ignores case and surrounding spaces", () => {
  expect(matchesQuery(items[0], "  CALLISTO  ")).toBe(true);
});

it("keeps everything when nothing has been typed", () => {
  expect(groupCras(items, "   ").flatMap((group) => group.items)).toHaveLength(
    3,
  );
});

it("narrows to what the search matches", () => {
  const groups = groupCras(items, "lunaprint");

  expect(groups).toHaveLength(1);
  expect(groups[0].items[0].missionName).toBe("Lunaprint maintenance");
});

it("tells two months of the same mission apart before either exists", () => {
  const july = craItem({ id: null, month: "2026-07" });
  const june = craItem({ id: null, month: "2026-06" });

  expect(craItemKey(july)).not.toBe(craItemKey(june));
});
