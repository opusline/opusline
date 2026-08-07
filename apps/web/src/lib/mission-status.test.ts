import { expect, it } from "vitest";

import { missionStatusBadge } from "./mission-status";

it("reads a mission on an internal client as Perso whatever its status", () => {
  expect(missionStatusBadge(0, 2)).toEqual({
    variant: "quiet",
    label: "Perso",
  });
  expect(missionStatusBadge(2, 2)).toEqual({
    variant: "quiet",
    label: "Perso",
  });
});

it("keeps the lifecycle status for a direct client", () => {
  expect(missionStatusBadge(0, 0)).toEqual({
    variant: "brand",
    label: "Active",
  });
});

it("keeps the lifecycle status for an intermediary client", () => {
  expect(missionStatusBadge(2, 1)).toEqual({
    variant: "neutral",
    label: "Terminée",
  });
});
