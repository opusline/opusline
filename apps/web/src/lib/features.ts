import type { FeatureFlag, UserData } from "@opusline/api-client";
import { currentUserOptions } from "@opusline/api-client/react-query";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";

/** Writing, issuing and rendering invoices in Opusline, still in beta. */
export const INVOICING: FeatureFlag = 0;

/** The API resolved them, the instance's release and the account's beta choices included. */
export function hasFeature(
  user: Pick<UserData, "features">,
  flag: FeatureFlag,
): boolean {
  return user.features.includes(flag);
}

export function useFeature(flag: FeatureFlag): boolean {
  const { data: user } = useQuery(currentUserOptions());

  return user !== undefined && hasFeature(user, flag);
}

/**
 * For a flagged screen's `beforeLoad`: without the flag, its API answers 404,
 * so the screen sends the account back to the ledger it already knows.
 */
export function requireInvoicing(user: Pick<UserData, "features">): void {
  if (!hasFeature(user, INVOICING)) {
    throw redirect({ to: "/invoicing/invoices", replace: true });
  }
}
