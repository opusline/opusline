import type { MissionBillingStepData } from "@opusline/api-client";

import { eur } from "@/test/fixtures";

/** One instalment of a fixed price, still to bill. */
export function billingStep(
  overrides: Partial<MissionBillingStepData> = {},
): MissionBillingStepData {
  return {
    id: 1,
    label: "Mise en production",
    amount: eur(240_000),
    position: 0,
    dueOn: null,
    isReady: false,
    invoiceId: null,
    invoiceStatus: null,
    ...overrides,
  };
}
