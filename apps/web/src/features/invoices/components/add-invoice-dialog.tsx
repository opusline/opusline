import type {
  ClientWithMissionsData,
  FixedPriceBudgetData,
  InvoiceStatus,
  MissionData,
} from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import { Chip, ChipGroup } from "@opusline/ui/components/chip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@opusline/ui/components/dialog";
import { Input } from "@opusline/ui/components/input";
import { Label } from "@opusline/ui/components/label";
import { NativeSelect } from "@opusline/ui/components/native-select";
import { cn } from "@opusline/ui/lib/utils";
import { useId, useState } from "react";

import { DateField } from "@/components/date-field";
import { useMoneyFormat } from "@/components/money-format-provider";
import {
  formatAmount,
  formatPercentFromBp,
  formatWholeAmount,
  parseRateBp,
  parseRateToCents,
} from "@/lib/billing";
import { budgetShareLabel } from "@/lib/fixed-price-budget";
import { invoiceStatusLabel } from "@/lib/invoice-status";
import { monthEnd, monthStart } from "@/lib/months";
import { m } from "@/paraglide/messages.js";
import { useSuggestedNumber } from "../lib/use-suggested-number";
import { InvoiceVatField } from "./invoice-vat-field";

/** Draft, sent and paid — the three states an invoice record can be in. */
const STATUSES: InvoiceStatus[] = [0, 1, 2];

/** What the design offers as one tap each, beside the full balance. */
const QUICK_SHARES = [30, 50];

export type AddInvoiceSubmit = {
  clientId: number;
  missionId: number;
  number: string | null;
  amountHtCents: number;
  vatRateBp: number | null;
  status: InvoiceStatus;
  periodStart: string | null;
  periodEnd: string | null;
  issuedOn: string;
  dueOn: string | null;
  /** Required by the API once the status is Paid, and meaningless before that. */
  paidOn: string | null;
};

export type AddInvoiceMission = {
  mission: MissionData;
  client: ClientWithMissionsData;
  budget: FixedPriceBudgetData | null;
};

type AddInvoiceDialogProps = {
  open: boolean;
  missions: AddInvoiceMission[];
  /** The missions are fetched when the dialog opens; until they land there is no list. */
  isLoading?: boolean;
  /** `Y-m-d` in the account timezone: what the date fields start on. */
  accountToday: string;
  /** Preselected when the dialog is opened from a forfait's « Facturer le reste ». */
  initialMissionId?: number | null;
  suggestedNumber: string | null;
  vatLiable: boolean;
  defaultVatRateBp: number;
  isSaving: boolean;
  error: string | null;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: AddInvoiceSubmit) => void;
};

/**
 * Records an invoice issued elsewhere. Opusline never produces the document, so every
 * field is what the user's billing tool already wrote — except on a forfait, where the
 * price is known in advance and the dialog can offer it as a figure to fill in.
 */
export function AddInvoiceDialog({
  open,
  missions,
  isLoading,
  accountToday,
  initialMissionId = null,
  suggestedNumber,
  vatLiable,
  defaultVatRateBp,
  isSaving,
  error,
  onOpenChange,
  onSubmit,
}: AddInvoiceDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-lg">
        {open && (
          <AddInvoiceForm
            accountToday={accountToday}
            defaultVatRateBp={defaultVatRateBp}
            error={error}
            initialMissionId={initialMissionId}
            isLoading={isLoading}
            isSaving={isSaving}
            missions={missions}
            onSubmit={onSubmit}
            suggestedNumber={suggestedNumber}
            vatLiable={vatLiable}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function AddInvoiceForm({
  missions,
  isLoading,
  accountToday,
  initialMissionId,
  suggestedNumber,
  vatLiable,
  defaultVatRateBp,
  isSaving,
  error,
  onSubmit,
}: Omit<AddInvoiceDialogProps, "open" | "onOpenChange">) {
  const format = useMoneyFormat();
  const missionFieldId = useId();
  const numberFieldId = useId();
  const periodFieldId = useId();
  const amountFieldId = useId();
  const issuedFieldId = useId();
  const dueFieldId = useId();
  const paidFieldId = useId();
  const _vatFieldId = useId();

  const [missionId, setMissionId] = useState<number | null>(
    initialMissionId ?? null,
  );
  const [number, setNumber] = useSuggestedNumber(suggestedNumber);
  const [period, setPeriod] = useState("");
  const [issuedOn, setIssuedOn] = useState(accountToday);
  const [dueOn, setDueOn] = useState("");
  const [paidOn, setPaidOn] = useState(accountToday);
  const [status, setStatus] = useState<InvoiceStatus>(1);
  const [amountDraft, setAmountDraft] = useState("");
  const [vatDraft, setVatDraft] = useState(() =>
    formatPercentFromBp(format.locale, defaultVatRateBp),
  );

  const first = missions[0];

  if (first === undefined) {
    return (
      <>
        <DialogHeader>
          <DialogTitle>{m.invoices_add_title()}</DialogTitle>
        </DialogHeader>
        <p className="mt-4 text-muted-foreground-3 text-sm">
          {isLoading === true
            ? m.invoices_add_loading()
            : m.invoices_add_no_missions()}
        </p>
      </>
    );
  }

  // The list arrives after the dialog opens, so a pick can only be honoured once it
  // is in: until then the prop, and failing that whatever landed first.
  const selected =
    missions.find((row) => row.mission.id === missionId) ?? first;
  const amountHtCents = parseRateToCents(format.locale, amountDraft);
  const vatRateBp = vatLiable ? parseRateBp(format.locale, vatDraft) : null;
  const isVatInvalid = vatLiable && vatRateBp === null;
  // The API refuses an issued invoice without one, and the reference is the only
  // proof the document exists outside Opusline.
  const isNumberMissing = status !== 0 && number.trim() === "";
  // The API refuses a paid invoice with no payment date, and the field is clearable.
  const isPaidOnMissing = status === 2 && paidOn === "";
  // So is the issue date, and unlike the due date it has no null to fall back on.
  const isIssuedOnMissing = issuedOn === "";
  const canSubmit =
    amountHtCents !== null &&
    !isVatInvalid &&
    !isNumberMissing &&
    !isIssuedOnMissing &&
    !isPaidOnMissing &&
    !isSaving;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        if (!canSubmit || amountHtCents === null) {
          return;
        }

        onSubmit({
          amountHtCents,
          clientId: selected.client.id,
          dueOn: dueOn === "" ? null : dueOn,
          issuedOn,
          missionId: selected.mission.id,
          number: number.trim() === "" ? null : number.trim(),
          paidOn: status === 2 ? paidOn : null,
          // A month input gives "2026-08"; the API stores the span it covers.
          periodEnd: period === "" ? null : monthEnd(period),
          periodStart: period === "" ? null : monthStart(period),
          status,
          vatRateBp,
        });
      }}
    >
      <DialogHeader>
        <DialogTitle>{m.invoices_add_title()}</DialogTitle>
        <DialogDescription>{m.invoices_add_intro()}</DialogDescription>
      </DialogHeader>

      <div className="mt-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={missionFieldId}>
            {m.invoices_add_mission_label()}
          </Label>
          <NativeSelect
            id={missionFieldId}
            onChange={(event) => setMissionId(Number(event.target.value))}
            value={String(selected.mission.id)}
          >
            {missions.map(({ mission, client }) => (
              <option key={mission.id} value={String(mission.id)}>
                {`${mission.name} · ${client.name}`}
              </option>
            ))}
          </NativeSelect>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={numberFieldId}>
              {m.invoices_reference_label()}
            </Label>
            <Input
              aria-invalid={isNumberMissing}
              id={numberFieldId}
              onChange={(event) => setNumber(event.target.value)}
              placeholder={suggestedNumber ?? "F-2026-001"}
              value={number}
            />
            {isNumberMissing && (
              <p className="text-destructive text-xs">
                {m.invoices_add_number_required()}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={periodFieldId}>
              {m.invoices_add_period_label()}
            </Label>
            <Input
              font="mono"
              id={periodFieldId}
              onChange={(event) => setPeriod(event.target.value)}
              type="month"
              value={period}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={amountFieldId}>
              {m.invoices_amount_ht_label()}
            </Label>
            <Input
              aria-invalid={amountDraft !== "" && amountHtCents === null}
              id={amountFieldId}
              inputMode="decimal"
              onChange={(event) => setAmountDraft(event.target.value)}
              value={amountDraft}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={issuedFieldId}>
              {m.invoices_add_issued_label()}
            </Label>
            <DateField
              id={issuedFieldId}
              onChange={setIssuedOn}
              value={issuedOn}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={dueFieldId}>{m.invoices_add_due_label()}</Label>
            <DateField id={dueFieldId} onChange={setDueOn} value={dueOn} />
          </div>
          {status === 2 && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={paidFieldId}>{m.invoices_add_paid_label()}</Label>
              <DateField
                aria-invalid={isPaidOnMissing}
                id={paidFieldId}
                max={accountToday}
                onChange={setPaidOn}
                value={paidOn}
              />
              {isPaidOnMissing && (
                <p className="text-destructive text-xs">
                  {m.invoices_add_paid_required()}
                </p>
              )}
            </div>
          )}
        </div>

        {selected?.budget != null && (
          <ForfaitPanel
            budget={selected.budget}
            amountHtCents={amountHtCents}
            onFill={(cents) => setAmountDraft(formatAmount(format, cents))}
          />
        )}

        <InvoiceVatField
          draft={vatDraft}
          isInvalid={isVatInvalid}
          onDraftChange={setVatDraft}
          vatLiable={vatLiable}
        />

        <div className="flex flex-col gap-1.5">
          <Label>{m.invoices_add_status_label()}</Label>
          <ChipGroup
            aria-label={m.invoices_add_status_label()}
            onValueChange={(value) => {
              const picked = value[0];

              if (typeof picked === "string") {
                setStatus(Number(picked) as InvoiceStatus);
              }
            }}
            value={[String(status)]}
          >
            {STATUSES.map((invoiceStatus) => (
              <Chip key={invoiceStatus} value={String(invoiceStatus)}>
                {invoiceStatusLabel(invoiceStatus)}
              </Chip>
            ))}
          </ChipGroup>
        </div>
      </div>

      {error !== null && (
        <p className="mt-4 text-destructive text-sm" role="alert">
          {error}
        </p>
      )}

      <div className="mt-5 flex justify-end">
        <Button disabled={!canSubmit} type="submit">
          {isSaving ? m.invoices_creating() : m.common_save()}
        </Button>
      </div>
    </form>
  );
}

/**
 * Where the forfait stands, and the amounts worth one tap. The figures are the API's;
 * only the comparison with what is being typed happens here.
 */
function ForfaitPanel({
  budget,
  amountHtCents,
  onFill,
}: {
  budget: FixedPriceBudgetData;
  amountHtCents: number | null;
  onFill: (cents: number) => void;
}) {
  const format = useMoneyFormat();
  const remaining = budget.remaining.amount;
  const typed = amountHtCents ?? 0;
  const left = remaining - typed;

  return (
    <div className="flex flex-col gap-3 rounded-md border bg-muted px-4 py-3.5">
      <div className="font-medium text-muted-foreground-2 text-xs uppercase tracking-widest">
        {m.invoices_add_forfait_title()}
      </div>

      <dl className="flex flex-col gap-2 text-sm">
        <PanelRow
          label={m.invoices_add_forfait_amount()}
          value={formatWholeAmount(format, budget.forfait.amount)}
        />
        <PanelRow
          label={m.invoices_add_forfait_invoiced()}
          value={`${formatWholeAmount(format, budget.invoiced.amount)} · ${budgetShareLabel(format.locale, budget.invoicedShareBp)}`}
        />
        {budget.draft.amount > 0 && (
          <PanelRow
            label={m.invoices_add_forfait_draft()}
            value={formatWholeAmount(format, budget.draft.amount)}
          />
        )}
        <PanelRow
          className="border-t pt-2"
          label={m.invoices_add_forfait_remaining()}
          value={formatWholeAmount(format, remaining)}
        />
      </dl>

      {remaining > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-muted-foreground-3 text-xs">
            {m.invoices_add_fill_label()}
          </span>
          {QUICK_SHARES.map((share) => (
            <Button
              key={share}
              onClick={() =>
                onFill(Math.round((budget.forfait.amount * share) / 100))
              }
              size="sm"
              type="button"
              variant="outline"
            >
              {m.common_percent({ value: String(share) })}
            </Button>
          ))}
          <Button
            onClick={() => onFill(remaining)}
            size="sm"
            type="button"
            variant="outline"
          >
            {m.invoices_add_fill_balance({
              amount: formatWholeAmount(format, remaining),
            })}
          </Button>
        </div>
      )}

      {amountHtCents !== null && (
        <Alert variant={left < 0 ? "warn" : "brand"}>
          <AlertDescription>
            {left < 0
              ? m.invoices_add_over_note({
                  amount: formatWholeAmount(format, -left),
                })
              : m.invoices_add_after_note({
                  amount: formatWholeAmount(format, left),
                })}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

function PanelRow({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-baseline justify-between gap-3", className)}>
      <dt className="text-muted-foreground-3">{label}</dt>
      <dd className="font-mono text-foreground-hi tabular-nums">{value}</dd>
    </div>
  );
}
