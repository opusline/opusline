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
import { useEffect, useId, useState } from "react";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import {
  formatAmount,
  formatAmountWithCents,
  parseRateToCents,
} from "@/lib/billing";
import { calendarRangeLabel } from "@/lib/dates";

import { unbilledWorkTitle } from "../lib/summary-labels";
import { Fact } from "./invoice-fact";

export type CreateInvoiceSubmit = {
  clientId: number;
  missionId: number;
  number: string | null;
  amountHtCents: number;
  periodStart: string | null;
  periodEnd: string | null;
  timeEntryIds: number[];
};

type CreateInvoiceDialogProps = {
  todo: InvoiceTodoData | null;
  suggestedNumber: string | null;
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
  isSaving,
  error,
  onSubmit,
}: {
  todo: InvoiceTodoData;
  work: InvoiceTodoWorkData;
  suggestedNumber: string | null;
  isSaving: boolean;
  error: string | null;
  onSubmit: (input: CreateInvoiceSubmit) => void;
}) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();
  const numberFieldId = useId();
  const amountFieldId = useId();
  const [number, setNumber] = useState("");
  const [amountDraft, setAmountDraft] = useState(() =>
    formatAmount(format, todo.amount.amount),
  );

  // The suggestion arrives after the dialog opens, and must not overwrite typing.
  useEffect(() => {
    if (suggestedNumber !== null) {
      setNumber((current) => (current === "" ? suggestedNumber : current));
    }
  }, [suggestedNumber]);

  const amountHtCents = parseRateToCents(format.locale, amountDraft);
  const canSubmit = amountHtCents !== null && !isSaving;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        if (amountHtCents === null) {
          return;
        }

        onSubmit({
          clientId: todo.clientId,
          missionId: work.missionId,
          number: number.trim() === "" ? null : number.trim(),
          amountHtCents,
          periodStart: work.firstEntryOn,
          periodEnd: work.lastEntryOn,
          timeEntryIds: work.timeEntryIds,
        });
      }}
    >
      <DialogHeader>
        <DialogTitle>Créer la facture</DialogTitle>
        <DialogDescription>
          {unbilledWorkTitle(format.locale, work)}
        </DialogDescription>
      </DialogHeader>

      <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-3 border-t pt-4">
        <Fact label="Client" value={todo.clientName} tone="text" />
        <Fact label="Mission" value={work.missionName} tone="text" />
        <Fact
          label="Période"
          value={
            calendarRangeLabel(
              dateFormat,
              work.firstEntryOn,
              work.lastEntryOn,
            ) ?? "—"
          }
        />
        <Fact
          label="Valeur du temps"
          value={formatAmountWithCents(format, todo.amount.amount)}
        />
      </dl>

      <div className="mt-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={numberFieldId}>Référence</Label>
          <Input
            id={numberFieldId}
            value={number}
            placeholder={suggestedNumber ?? "F-2026-001"}
            onChange={(event) => setNumber(event.target.value)}
          />
          <p className="text-muted-foreground-3 text-xs">
            Celle de la facture émise ailleurs. Laissez vide pour un brouillon.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor={amountFieldId}>Montant HT</Label>
          <Input
            id={amountFieldId}
            inputMode="decimal"
            value={amountDraft}
            aria-invalid={amountHtCents === null}
            onChange={(event) => setAmountDraft(event.target.value)}
          />
          <p className="text-muted-foreground-3 text-xs">
            La TVA et le TTC sont calculés depuis vos paramètres.
          </p>
        </div>
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
          {isSaving ? "Création…" : "Créer la facture"}
        </Button>
      </div>
    </form>
  );
}

function coveredTimeLabel(entryCount: number): string {
  if (entryCount === 0) {
    return "Aucun temps ne sera rattaché à cette facture.";
  }

  return entryCount === 1
    ? "1 temps saisi sera marqué comme facturé et disparaîtra de « à facturer »."
    : `${entryCount} temps saisis seront marqués comme facturés et disparaîtront de « à facturer ».`;
}
