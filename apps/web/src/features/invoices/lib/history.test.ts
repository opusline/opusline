import { expect, it } from "vitest";

import { invoiceDetail } from "./fixtures";
import { sentOnFrom } from "./history";

it("reads the send date off the invoice history", () => {
  const detail = invoiceDetail({ status: 1 });

  expect(
    sentOnFrom({
      ...detail,
      history: [{ id: 9, kind: 1, occurredOn: "2026-07-02", note: null }],
    }),
  ).toBe("2026-07-02");
});

it("falls back to the issue date when nothing recorded the send", () => {
  const detail = invoiceDetail({ status: 1, issuedOn: "2026-06-30" });

  expect(sentOnFrom({ ...detail, history: [] })).toBe("2026-06-30");
});

it("ignores the other events on the way", () => {
  const detail = invoiceDetail({ status: 2 });

  expect(
    sentOnFrom({
      ...detail,
      history: [
        { id: 1, kind: 0, occurredOn: "2026-06-28", note: null },
        { id: 2, kind: 1, occurredOn: "2026-06-30", note: null },
        { id: 3, kind: 3, occurredOn: "2026-07-24", note: null },
      ],
    }),
  ).toBe("2026-06-30");
});
