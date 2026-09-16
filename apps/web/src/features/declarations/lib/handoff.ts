import type {
  UrssafDeclarationData,
  VatDeclarationData,
} from "@opusline/api-client";
import {
  HANDOFF_VERSION,
  type HandoffPayload,
  handoffUrl,
} from "@opusline/portal-handoff";

import { wholeUnits } from "@/lib/billing";

export const EXTENSION_DOCS_URL =
  "https://github.com/opusline/opusline/blob/main/docs/browser-extension.md";

/** What the extension types on autoentrepreneur.urssaf.fr: the collected base, whole euros. */
export function urssafHandoff(
  urssaf: UrssafDeclarationData,
  issuedAt: Date = new Date(),
): HandoffPayload {
  return {
    v: HANDOFF_VERSION,
    portal: "urssaf",
    period: urssaf.period,
    issuedAt: issuedAt.toISOString(),
    fields: { turnover: wholeUnits(urssaf.base.amount) },
  };
}

/**
 * The CA3 lines the card shows, keyed by box: the same list as `ca3Rows`, so
 * box 25 only travels when the month ends in credit.
 */
export function vatHandoff(
  vat: VatDeclarationData,
  issuedAt: Date = new Date(),
): HandoffPayload {
  const { boxes } = vat;

  return {
    v: HANDOFF_VERSION,
    portal: "impots",
    period: vat.period,
    issuedAt: issuedAt.toISOString(),
    fields: {
      A1: wholeUnits(boxes.salesHt.amount),
      "2A": wholeUnits(boxes.intraCommunityPurchasesHt.amount),
      "3B": wholeUnits(boxes.nonEuPurchasesHt.amount),
      "08": wholeUnits(boxes.taxableBase.amount),
      "08_tax": wholeUnits(boxes.collected.amount),
      "19": wholeUnits(boxes.fixedAssets.amount),
      "20": wholeUnits(boxes.goodsAndServices.amount),
      "21": wholeUnits(boxes.otherDeductible.amount),
      "22": wholeUnits(boxes.creditCarried.amount),
      ...(boxes.credit.amount > 0
        ? { "25": wholeUnits(boxes.credit.amount) }
        : {}),
      "32": wholeUnits(boxes.due.amount),
    },
  };
}

export function prefillHref(payload: HandoffPayload): string {
  return handoffUrl(payload);
}
