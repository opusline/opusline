import { Button } from "@opusline/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@opusline/ui/components/dialog";
import { Input } from "@opusline/ui/components/input";
import {
  InputGroup,
  InputGroupInput,
  InputGroupSuffix,
} from "@opusline/ui/components/input-group";
import { Label } from "@opusline/ui/components/label";
import { cn } from "@opusline/ui/lib/utils";
import { useEffect, useId, useState } from "react";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import {
  formatAmount,
  formatAmountWithCents,
  formatPercentFromBp,
  formatRateDraft,
  parseRateBp,
  parseRateToCents,
} from "@/lib/billing";
import { calendarRangeLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

import type { InvoicePrefill } from "../lib/invoice-prefill";
import { Fact } from "./invoice-fact";

export type CreateInvoiceSubmit = {
  clientId: number;
  missionId: number;
  number: string | null;
  amountHtCents: number;
  /** Null hands the rate back to the API, which resolves it from client and regime. */
  vatRateBp: number | null;
  periodStart: string | null;
  periodEnd: string | null;
  timeEntryIds: number[];
  /** The instalment of a fixed price this invoice bills, when it bills one. */
  billingStepId: number | null;
};

type CreateInvoiceDialogProps = {
  prefill: InvoicePrefill | null;
  suggestedNumber: string | null;
  /**
   * Whether the account charges TVA at all. Under the franchise en base the field is
   * not offered: every rate it could hold would put an unlawful line on the invoice.
   */
  vatLiable: boolean;
  isSaving: boolean;
  error: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: CreateInvoiceSubmit) => void;
};

/**
 * Records an invoice against a mission. Opusline does not issue the document — the
 * amount and the reference come from whatever tool did — so the fields are prefilled
 * from whatever the invoice bills and stay editable: what was actually invoiced wins
 * over what the rate says it should have been.
 */
export function CreateInvoiceDialog({
  prefill,
  suggestedNumber,
  vatLiable,
  isSaving,
  error,
  onOpenChange,
  onSubmit,
}: CreateInvoiceDialogProps) {
  return (
    <Dialog open={prefill !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {prefill === null ? null : (
          <CreateInvoiceForm
            prefill={prefill}
            suggestedNumber={suggestedNumber}
            vatLiable={vatLiable}
            isSaving={isSaving}
            error={error}
            onSubmit={onSubmit}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function CreateInvoiceForm({
  prefill,
  suggestedNumber,
  vatLiable,
  isSaving,
  error,
  onSubmit,
}: {
  prefill: InvoicePrefill;
  suggestedNumber: string | null;
  vatLiable: boolean;
  isSaving: boolean;
  error: string | null;
  onSubmit: (input: CreateInvoiceSubmit) => void;
}) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();
  const numberFieldId = useId();
  const amountFieldId = useId();
  const vatFieldId = useId();
  const vatHintId = useId();
  const [number, setNumber] = useState("");
  const [amountDraft, setAmountDraft] = useState(() =>
    prefill.amountHtCents === null
      ? ""
      : formatAmount(format, prefill.amountHtCents),
  );
  const [vatDraft, setVatDraft] = useState(() =>
    formatPercentFromBp(format.locale, prefill.vatRateBp),
  );

  // The suggestion arrives after the dialog opens, and must not overwrite typing.
  useEffect(() => {
    if (suggestedNumber !== null) {
      setNumber((current) => (current === "" ? suggestedNumber : current));
    }
  }, [suggestedNumber]);

  const amountHtCents = parseRateToCents(format.locale, amountDraft);
  // An amount the user has not typed yet is not an amount they got wrong: an
  // invoice that opens with an empty field must not open already flagged red.
  const isAmountInvalid = amountDraft.trim() !== "" && amountHtCents === null;
  // With no field to read, the rate goes back to the API rather than being invented
  // here: a cached vatLiable or a cached prefill.vatRateBp could each be a regime
  // behind, and only the server resolves the regime and the client's rate together.
  const vatRateBp = vatLiable ? parseRateBp(format.locale, vatDraft) : null;
  const isVatInvalid = vatLiable && vatRateBp === null;
  const canSubmit = amountHtCents !== null && !isVatInvalid && !isSaving;
  const periodLabel = calendarRangeLabel(
    dateFormat,
    prefill.periodStart,
    prefill.periodEnd,
  );

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        if (amountHtCents === null || isVatInvalid) {
          return;
        }

        onSubmit({
          clientId: prefill.clientId,
          missionId: prefill.missionId,
          number: number.trim() === "" ? null : number.trim(),
          amountHtCents,
          vatRateBp,
          periodStart: prefill.periodStart,
          periodEnd: prefill.periodEnd,
          timeEntryIds: prefill.timeEntryIds,
          billingStepId: prefill.billingStepId,
        });
      }}
    >
      <DialogHeader>
        <DialogTitle>{m.invoices_create_title()}</DialogTitle>
        <DialogDescription>{prefill.title}</DialogDescription>
      </DialogHeader>

      <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 border-t pt-4">
        <Fact label="Client" value={prefill.clientName} tone="text" />
        <Fact label="Mission" value={prefill.missionName} tone="text" />
        {periodLabel !== null && (
          <Fact label={m.invoices_fact_period()} value={periodLabel} />
        )}
        {prefill.timeValueCents !== null && (
          <Fact
            label={m.invoices_fact_time_value()}
            value={formatAmountWithCents(format, prefill.timeValueCents)}
          />
        )}
        {prefill.remainingCents !== null && (
          <Fact
            label={m.invoices_fact_remaining()}
            value={formatAmountWithCents(format, prefill.remainingCents)}
          />
        )}
      </dl>

      <div className="mt-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={numberFieldId}>{m.invoices_reference_label()}</Label>
          <Input
            id={numberFieldId}
            value={number}
            placeholder={suggestedNumber ?? "F-2026-001"}
            onChange={(event) => setNumber(event.target.value)}
          />
          <p className="text-muted-foreground-3 text-xs">
            {m.invoices_reference_hint()}
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={amountFieldId}>{m.invoices_amount_ht_label()}</Label>
          <Input
            id={amountFieldId}
            inputMode="decimal"
            value={amountDraft}
            aria-invalid={isAmountInvalid}
            onChange={(event) =>
              setAmountDraft(formatRateDraft(format.locale, event.target.value))
            }
          />
        </div>

        {vatLiable ? (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={vatFieldId}>{m.invoices_vat_label()}</Label>
            <InputGroup>
              <InputGroupInput
                aria-describedby={vatHintId}
                aria-invalid={isVatInvalid}
                className="flex-1"
                id={vatFieldId}
                inputMode="decimal"
                onChange={(event) => setVatDraft(event.target.value)}
                value={vatDraft}
              />
              <InputGroupSuffix>%</InputGroupSuffix>
            </InputGroup>
            <p
              className={cn(
                "text-xs",
                isVatInvalid ? "text-destructive" : "text-muted-foreground-3",
              )}
              id={vatHintId}
            >
              {isVatInvalid ? m.common_rate_invalid() : m.invoices_vat_hint()}
            </p>
          </div>
        ) : (
          <p className="text-muted-foreground-3 text-xs">
            {m.invoices_vat_franchise_hint()}
          </p>
        )}
      </div>

      {error !== null && (
        <p className="mt-4 text-destructive text-sm" role="alert">
          {error}
        </p>
      )}

      <p className="mt-4 text-muted-foreground-3 text-xs text-pretty">
        {coveredTimeLabel(prefill.timeEntryIds.length)}
      </p>

      <div className="mt-5 flex justify-end">
        <Button type="submit" disabled={!canSubmit}>
          {isSaving ? m.invoices_creating() : m.invoices_create_title()}
        </Button>
      </div>
    </form>
  );
}

function coveredTimeLabel(entryCount: number): string {
  return entryCount === 0
    ? m.invoices_covered_none()
    : m.invoices_covered_count({ count: entryCount });
}
