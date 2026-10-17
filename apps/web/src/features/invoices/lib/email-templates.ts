import type { EmailTemplateKind } from "@opusline/api-client";

import { m } from "@/paraglide/messages.js";

/** In the order the page lists them: what goes out most often first. */
export const EMAIL_TEMPLATE_KINDS: readonly EmailTemplateKind[] = [0, 1, 3, 2];

export const EMAIL_KIND_TOKENS: Record<EmailTemplateKind, string> = {
  0: "new-invoice",
  1: "new-quote",
  2: "credit-note",
  3: "payment-reminder",
};

const KIND_LABELS: Record<EmailTemplateKind, () => string> = {
  0: m.emails_kind_new_invoice,
  1: m.emails_kind_new_quote,
  2: m.emails_kind_credit_note,
  3: m.emails_kind_payment_reminder,
};

const KIND_DETAILS: Record<EmailTemplateKind, () => string> = {
  0: m.emails_kind_new_invoice_detail,
  1: m.emails_kind_new_quote_detail,
  2: m.emails_kind_credit_note_detail,
  3: m.emails_kind_payment_reminder_detail,
};

export function emailKindLabel(kind: EmailTemplateKind): string {
  return KIND_LABELS[kind]();
}

export function emailKindDetail(kind: EmailTemplateKind): string {
  return KIND_DETAILS[kind]();
}

export type EmailTemplateDraft = {
  subject: string;
  body: string;
};

/**
 * Drops a `{name}` token where the caret is, or at the end when the field has
 * not been focused yet, and says where the caret should land afterwards.
 */
export function insertToken(
  text: string,
  token: string,
  selectionStart: number | null,
  selectionEnd: number | null,
): { text: string; caret: number } {
  const start = selectionStart ?? text.length;
  const end = selectionEnd ?? start;
  const inserted = `{${token}}`;

  return {
    text: text.slice(0, start) + inserted + text.slice(end),
    caret: start + inserted.length,
  };
}
