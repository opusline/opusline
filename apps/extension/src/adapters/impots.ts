import {
  CA3_BOXES,
  type Ca3Box,
  type HandoffPayload,
} from "@opusline/portal-handoff";

import { ext } from "../lib/ext";
import {
  locateByLabel,
  locateBySelectors,
  locateInRow,
  nextInputInRow,
} from "../lib/locate";
import type { PortalAdapter } from "../lib/run-portal";

/**
 * The 3310-CA3 télédéclaration names every line by its code (A1, 08, 20…).
 * Lines the portal computes itself (the tax column, 25, 32) come back as
 * skipped rather than being forced.
 *
 * Selectors are refined against fixtures/ca3-form.html once captured; until
 * then the line code in the label or the row heading is the whole strategy.
 */
const SELECTORS: Partial<Record<Ca3Box, readonly string[]>> = {};

/** The code as a standalone token, not the « 20 » of « Taux normal 20 % » on line 08. */
function boxPattern(box: string): RegExp {
  return new RegExp(`(^|[^\\w])${box}(?![\\w]|\\s*%)`);
}

function locateBox(box: Exclude<Ca3Box, "08_tax">) {
  const pattern = boxPattern(box);

  return (doc: Document): HTMLInputElement | null =>
    locateBySelectors(doc, SELECTORS[box] ?? []) ??
    locateByLabel(doc, pattern) ??
    locateInRow(doc, pattern);
}

const locateBase08 = locateBox("08");

function locateTax08(doc: Document): HTMLInputElement | null {
  const explicit = locateBySelectors(doc, SELECTORS["08_tax"] ?? []);
  if (explicit !== null) {
    return explicit;
  }
  const base = locateBase08(doc);

  return base === null ? null : nextInputInRow(base);
}

export const impotsAdapter: PortalAdapter<Ca3Box> = {
  portal: "impots",
  isFormPresent: (doc) => locateBox("A1")(doc) !== null,
  fields: CA3_BOXES.map((box) => ({
    key: box,
    locate: box === "08_tax" ? locateTax08 : locateBox(box),
  })),
  values: (payload: HandoffPayload) =>
    payload.portal === "impots" ? payload.fields : {},
  fieldLabel: (box) =>
    ext.i18n.getMessage("field_box", [box === "08_tax" ? "08 (taxe)" : box]),
};
