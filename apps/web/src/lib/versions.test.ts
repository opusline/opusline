import { expect, it } from "vitest";

import { compareVersions, isReleaseUnread, releaseType } from "./versions";

it("compares version segments numerically, not lexicographically", () => {
  expect(compareVersions("0.10.0", "0.9.1")).toBe(1);
  expect(compareVersions("0.9.1", "0.10.0")).toBe(-1);
});

it("treats equal versions as equal", () => {
  expect(compareVersions("1.2.3", "1.2.3")).toBe(0);
});

it("pads missing segments with zero", () => {
  expect(compareVersions("1.2", "1.2.0")).toBe(0);
  expect(compareVersions("1.2", "1.2.1")).toBe(-1);
});

it("marks every release unread when nothing was ever seen", () => {
  expect(isReleaseUnread("0.1.0", null)).toBe(true);
});

it("marks only strictly newer releases unread", () => {
  expect(isReleaseUnread("0.10.0", "0.9.0")).toBe(true);
  expect(isReleaseUnread("0.9.0", "0.9.0")).toBe(false);
  expect(isReleaseUnread("0.8.0", "0.9.0")).toBe(false);
});

it("derives the release type from the version number", () => {
  expect(releaseType("0.9.1")).toBe("patch");
  expect(releaseType("0.10.0")).toBe("minor");
  expect(releaseType("1.0.0")).toBe("major");
});
