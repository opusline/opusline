import type {
  MissionBillingStepData,
  MoneyData,
  SaveMissionBillingStepData,
} from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import { Input } from "@opusline/ui/components/input";
import { Label } from "@opusline/ui/components/label";
import { Skeleton } from "@opusline/ui/components/skeleton";
import { CircleAlert, PlusIcon, Trash2Icon } from "lucide-react";
import { useId, useState } from "react";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import {
  formatAmountWithCents,
  formatRateDraft,
  parseRateToCents,
} from "@/lib/billing";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

type MissionBillingScheduleProps = {
  steps: MissionBillingStepData[];
  /** What the steps add up to, and the price they are a split of. */
  scheduledCents: number;
  /** The agreed price the instalments divide. */
  fixedPrice: MoneyData;
  isPending?: boolean;
  isError?: boolean;
  isSaving?: boolean;
  error?: string | null;
  onAdd: (body: SaveMissionBillingStepData) => void;
  onDelete: (stepId: number) => void;
  onSetReady: (stepId: number, isReady: boolean) => void;
  onBill: (step: MissionBillingStepData) => void;
};

/**
 * The instalments a fixed price is billed in.
 *
 * Nothing here is money the app counts: billing a step creates an ordinary
 * invoice, and only that invoice moves any figure. A schedule whose instalments
 * do not add up to the price is reported, never refused — an avenant is normal,
 * and refusing the write would only make the app disagree with the contract.
 */
export function MissionBillingSchedule({
  steps,
  scheduledCents,
  fixedPrice,
  isPending,
  isError,
  isSaving,
  error,
  onAdd,
  onDelete,
  onSetReady,
  onBill,
}: MissionBillingScheduleProps) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();

  if (isPending) {
    return <Skeleton className="h-40 w-full" />;
  }

  if (isError) {
    return (
      <Alert variant="warn">
        <CircleAlert />
        <AlertDescription>{m.missions_schedule_load_failed()}</AlertDescription>
      </Alert>
    );
  }

  const isMismatched = steps.length > 0 && scheduledCents !== fixedPrice.amount;

  return (
    <section className="rounded-md border bg-card">
      <header className="border-b bg-muted-2 px-5 py-3">
        <h2 className="font-medium text-foreground-hi text-sm">
          {m.missions_schedule_title()}
        </h2>
        <p className="mt-1 text-pretty text-muted-foreground-3 text-xs leading-relaxed">
          {m.missions_schedule_hint()}
        </p>
      </header>

      {steps.length === 0 ? (
        <p className="px-5 py-5 text-muted-foreground-3 text-sm">
          {m.missions_schedule_empty()}
        </p>
      ) : (
        <ul>
          {steps.map((step) => (
            <li
              key={step.id}
              className="flex items-baseline gap-3 border-b px-5 py-3"
            >
              <span className="min-w-0 flex-1 truncate text-foreground-hi text-sm">
                {step.label}
              </span>

              {step.invoiceId !== null ? (
                // A draft holds the step so a second invoice cannot be raised for
                // it, but it has billed nothing — saying "facturée" here would
                // disagree with every money figure on the page.
                <Badge
                  variant={step.invoiceStatus === 0 ? "neutral" : "success"}
                >
                  {step.invoiceStatus === 0
                    ? m.missions_schedule_draft()
                    : m.missions_schedule_invoiced()}
                </Badge>
              ) : step.isReady ? (
                <Badge variant="brand">{m.missions_schedule_ready()}</Badge>
              ) : step.dueOn !== null ? (
                <span className="text-muted-foreground-3 text-xs">
                  {calendarDateNumericLabel(dateFormat, step.dueOn)}
                </span>
              ) : null}

              <span className="font-mono text-foreground-hi text-sm tabular-nums">
                {formatAmountWithCents(format, step.amount.amount)}
              </span>

              {step.invoiceId === null && (
                <span className="flex shrink-0 items-center gap-1.5">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isSaving}
                    onClick={() => onSetReady(step.id, !step.isReady)}
                  >
                    {step.isReady
                      ? m.missions_schedule_unmark_ready()
                      : m.missions_schedule_mark_ready()}
                  </Button>
                  <Button
                    size="sm"
                    disabled={isSaving}
                    onClick={() => onBill(step)}
                  >
                    {m.missions_schedule_bill()}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label={m.missions_schedule_delete()}
                    disabled={isSaving}
                    onClick={() => onDelete(step.id)}
                  >
                    <Trash2Icon aria-hidden className="size-3.5" />
                  </Button>
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      {isMismatched && (
        <p className="border-b px-5 py-2.5 text-muted-foreground-3 text-xs">
          {m.missions_schedule_mismatch({
            scheduled: formatAmountWithCents(format, scheduledCents),
            total: formatAmountWithCents(format, fixedPrice.amount),
          })}
        </p>
      )}

      {/*
        Keyed on the number of instalments so a saved one empties the form and a
        failed one does not: a write that was refused must leave what was typed on
        screen to retry, rather than make the user key it in again under an error.
      */}
      <AddStepForm
        key={steps.length}
        isSaving={isSaving}
        error={error}
        onAdd={onAdd}
      />
    </section>
  );
}

function AddStepForm({
  isSaving,
  error,
  onAdd,
}: {
  isSaving?: boolean;
  error?: string | null;
  onAdd: (body: SaveMissionBillingStepData) => void;
}) {
  const format = useMoneyFormat();
  const labelFieldId = useId();
  const amountFieldId = useId();
  const dueFieldId = useId();
  const [label, setLabel] = useState("");
  const [amountDraft, setAmountDraft] = useState("");
  const [dueOn, setDueOn] = useState("");

  const amountCents = parseRateToCents(format.locale, amountDraft);
  const canSubmit = label.trim() !== "" && amountCents !== null && !isSaving;

  return (
    <form
      className="px-5 py-4"
      onSubmit={(event) => {
        event.preventDefault();

        if (amountCents === null || label.trim() === "") {
          return;
        }

        onAdd({
          label: label.trim(),
          amount: { amount: amountCents, currency: format.currency },
          dueOn: dueOn === "" ? null : dueOn,
        });
      }}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_8rem_9rem]">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={labelFieldId}>{m.missions_schedule_label()}</Label>
          <Input
            id={labelFieldId}
            value={label}
            onChange={(event) => setLabel(event.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={amountFieldId}>{m.missions_schedule_amount()}</Label>
          <Input
            id={amountFieldId}
            inputMode="decimal"
            value={amountDraft}
            aria-invalid={amountDraft.trim() !== "" && amountCents === null}
            onChange={(event) =>
              setAmountDraft(formatRateDraft(format.locale, event.target.value))
            }
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor={dueFieldId}>{m.missions_schedule_due()}</Label>
          <Input
            id={dueFieldId}
            type="date"
            value={dueOn}
            onChange={(event) => setDueOn(event.target.value)}
          />
        </div>
      </div>

      {error != null && (
        <p className="mt-3 text-destructive text-sm" role="alert">
          {error}
        </p>
      )}

      <div className="mt-3 flex justify-end">
        <Button type="submit" variant="outline" disabled={!canSubmit}>
          <PlusIcon aria-hidden className="size-3.5" strokeWidth={2.2} />
          {m.missions_schedule_add()}
        </Button>
      </div>
    </form>
  );
}
