import type {
  CreateInvoiceData,
  Currency,
  InvoiceTodoData,
  InvoiceTodoStepData,
  InvoiceTodoWorkData,
  Locale,
  MissionBillingProgressData,
  MissionBillingStepData,
} from "@opusline/api-client";

import { m } from "@/paraglide/messages.js";

import type { CreateInvoiceSubmit } from "../components/create-invoice-dialog";
import { unbilledWorkTitle } from "./summary-labels";

/**
 * What the create-invoice dialog needs to open, whatever it is billing.
 *
 * Two things reach the dialog and they answer different questions: a row of
 * tracked time knows what the work was worth and which entries it consumes, a
 * fixed-price mission knows what the deal was worth and how much of it is left.
 * The dialog renders whichever facts it was handed rather than asking where the
 * invoice came from.
 */
export type InvoicePrefill = {
  clientId: number;
  clientName: string;
  missionId: number;
  missionName: string;
  /** The dialog's subtitle — what this invoice is for, in the caller's words. */
  title: string;
  /** Null leaves the amount field empty, for an invoice whose figure is a decision. */
  amountHtCents: number | null;
  vatRateBp: number;
  periodStart: string | null;
  periodEnd: string | null;
  /** Tracked time this invoice marks as billed. Empty on a fixed-price mission. */
  timeEntryIds: number[];
  /** What the covered time was worth; null when the invoice covers none. */
  timeValueCents: number | null;
  /** What the fixed price still has to bill; null on any other billing mode. */
  remainingCents: number | null;
  /** The instalment this invoice bills, marked as billed on submit. */
  billingStepId: number | null;
};

/**
 * A row of "à facturer": the amount, the period and the entries all come from
 * the work behind it, which is why every field is prefilled and none is a guess.
 */
export function prefillFromUnbilledWork(
  locale: Locale,
  todo: InvoiceTodoData,
  work: InvoiceTodoWorkData,
): InvoicePrefill {
  return {
    clientId: todo.clientId,
    clientName: todo.clientName,
    missionId: work.missionId,
    missionName: work.missionName,
    title: unbilledWorkTitle(locale, work),
    amountHtCents: todo.amount.amount,
    vatRateBp: work.vatRateBp,
    periodStart: work.firstEntryOn,
    periodEnd: work.lastEntryOn,
    timeEntryIds: work.timeEntryIds,
    timeValueCents: todo.amount.amount,
    remainingCents: null,
    billingStepId: null,
  };
}

/**
 * A fixed-price mission. The amount is left empty on purpose: an instalment is a
 * decision about the contract, not a figure the tracked time can produce, and
 * seeding it with what remains would quietly turn every invoice into the last one.
 */
export function prefillFromForfait({
  clientId,
  clientName,
  missionId,
  missionName,
  progress,
  vatRateBp,
  step,
}: {
  clientId: number;
  clientName: string;
  missionId: number;
  missionName: string;
  /** What the price has billed so far, for the room-left fact. */
  progress: MissionBillingProgressData;
  vatRateBp: number;
  /** The instalment being billed, when the schedule drove it. */
  step?: MissionBillingStepData;
}): InvoicePrefill {
  return {
    clientId,
    clientName,
    missionId,
    missionName,
    title:
      step === undefined
        ? m.invoices_forfait_title({ missionName })
        : m.invoices_step_prefill_title({ label: step.label, missionName }),
    // An instalment's figure was decided by the contract; a one-off's is a
    // decision being made now, and seeding it with what remains would quietly
    // turn every invoice into the last one.
    amountHtCents: step?.amount.amount ?? null,
    vatRateBp,
    periodStart: null,
    periodEnd: null,
    timeEntryIds: [],
    timeValueCents: null,
    remainingCents: progress.remaining.amount,
    billingStepId: step?.id ?? null,
  };
}

/**
 * An instalment of a fixed price that the schedule says is due. Unlike a forfait
 * invoiced by hand, the amount is prefilled: the contract already decided it.
 * It stays editable — what was actually invoiced still wins.
 */
export function prefillFromStep(
  todo: InvoiceTodoData,
  step: InvoiceTodoStepData,
): InvoicePrefill {
  return {
    clientId: todo.clientId,
    clientName: todo.clientName,
    missionId: step.missionId,
    missionName: step.missionName,
    title: m.invoices_step_prefill_title({
      label: step.label,
      missionName: step.missionName,
    }),
    amountHtCents: todo.amount.amount,
    vatRateBp: step.vatRateBp,
    periodStart: null,
    periodEnd: null,
    timeEntryIds: [],
    timeValueCents: null,
    remainingCents: step.remainingCents,
    billingStepId: step.billingStepId,
  };
}

/**
 * What the dialog collected, as the API takes it.
 *
 * Both screens that create an invoice post the identical body, including the
 * rule that decides draft from issued — keeping one copy is what stops a new
 * field being threaded through one screen and forgotten on the other.
 */
export function createInvoiceBody(
  input: CreateInvoiceSubmit,
  currency: Currency,
): CreateInvoiceData {
  return {
    clientId: input.clientId,
    missionId: input.missionId,
    number: input.number,
    // A reference means the document exists somewhere: the invoice is issued, and
    // only an issued invoice counts towards what is still to be collected. Without
    // one it stays a draft, which is what the dialog says it will do.
    status: input.number === null ? 0 : 1,
    // A stale render-context currency is refused by the API (422);
    // see settings-form.ts for the one case needing the snapshot.
    amountHt: { amount: input.amountHtCents, currency },
    vatRateBp: input.vatRateBp,
    periodStart: input.periodStart,
    periodEnd: input.periodEnd,
    timeEntryIds: input.timeEntryIds,
    billingStepId: input.billingStepId,
  };
}
