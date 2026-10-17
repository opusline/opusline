import type { InvoiceDetailData, InvoicePaperData } from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button, buttonVariants } from "@opusline/ui/components/button";
import { Chip } from "@opusline/ui/components/chip";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@opusline/ui/components/field";
import { Input } from "@opusline/ui/components/input";
import {
  InputGroup,
  InputGroupInput,
  InputGroupSuffix,
} from "@opusline/ui/components/input-group";
import { NativeSelect } from "@opusline/ui/components/native-select";
import { Panel, PanelTitle } from "@opusline/ui/components/panel";
import { RadioCard, RadioGroup } from "@opusline/ui/components/radio-group";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, CircleAlert, Plus, X } from "lucide-react";
import { type ReactNode, useId } from "react";

import { useMoneyFormat } from "@/components/money-format-provider";
import {
  currencySymbol,
  formatAmountWithCents,
  formatPercentFromBp,
  formatQuantityDraft,
  formatSignedDraft,
} from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

import {
  CREDIT_NOTE_KIND_DETAILS,
  CREDIT_NOTE_KIND_LABELS,
  CREDIT_NOTE_KIND_TOKENS,
  CREDIT_NOTE_KINDS,
  CREDIT_NOTE_REASON_LABELS,
  CREDIT_NOTE_REASONS,
  CREDIT_NOTE_SETTLEMENT_LABELS,
  CREDIT_NOTE_SETTLEMENT_TOKENS,
  type CreditLineDraft,
  type CreditNoteDraft,
  freeCreditLine,
  hasReceivedMoney,
  lineFromInvoice,
  RETURN_SETTLEMENTS,
} from "../lib/credit-note-draft";
import { vatRateOptions } from "../lib/line-units";
import { InvoicePaper } from "./invoice-paper";
import { SwitchRow } from "./switch-row";

type CreditNoteEditorPageProps = {
  /** The invoice the credit note corrects, as it stands. */
  detail: InvoiceDetailData;
  draft: CreditNoteDraft;
  onChange: (draft: CreditNoteDraft) => void;
  /** The credit note as the client would receive it; null until it can be printed. */
  paper: InvoicePaperData | null;
  /** The next number of the credit notes' series, for the note under the form. */
  nextNumber: string;
  vatLiable: boolean;
  logoSrc?: string;
  isPending: boolean;
  error: string | null;
  canIssue: boolean;
  onIssue: () => void;
};

/** « Avoir »: corrects an issued invoice, which French rules forbid editing. */
export function CreditNoteEditorPage({
  detail,
  draft,
  onChange,
  paper,
  nextNumber,
  vatLiable,
  logoSrc,
  isPending,
  error,
  canIssue,
  onIssue,
}: CreditNoteEditorPageProps) {
  const format = useMoneyFormat();
  const { invoice, client } = detail;
  const update = (patch: Partial<CreditNoteDraft>) =>
    onChange({ ...draft, ...patch });
  const received = hasReceivedMoney(detail);
  const lines = detail.content?.lines ?? [];
  const total = paper?.totals.find((row) => row.emphasis)?.value ?? null;
  const number = invoice.number ?? "";
  // Taking the whole invoice back is only possible before any other credit note.
  const kinds = CREDIT_NOTE_KINDS.filter(
    (kind) =>
      (kind !== 0 || invoice.amountCredited.amount === 0) &&
      (kind !== 2 || invoice.amountDue.amount > 0),
  );

  return (
    <div className="pb-16" data-kind={CREDIT_NOTE_KIND_TOKENS[draft.kind]}>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link
          aria-label={m.credit_note_back()}
          className={buttonVariants({ size: "icon-lg", variant: "ghost" })}
          params={{ invoiceId: String(invoice.id) }}
          to="/invoicing/invoices/$invoiceId"
        >
          <ChevronLeft />
        </Link>
        <h1
          className="flex-1 font-heading font-semibold text-foreground-hi text-xl"
          data-testid="page-heading"
        >
          {m.credit_note_heading({ number })}
        </h1>
        {total === null ? null : (
          <span
            className="font-mono text-foreground-2 text-sm tabular-nums"
            data-testid="credit-note-total"
          >
            {m.credit_note_total({ amount: total })}
          </span>
        )}
        <Button
          data-testid="credit-note-issue"
          disabled={isPending || !canIssue}
          onClick={onIssue}
          size="xl"
        >
          {m.credit_note_issue()}
        </Button>
      </div>

      {error === null ? null : (
        <Alert className="mb-4" data-testid="credit-note-error" variant="warn">
          <CircleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-4">
          <Panel className="px-5 py-4 sm:px-7" padding="none">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-foreground-hi text-sm">
                {m.credit_note_invoice_ref({ number, client: client.name })}
              </span>
              <span
                className="font-mono text-muted-foreground-3 text-xs tabular-nums"
                data-amount-cents={invoice.amountDue.amount}
                data-testid="credit-note-invoice-due"
              >
                {m.credit_note_invoice_due({
                  amount: formatAmountWithCents(
                    format,
                    invoice.amountDue.amount,
                  ),
                })}
              </span>
            </div>
          </Panel>

          <Section title={m.credit_note_section_kind()}>
            <RadioGroup
              aria-label={m.credit_note_section_kind()}
              className="flex flex-col gap-2"
              onValueChange={(value) => {
                const kind = Number(value) as CreditNoteDraft["kind"];

                update({ kind, reissue: kind === 0 && draft.reissue });
              }}
              value={String(draft.kind)}
            >
              {kinds.map((kind) => (
                <RadioCard
                  data-kind={CREDIT_NOTE_KIND_TOKENS[kind]}
                  data-testid="credit-note-kind"
                  description={CREDIT_NOTE_KIND_DETAILS[kind]()}
                  key={kind}
                  title={CREDIT_NOTE_KIND_LABELS[kind]()}
                  value={String(kind)}
                />
              ))}
            </RadioGroup>
            {draft.kind === 0 ? (
              <div className="mt-3">
                <SwitchRow
                  checked={draft.reissue}
                  label={m.credit_note_reissue()}
                  onChange={(reissue) => update({ reissue })}
                  testId="credit-note-reissue"
                />
              </div>
            ) : null}
          </Section>

          <Section title={m.credit_note_section_lines()}>
            {draft.kind === 1 ? (
              <PartialLines
                draft={draft}
                invoiceLines={lines}
                onChange={onChange}
                vatLiable={vatLiable}
              />
            ) : (
              <p className="text-muted-foreground-3 text-sm">
                {draft.kind === 0
                  ? m.credit_note_lines_full()
                  : m.credit_note_lines_balance()}
              </p>
            )}
          </Section>

          <Section title={m.credit_note_section_reason()}>
            <div className="mb-4 flex flex-wrap gap-2">
              {CREDIT_NOTE_REASONS.map((reason) => (
                <Chip
                  data-reason={reason}
                  data-testid="credit-note-reason"
                  key={reason}
                  onPressedChange={() => update({ reason })}
                  pressed={draft.reason === reason}
                >
                  {CREDIT_NOTE_REASON_LABELS[reason]()}
                </Chip>
              ))}
            </div>
            <DetailField
              onChange={(detail) => update({ detail })}
              value={draft.detail}
            />
          </Section>

          <Section title={m.credit_note_section_amount()}>
            {received ? (
              <RadioGroup
                aria-label={m.credit_note_section_amount()}
                className="flex flex-col gap-2"
                onValueChange={(value) =>
                  update({
                    settlement: Number(value) as CreditNoteDraft["settlement"],
                  })
                }
                value={String(draft.settlement)}
              >
                {RETURN_SETTLEMENTS.map((settlement) => (
                  <RadioCard
                    data-settlement={CREDIT_NOTE_SETTLEMENT_TOKENS[settlement]}
                    data-testid="credit-note-settlement"
                    description={
                      settlement === 2
                        ? m.credit_note_refund_detail()
                        : m.credit_note_deduct_detail({ client: client.name })
                    }
                    key={settlement}
                    title={CREDIT_NOTE_SETTLEMENT_LABELS[settlement]()}
                    value={String(settlement)}
                  />
                ))}
              </RadioGroup>
            ) : (
              <p className="text-muted-foreground-3 text-sm">
                {m.credit_note_unpaid_note()}
              </p>
            )}
            <p className="mt-3 text-muted-foreground-3 text-xs leading-relaxed">
              {m.credit_note_number_note({ number: nextNumber })}
            </p>
          </Section>
        </div>

        <div className="min-w-0 xl:sticky xl:top-4">
          <p className="mb-3 text-muted-foreground-3 text-xs">
            {m.editor_preview()}
          </p>
          {paper === null ? (
            <Panel
              className="flex min-h-60 items-center justify-center text-center text-muted-foreground-3 text-sm"
              data-testid="credit-note-preview-empty"
            >
              {m.credit_note_preview_empty()}
            </Panel>
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-150">
                <InvoicePaper logoSrc={logoSrc} paper={paper} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Panel className="px-5 py-6 sm:px-7" padding="none">
      <PanelTitle className="mb-4">{title}</PanelTitle>
      {children}
    </Panel>
  );
}

function DetailField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const id = useId();

  return (
    <Field>
      <FieldLabel htmlFor={id}>{m.credit_note_detail()}</FieldLabel>
      <Input
        data-testid="credit-note-detail"
        id={id}
        maxLength={500}
        onChange={(event) => onChange(event.target.value)}
        placeholder={m.credit_note_detail_placeholder()}
        value={value}
      />
      <FieldDescription>{m.credit_note_detail_hint()}</FieldDescription>
    </Field>
  );
}

function PartialLines({
  draft,
  invoiceLines,
  vatLiable,
  onChange,
}: {
  draft: CreditNoteDraft;
  invoiceLines: NonNullable<InvoiceDetailData["content"]>["lines"];
  vatLiable: boolean;
  onChange: (draft: CreditNoteDraft) => void;
}) {
  const format = useMoneyFormat();
  const setLines = (lines: CreditLineDraft[]) => onChange({ ...draft, lines });
  const updateLine = (key: string, patch: Partial<CreditLineDraft>) =>
    setLines(
      draft.lines.map((line) =>
        line.key === key ? { ...line, ...patch } : line,
      ),
    );
  const defaultRate = invoiceLines[0]?.vatRateBp ?? 0;

  return (
    <>
      {draft.lines.length === 0 ? null : (
        <ol className="mb-4 flex flex-col gap-3">
          {draft.lines.map((line, index) => (
            <li
              className="rounded-md border bg-card px-3 py-3"
              data-from-invoice={line.invoiceLineId !== null}
              data-testid="credit-note-line"
              key={line.key}
            >
              <div className="mb-2 flex items-center gap-2">
                <Input
                  aria-label={m.editor_line_label()}
                  data-testid="credit-note-line-label"
                  onChange={(event) =>
                    updateLine(line.key, { label: event.target.value })
                  }
                  placeholder={m.editor_line_label()}
                  value={line.label}
                />
                <Button
                  aria-label={m.editor_line_remove({
                    number: String(index + 1),
                  })}
                  onClick={() =>
                    setLines(
                      draft.lines.filter((other) => other.key !== line.key),
                    )
                  }
                  size="icon-lg"
                  variant="ghost"
                >
                  <X />
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  aria-label={m.editor_line_quantity()}
                  data-testid="credit-note-line-quantity"
                  inputMode="decimal"
                  onChange={(event) =>
                    updateLine(line.key, {
                      quantity: formatQuantityDraft(
                        format.locale,
                        event.target.value,
                      ),
                    })
                  }
                  value={line.quantity}
                />
                <InputGroup>
                  <InputGroupInput
                    aria-label={m.editor_line_price()}
                    data-testid="credit-note-line-price"
                    inputMode="decimal"
                    onChange={(event) =>
                      updateLine(line.key, {
                        unitPrice: formatSignedDraft(
                          format.locale,
                          event.target.value,
                        ),
                      })
                    }
                    value={line.unitPrice}
                  />
                  <InputGroupSuffix>{currencySymbol(format)}</InputGroupSuffix>
                </InputGroup>
                {vatLiable && line.invoiceLineId === null ? (
                  <NativeSelect
                    aria-label={m.editor_line_vat()}
                    onChange={(event) =>
                      updateLine(line.key, {
                        vatRateBp: Number(event.target.value),
                      })
                    }
                    value={String(line.vatRateBp)}
                  >
                    {vatRateOptions(line.vatRateBp).map((rate) => (
                      <option key={rate} value={rate}>
                        {formatPercentFromBp(format.locale, rate)}
                      </option>
                    ))}
                  </NativeSelect>
                ) : (
                  <span className="self-center text-muted-foreground-3 text-xs">
                    {vatLiable
                      ? formatPercentFromBp(format.locale, line.vatRateBp)
                      : m.editor_franchise()}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
      <div className="flex flex-col gap-2">
        <span className="text-muted-foreground-2 text-xs">
          {m.credit_note_take_line()}
        </span>
        {invoiceLines.map((line) => (
          <div
            className="flex items-center justify-between gap-3 rounded-md border border-dashed px-3 py-2"
            key={line.id}
          >
            <span className="min-w-0 truncate text-foreground-2 text-sm">
              {line.label}
            </span>
            <Button
              data-line={line.id}
              data-testid="credit-note-take-line"
              onClick={() =>
                setLines([...draft.lines, lineFromInvoice(format, line)])
              }
              size="sm"
              variant="outline"
            >
              {m.credit_note_take()}
            </Button>
          </div>
        ))}
        <Button
          className="self-start"
          data-testid="credit-note-free-line"
          onClick={() =>
            setLines([
              ...draft.lines,
              freeCreditLine(vatLiable ? defaultRate : 0),
            ])
          }
          size="sm"
          variant="ghost"
        >
          <Plus data-icon="inline-start" />
          {m.editor_free_line()}
        </Button>
      </div>
    </>
  );
}
