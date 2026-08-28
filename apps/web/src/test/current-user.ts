import type { UserData } from "@opusline/api-client";
import { currentUserQueryKey } from "@opusline/api-client/react-query";
import type { QueryClient } from "@tanstack/react-query";

import { APP_VERSION } from "@/lib/version";

export const CURRENT_USER_FIXTURE: UserData = {
  id: 1,
  name: "Theo",
  email: "theo@example.com",
  theme: 0,
  releaseNotesSeenVersion: APP_VERSION,
  locale: "fr-FR",
  dateFormat: 0,
  currency: "EUR",
  businessCountry: "FR",
  hasFrenchFiscality: true,
  vatLiable: true,
  effectiveVatRateBp: 2000,
  effectiveContributionRateBp: 2600,
  timezone: "Europe/Paris",
  workdayMinutes: 420,
};

/** Seeds the authed layout's current-user cache; override only what the test is about. */
export function seedCurrentUser(
  queryClient: QueryClient,
  overrides: Partial<UserData> = {},
): void {
  queryClient.setQueryData(currentUserQueryKey(), {
    ...CURRENT_USER_FIXTURE,
    ...overrides,
  });
}
