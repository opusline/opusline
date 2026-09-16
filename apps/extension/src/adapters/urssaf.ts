import type { HandoffPayload } from "@opusline/portal-handoff";

import { ext } from "../lib/ext";
import { locateByLabel, locateBySelectors } from "../lib/locate";
import type { PortalAdapter } from "../lib/run-portal";

export type UrssafField = "turnover";

/**
 * The auto-entrepreneur turnover form lists one amount per activity; Opusline
 * only knows BNC services, so that is the only line typed. Wording beats ids:
 * the label says BNC, the sibling BIC lines do not.
 *
 * Selectors are refined against fixtures/urssaf-form.html once captured; until
 * then the label match is the whole strategy.
 */
const TURNOVER_SELECTORS: readonly string[] = [];
const TURNOVER_LABEL = /\bBNC\b/;

function locateTurnover(doc: Document): HTMLInputElement | null {
  return (
    locateBySelectors(doc, TURNOVER_SELECTORS) ??
    locateByLabel(doc, TURNOVER_LABEL)
  );
}

export const urssafAdapter: PortalAdapter<UrssafField> = {
  portal: "urssaf",
  isFormPresent: (doc) => locateTurnover(doc) !== null,
  fields: [{ key: "turnover", locate: locateTurnover }],
  values: (payload: HandoffPayload) =>
    payload.portal === "urssaf" ? { turnover: payload.fields.turnover } : {},
  fieldLabel: () => ext.i18n.getMessage("field_turnover"),
};
