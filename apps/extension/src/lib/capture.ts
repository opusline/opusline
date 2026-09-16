import { decodeHandoff, type Portal } from "@opusline/portal-handoff";

import { saveHandoff } from "./handoff-storage";

/**
 * Reads the payload the web app put in the landing URL's fragment and parks it
 * in storage. Runs at document_start, before the portal's own scripts, so the
 * fragment is still intact; it is stripped right after so those scripts never
 * see it. A payload addressed to another portal is not this script's to
 * consume, so it is left in place untouched.
 */
export async function captureHandoff(
  portal: Portal,
  location: Location,
  history: History,
): Promise<boolean> {
  const payload = decodeHandoff(location.hash);
  if (payload === null || payload.portal !== portal) {
    return false;
  }

  history.replaceState(null, "", location.pathname + location.search);
  await saveHandoff(payload);

  return true;
}
