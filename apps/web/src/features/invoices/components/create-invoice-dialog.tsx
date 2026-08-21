import type {
  InvoiceTodoData,
  InvoiceTodoWorkData,
} from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@opusline/ui/components/dialog";
import { Input } from "@opusline/ui/components/input";
import { Label } from "@opusline/ui/components/label";
import { useId, useState } from "react";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import {
  formatAmount,
  formatAmountWithCents,
  formatPercentFromBp,
  parseRateBp,
  parseRateToCents,
} from "@/lib/billing";
import { calendarRangeLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

import { unbilledWorkTitle } from "../lib/summary-labels";
import { useSuggestedNumber } from "../lib/use-suggested-number";
import { Fact } from "./invoice-fact";
import { InvoiceVatField } from "./invoice-vat-field";

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
};

type CreateInvoiceDialogProps = {
  todo: InvoiceTodoData | null;
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
 * Turns a row of tracked time into an invoice record. Opusline does not issue the
 * document — the amount and the reference come from whatever tool did — so the fields
 * are prefilled from the time behind the row and stay editable: what was actually
 * invoiced wins over what the rate says it should have been.
 */
export function CreateInvoiceDialog({
  todo,
  suggestedNumber,
  vatLiable,
  isSaving,
  error,
  onOpenChange,
  onSubmit,
}: CreateInvoiceDialogProps) {
  return (
    <Dialog open={todo !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {todo?.work == null ? null : (
          <CreateInvoiceForm
            todo={todo}
            work={todo.work}
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
  todo,
  work,
  suggestedNumber,
  vatLiable,
  isSaving,
  error,
  onSubmit,
}: {
  todo: InvoiceTodoData;
  work: InvoiceTodoWorkData;
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
  const [number, setNumber] = useSuggestedNumber(suggestedNumber);
  const [amountDraft, setAmountDraft] = useState(() =>
    formatAmount(format, todo.amount.amount),
  );
  const [vatDraft, setVatDraft] = useState(() =>
    formatPercentFromBp(format.locale, work.vatRateBp),
  );

  const amountHtCents = parseRateToCents(format.locale, amountDraft);
  // With no field to read, the rate goes back to the API rather than being invented
  // here: a cached vatLiable or a cached work.vatRateBp could each be a regime behind,
  // and only the server resolves the regime and the client's rate together.
  const vatRateBp = vatLiable ? parseRateBp(format.locale, vatDraft) : null;
  const isVatInvalid = vatLiable && vatRateBp === null;
  const canSubmit = amountHtCents !== null && !isVatInvalid && !isSaving;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        if (amountHtCents === null || isVatInvalid) {
          return;
        }

        onSubmit({
          clientId: todo.clientId,
          missionId: work.missionId,
          number: number.trim() === "" ? null : number.trim(),
          amountHtCents,
          vatRateBp,
          periodStart: work.firstEntryOn,
          periodEnd: work.lastEntryOn,
          timeEntryIds: work.timeEntryIds,
        });
      }}
    >
      <DialogHeader>
        <DialogTitle>{m.invoices_create_title()}</DialogTitle>
        <DialogDescription>
          {unbilledWorkTitle(format.locale, work)}
        </DialogDescription>
      </DialogHeader>

      <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 border-t pt-4">
        <Fact label="Client" value={todo.clientName} tone="text" />
        <Fact label="Mission" value={work.missionName} tone="text" />
        <Fact
          label={m.invoices_fact_period()}
          value={
            calendarRangeLabel(
              dateFormat,
              work.firstEntryOn,
              work.lastEntryOn,
            ) ?? "—"
          }
        />
        <Fact
          label={m.invoices_fact_time_value()}
          value={formatAmountWithCents(format, todo.amount.amount)}
        />
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
            aria-invalid={amountHtCents === null}
            onChange={(event) => setAmountDraft(event.target.value)}
          />
        </div>

        <InvoiceVatField
          draft={vatDraft}
          isInvalid={isVatInvalid}
          onDraftChange={setVatDraft}
          vatLiable={vatLiable}
        />
      </div>

      {error !== null && (
        <p className="mt-4 text-destructive text-sm" role="alert">
          {error}
        </p>
      )}

      <p className="mt-4 text-muted-foreground-3 text-xs text-pretty">
        {coveredTimeLabel(work.entryCount)}
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
