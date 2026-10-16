import { expect, it } from "vitest";
import {
  duplicateQuoteDraft,
  quoteDraftFromDetail,
  quoteDraftPayload,
} from "./quote-draft";
import { quoteDetail } from "./quote-fixtures";

const FORMAT = { locale: "fr-FR", currency: "EUR" } as const;

it("reopens a draft with its validity and deposit, and refuses a sent quote", () => {
  const draft = quoteDraftFromDetail(
    FORMAT,
    quoteDetail({ status: 0, number: null, depositRateBp: 4000 }),
  );

  expect(draft).toMatchObject({
    clientId: 1,
    validityDays: 30,
    depositRateBp: 4000,
    showIban: false,
    timeEntryIds: [],
  });
  expect(draft?.lines).toHaveLength(2);
  expect(quoteDraftFromDetail(FORMAT, quoteDetail())).toBeNull();
});

it("sends the quote's own fields and none of the invoice's", () => {
  const draft = duplicateQuoteDraft(FORMAT, quoteDetail());
  const payload = quoteDraftPayload(FORMAT, draft);

  expect(payload).toMatchObject({
    clientId: 1,
    validityDays: 30,
    depositRateBp: 3000,
    paymentTermsDays: 30,
    showEmail: true,
  });
  expect(payload).not.toHaveProperty("timeEntryIds");
  expect(payload).not.toHaveProperty("showIban");
  expect(payload?.lines).toHaveLength(2);
  expect(quoteDraftPayload(FORMAT, { ...draft, clientId: null })).toBeNull();
});
