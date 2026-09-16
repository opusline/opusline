import type { HandoffPayload, Portal } from "@opusline/portal-handoff";

import { ext } from "./ext";

/**
 * A payload waits in extension storage between the landing page, where the
 * fragment is read, and the form, which only renders after the portal's own
 * login. A week covers a declaration started on the wrong day; past that the
 * figures are dropped rather than typed into a later month's form.
 */
export const HANDOFF_TTL_MS = 7 * 24 * 60 * 60 * 1000;

function storageKey(portal: Portal): string {
  return `handoff:${portal}`;
}

export async function saveHandoff(payload: HandoffPayload): Promise<void> {
  await ext.storage.local.set({ [storageKey(payload.portal)]: payload });
}

export async function loadHandoff(
  portal: Portal,
  now: Date = new Date(),
): Promise<HandoffPayload | null> {
  const key = storageKey(portal);
  const stored = (await ext.storage.local.get(key))[key] as
    | HandoffPayload
    | undefined;
  if (stored === undefined) {
    return null;
  }
  if (now.getTime() - Date.parse(stored.issuedAt) > HANDOFF_TTL_MS) {
    await clearHandoff(portal);
    return null;
  }

  return stored;
}

export async function clearHandoff(portal: Portal): Promise<void> {
  await ext.storage.local.remove(storageKey(portal));
}
