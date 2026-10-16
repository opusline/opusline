import assert from "node:assert/strict";
import { test } from "node:test";

import { lastRateBp, semesterOf } from "./legal-reference.mjs";

test("places a day in its semester", () => {
  assert.deepEqual(semesterOf("2027-01-01"), {
    semester: "2027-H1",
    startsOn: "2027-01-01",
    nextRevisionOn: "2027-07-01",
  });
  assert.deepEqual(semesterOf("2026-07-15"), {
    semester: "2026-H2",
    startsOn: "2026-07-01",
    nextRevisionOn: "2027-01-01",
  });
});

test("reads the last rate of an ECB csv response in basis points", () => {
  const csv = [
    "KEY,FREQ,TIME_PERIOD,OBS_VALUE,OBS_STATUS",
    "FM.B.U2.EUR.4F.KR.MRR_FR.LEV,B,2026-06-30,2.4,A",
    "FM.B.U2.EUR.4F.KR.MRR_FR.LEV,B,2026-07-01,2.15,A",
  ].join("\n");

  assert.equal(lastRateBp(csv), 215);
});

test("refuses a response without a rate", () => {
  assert.throws(() => lastRateBp("KEY,TIME_PERIOD\n"));
});
