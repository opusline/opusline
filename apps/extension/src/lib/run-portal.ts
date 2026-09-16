import type { HandoffPayload, Portal } from "@opusline/portal-handoff";

import { showBanner } from "./banner";
import { captureHandoff } from "./capture";
import { ext } from "./ext";
import { type FillField, fillFields } from "./fill";
import { clearHandoff, loadHandoff } from "./handoff-storage";
import { periodLabel } from "./period-label";
import { WaitTimeoutError, waitFor } from "./wait-for";

export type PortalAdapter<Key extends string> = {
  portal: Portal;
  isFormPresent: (doc: Document) => boolean;
  fields: readonly FillField<Key>[];
  /** The figures this adapter types, keyed by field; anything else in the payload is ignored. */
  values: (payload: HandoffPayload) => Partial<Record<Key, number>>;
  fieldLabel: (key: Key) => string;
};

export type PortalEnvironment = {
  document: Document;
  location: Location;
  history: History;
  /** How long to watch for the form: the user still has to log in and navigate to it. */
  formTimeoutMs: number;
  now: () => Date;
};

/**
 * One content script per portal host: park a payload arriving in the URL,
 * then, when one is waiting, fill the form as soon as it renders. Pages with
 * nothing pending cost one storage read and no observer.
 */
export async function runPortal<Key extends string>(
  adapter: PortalAdapter<Key>,
  env: PortalEnvironment,
): Promise<void> {
  await captureHandoff(adapter.portal, env.location, env.history);

  const payload = await loadHandoff(adapter.portal, env.now());
  if (payload === null) {
    return;
  }

  try {
    await waitFor(
      () => (adapter.isFormPresent(env.document) ? env.document : null),
      { timeoutMs: env.formTimeoutMs, target: env.document },
    );
  } catch (error) {
    if (error instanceof WaitTimeoutError) {
      return;
    }
    throw error;
  }

  const outcome = fillFields(
    adapter.fields,
    adapter.values(payload),
    env.document,
  );
  await clearHandoff(adapter.portal);

  showBanner(env.document, {
    title: ext.i18n.getMessage("banner_title", [
      periodLabel(payload.period, ext.i18n.getUILanguage()),
    ]),
    filled: outcome.filled.map(({ key }) => adapter.fieldLabel(key)),
    skipped: outcome.skipped.map(({ key }) => adapter.fieldLabel(key)),
  });
}

export const FORM_TIMEOUT_MS = 15 * 60 * 1000;

export function browserEnvironment(): PortalEnvironment {
  return {
    document,
    location,
    history,
    formTimeoutMs: FORM_TIMEOUT_MS,
    now: () => new Date(),
  };
}
