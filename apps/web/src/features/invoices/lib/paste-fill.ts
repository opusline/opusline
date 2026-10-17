import type {
  ClientWithMissionsData,
  InvoicingSettingsData,
  LineUnit,
} from "@opusline/api-client";

import { formatAmount, type MoneyFormat } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

import type { EditorKind } from "../components/invoice-editor-page";
import {
  formatQuantity,
  type InvoiceDraft,
  type LineDraft,
  lineKey,
  withClient,
} from "./invoice-draft";
import {
  PAYMENT_TERMS,
  paymentTermKey,
  QUOTE_VALIDITY_DAYS,
} from "./invoicing-settings";
import { VAT_RATES_BP } from "./line-units";

/**
 * The tagged block an AI answers with when given the prompt below. The tag
 * names are the format, in French whatever the interface language, so a
 * prompt copied in English still produces a block Opusline reads.
 */
export type PastedDocument = {
  kind: EditorKind | null;
  client: string | null;
  title: string | null;
  description: string | null;
  lines: PastedLine[];
  paymentTerm: string | null;
  validityDays: number | null;
  depositPercent: number | null;
};

export type PastedLine = {
  label: string;
  detail: string;
  quantity: number | null;
  unit: string;
  unitPrice: number | null;
  vatPercent: number | null;
};

export type FilledField =
  | { kind: "client"; name: string }
  | { kind: "title" }
  | { kind: "description" }
  | { kind: "lines"; count: number }
  | { kind: "term" }
  | { kind: "validity"; days: number }
  | { kind: "deposit"; percent: number };

const DOCUMENT_BLOCK = /<opusline-document[\s\S]*?<\/opusline-document>/i;

const UNITS: Record<string, LineUnit> = {
  j: 0,
  jour: 0,
  jours: 0,
  h: 1,
  heure: 1,
  heures: 1,
  forfait: 2,
  u: 3,
  unite: 3,
};

/** Null when the text holds no block Opusline can read: free text is not parsed. */
export function parsePastedDocument(text: string): PastedDocument | null {
  const block = DOCUMENT_BLOCK.exec(text);

  if (block === null) {
    return null;
  }

  // An AI writes « & » as prose would; XML wants it escaped.
  const xml = block[0].replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+);)/g, "&amp;");
  const document = new DOMParser().parseFromString(xml, "application/xml");

  if (document.getElementsByTagName("parsererror").length > 0) {
    return null;
  }

  const root = document.documentElement;
  const type = root.getAttribute("type")?.toLowerCase() ?? "";

  return {
    kind: type === "facture" ? "invoice" : type === "devis" ? "quote" : null,
    client: childText(root, "client"),
    title: childText(root, "titre"),
    description: childText(root, "description"),
    lines: Array.from(root.children)
      .filter((child) => child.tagName.toLowerCase() === "ligne")
      .map((line) => ({
        label: childText(line, "designation") ?? "",
        detail: childText(line, "detail") ?? "",
        quantity: parseNumber(childText(line, "quantite")),
        unit: (childText(line, "unite") ?? "").toLowerCase(),
        unitPrice: parseNumber(childText(line, "prix_unitaire_ht")),
        vatPercent: parseNumber(childText(line, "tva")),
      })),
    paymentTerm: childText(root, "delai_paiement")?.toLowerCase() ?? null,
    validityDays: parseNumber(childText(root, "validite_jours")),
    depositPercent: parseNumber(childText(root, "acompte_pourcent")),
  };
}

function childText(parent: Element, tag: string): string | null {
  const child = Array.from(parent.children).find(
    (candidate) => candidate.tagName.toLowerCase() === tag,
  );
  const text = child?.textContent?.trim() ?? "";

  return text === "" ? null : text;
}

function parseNumber(text: string | null): number | null {
  if (text === null) {
    return null;
  }

  const value = Number.parseFloat(text.replace(/\s/g, "").replace(",", "."));

  return Number.isFinite(value) ? value : null;
}

type FillContext = {
  kind: EditorKind;
  clients: ClientWithMissionsData[];
  settings: InvoicingSettingsData;
  /** The rate a line falls back to; 0 under the franchise, where every line is 0. */
  defaultVatRateBp: number;
};

/**
 * The pasted block applied to the draft: the client it names when one of the
 * account's clients matches, the lines added to the ones already there, and
 * the terms the kind of document takes. Everything stays editable.
 */
export function fillDraft(
  format: MoneyFormat,
  draft: InvoiceDraft,
  pasted: PastedDocument,
  context: FillContext,
): { draft: InvoiceDraft; filled: FilledField[] } {
  const filled: FilledField[] = [];
  let next = draft;

  const client = matchClient(pasted.client, context.clients);

  if (client !== null) {
    next = withClient(next, client, context.settings);
    filled.push({ kind: "client", name: client.name });
  }

  if (pasted.title !== null) {
    next = { ...next, title: pasted.title };
    filled.push({ kind: "title" });
  }

  if (pasted.description !== null) {
    next = { ...next, description: pasted.description };
    filled.push({ kind: "description" });
  }

  if (pasted.lines.length > 0) {
    next = {
      ...next,
      lines: [
        ...next.lines,
        ...pasted.lines.map((line) =>
          lineDraft(format, line, context.defaultVatRateBp),
        ),
      ],
    };
    filled.push({ kind: "lines", count: pasted.lines.length });
  }

  const paymentTerm = paymentTermFromTag(pasted.paymentTerm);

  if (paymentTerm !== null) {
    next = { ...next, paymentTerm };
    filled.push({ kind: "term" });
  }

  if (context.kind === "quote") {
    const validity = pasted.validityDays;

    if (
      validity !== null &&
      (QUOTE_VALIDITY_DAYS as readonly number[]).includes(validity)
    ) {
      next = { ...next, validityDays: validity };
      filled.push({ kind: "validity", days: validity });
    }

    const deposit = pasted.depositPercent;

    if (deposit !== null && deposit > 0 && deposit <= 100) {
      next = { ...next, depositRateBp: Math.round(deposit * 100) };
      filled.push({ kind: "deposit", percent: deposit });
    }
  }

  return { draft: next, filled };
}

function matchClient(
  name: string | null,
  clients: ClientWithMissionsData[],
): ClientWithMissionsData | null {
  if (name === null) {
    return null;
  }

  const wanted = comparable(name);

  return (
    clients.find(
      (client) =>
        client.archivedAt === null && comparable(client.name) === wanted,
    ) ?? null
  );
}

/** Case and accents aside: an AI may well write « Societe » for « Société ». */
function comparable(name: string): string {
  return name.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

function lineDraft(
  format: MoneyFormat,
  line: PastedLine,
  defaultVatRateBp: number,
): LineDraft {
  const quantity =
    line.quantity !== null && line.quantity > 0 ? line.quantity : 1;
  const vatBp =
    line.vatPercent === null ? null : Math.round(line.vatPercent * 100);

  return {
    key: lineKey(),
    label: line.label,
    detail: line.detail,
    quantity: formatQuantity(format.locale, Math.round(quantity * 1000)),
    unit: UNITS[line.unit] ?? 2,
    unitPrice:
      line.unitPrice === null
        ? ""
        : formatAmount(format, Math.round(line.unitPrice * 100)),
    vatRateBp:
      defaultVatRateBp === 0
        ? 0
        : vatBp !== null && (VAT_RATES_BP as readonly number[]).includes(vatBp)
          ? vatBp
          : defaultVatRateBp,
  };
}

/** `30`, `30fm` or `fm` as the prompt allows, when it names a term the editor offers. */
function paymentTermFromTag(tag: string | null): string | null {
  if (tag === null) {
    return null;
  }

  const key = tag === "fm" ? "0fm" : tag;

  return PAYMENT_TERMS.some((term) => paymentTermKey(term) === key)
    ? key
    : null;
}

const TAG_INDENT = "  ";

/** The prompt to hand an AI, so its answer comes back in the tagged format. */
export function pasteFillPrompt(
  kind: EditorKind,
  clientNames: string[],
  currency: string,
): string {
  const isQuote = kind === "quote";
  const quoteTags = isQuote
    ? [
        `${TAG_INDENT}<validite_jours>30</validite_jours>`,
        `${TAG_INDENT}<acompte_pourcent>30</acompte_pourcent>`,
      ]
    : [];
  const rules = [
    clientNames.length === 0
      ? m.paste_prompt_rule_client_any()
      : m.paste_prompt_rule_client({ clients: clientNames.join(", ") }),
    m.paste_prompt_rule_line(),
    m.paste_prompt_rule_unit(),
    m.paste_prompt_rule_price({ currency }),
    m.paste_prompt_rule_vat(),
    m.paste_prompt_rule_term(),
    ...(isQuote ? [m.paste_prompt_rule_quote()] : []),
    m.paste_prompt_rule_no_invent(),
  ];

  return [
    m.paste_prompt_intro({
      document: isQuote
        ? m.paste_prompt_document_quote()
        : m.paste_prompt_document_invoice(),
    }),
    "",
    m.paste_prompt_only_block(),
    "",
    `<opusline-document type="${isQuote ? "devis" : "facture"}">`,
    `${TAG_INDENT}<client>${m.paste_prompt_ph_client()}</client>`,
    `${TAG_INDENT}<titre>${m.paste_prompt_ph_title()}</titre>`,
    `${TAG_INDENT}<description>${m.paste_prompt_ph_description()}</description>`,
    `${TAG_INDENT}<ligne>`,
    `${TAG_INDENT}${TAG_INDENT}<designation>${m.paste_prompt_ph_designation()}</designation>`,
    `${TAG_INDENT}${TAG_INDENT}<detail>${m.paste_prompt_ph_detail()}</detail>`,
    `${TAG_INDENT}${TAG_INDENT}<quantite>6</quantite>`,
    `${TAG_INDENT}${TAG_INDENT}<unite>j</unite>`,
    `${TAG_INDENT}${TAG_INDENT}<prix_unitaire_ht>480</prix_unitaire_ht>`,
    `${TAG_INDENT}${TAG_INDENT}<tva>20</tva>`,
    `${TAG_INDENT}</ligne>`,
    `${TAG_INDENT}<delai_paiement>30</delai_paiement>`,
    ...quoteTags,
    "</opusline-document>",
    "",
    m.paste_prompt_rules(),
    ...rules.map((rule) => `- ${rule}`),
    "",
    isQuote ? m.paste_prompt_outro_quote() : m.paste_prompt_outro_invoice(),
    m.paste_prompt_outro_placeholder(),
  ].join("\n");
}

/** A block to try the panel with, naming a client of the fictional cast. */
export function pasteFillSample(kind: EditorKind): string {
  const isQuote = kind === "quote";
  const quoteTags = isQuote
    ? [
        `${TAG_INDENT}<validite_jours>30</validite_jours>`,
        `${TAG_INDENT}<acompte_pourcent>30</acompte_pourcent>`,
      ]
    : [];

  return [
    `<opusline-document type="${isQuote ? "devis" : "facture"}">`,
    `${TAG_INDENT}<client>Nordlys</client>`,
    `${TAG_INDENT}<titre>${m.paste_sample_title()}</titre>`,
    `${TAG_INDENT}<ligne>`,
    `${TAG_INDENT}${TAG_INDENT}<designation>${m.paste_sample_workshop()}</designation>`,
    `${TAG_INDENT}${TAG_INDENT}<detail>${m.paste_sample_workshop_detail()}</detail>`,
    `${TAG_INDENT}${TAG_INDENT}<quantite>1</quantite>`,
    `${TAG_INDENT}${TAG_INDENT}<unite>forfait</unite>`,
    `${TAG_INDENT}${TAG_INDENT}<prix_unitaire_ht>300</prix_unitaire_ht>`,
    `${TAG_INDENT}${TAG_INDENT}<tva>20</tva>`,
    `${TAG_INDENT}</ligne>`,
    `${TAG_INDENT}<ligne>`,
    `${TAG_INDENT}${TAG_INDENT}<designation>${m.paste_sample_development()}</designation>`,
    `${TAG_INDENT}${TAG_INDENT}<quantite>6</quantite>`,
    `${TAG_INDENT}${TAG_INDENT}<unite>j</unite>`,
    `${TAG_INDENT}${TAG_INDENT}<prix_unitaire_ht>480</prix_unitaire_ht>`,
    `${TAG_INDENT}${TAG_INDENT}<tva>20</tva>`,
    `${TAG_INDENT}</ligne>`,
    `${TAG_INDENT}<delai_paiement>30fm</delai_paiement>`,
    ...quoteTags,
    "</opusline-document>",
  ].join("\n");
}
