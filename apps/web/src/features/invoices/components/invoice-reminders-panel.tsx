import type {
  InvoiceDetailData,
  ReminderDefaultsData,
} from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import { Field, FieldLabel } from "@opusline/ui/components/field";
import { NativeSelect } from "@opusline/ui/components/native-select";
import { Panel, PanelTitle } from "@opusline/ui/components/panel";
import { Switch } from "@opusline/ui/components/switch";

import { useDateFormat } from "@/components/money-format-provider";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";
import {
  REMINDER_FREQUENCIES,
  reminderFrequencyLabel,
} from "../lib/email-templates";

const LABEL = "text-muted-foreground-2 text-xs";

type InvoiceRemindersPanelProps = {
  detail: InvoiceDetailData;
  isPending: boolean;
  /** Saved as soon as it changes, like the defaults on the E-mails page. */
  onChange: (reminders: ReminderDefaultsData) => void;
  onRemindNow: () => void;
};

/** The design's « Relances automatiques » card on an unpaid invoice: what runs, when, to whom. */
export function InvoiceRemindersPanel({
  detail,
  isPending,
  onChange,
  onRemindNow,
}: InvoiceRemindersPanelProps) {
  const dateFormat = useDateFormat();
  const { invoice } = detail;
  const reminders = {
    enabled: invoice.remindersEnabled,
    frequency: invoice.remindersFrequency,
  };
  const hasRecipients = invoice.reminderRecipients.length > 0;
  const sent = detail.emails.filter((email) => email.kind === 3);

  return (
    <Panel
      className="flex flex-col gap-4 px-5 py-5"
      data-enabled={invoice.remindersEnabled}
      data-testid="invoice-reminders"
      padding="none"
    >
      <PanelTitle>{m.invoice_reminders_title()}</PanelTitle>
      <div className="flex items-center justify-between gap-3.5">
        <span className="text-foreground-2 text-sm">
          {m.invoice_reminders_toggle()}
        </span>
        <Switch
          aria-label={m.invoice_reminders_toggle()}
          checked={reminders.enabled}
          data-testid="invoice-reminders-toggle"
          disabled={isPending}
          onCheckedChange={(enabled) => onChange({ ...reminders, enabled })}
        />
      </div>
      {reminders.enabled ? (
        <Field>
          <FieldLabel className={LABEL} htmlFor="invoice-reminders-frequency">
            {m.invoice_reminders_frequency()}
          </FieldLabel>
          <NativeSelect
            data-testid="invoice-reminders-frequency"
            disabled={isPending}
            id="invoice-reminders-frequency"
            onChange={(event) =>
              onChange({
                ...reminders,
                frequency: Number(
                  event.target.value,
                ) as ReminderDefaultsData["frequency"],
              })
            }
            value={String(reminders.frequency)}
          >
            {REMINDER_FREQUENCIES.map((frequency) => (
              <option key={frequency} value={String(frequency)}>
                {reminderFrequencyLabel(frequency)}
              </option>
            ))}
          </NativeSelect>
        </Field>
      ) : null}
      <div className="flex flex-col gap-1 text-muted-foreground-3 text-xs">
        {hasRecipients ? (
          <span data-testid="invoice-reminders-recipients">
            {m.invoice_reminders_recipients({
              recipients: invoice.reminderRecipients.join(", "),
            })}
          </span>
        ) : (
          <span data-testid="invoice-reminders-no-recipients">
            {m.invoice_reminders_no_recipients()}
          </span>
        )}
        {detail.nextReminderOn === null ? null : (
          <span
            className="text-primary-note"
            data-date={detail.nextReminderOn}
            data-testid="invoice-reminders-next"
          >
            {m.invoice_reminders_next({
              date: calendarDateNumericLabel(dateFormat, detail.nextReminderOn),
            })}
          </span>
        )}
        {sent.map((email) => (
          <span
            data-testid="invoice-reminders-sent"
            key={email.id}
            title={email.recipients.join(", ")}
          >
            {m.invoice_reminders_sent_on({
              date: calendarDateNumericLabel(
                dateFormat,
                email.sentAt.slice(0, 10),
              ),
            })}
          </span>
        ))}
      </div>
      <Button
        data-testid="invoice-remind-now"
        disabled={isPending || !hasRecipients}
        onClick={onRemindNow}
        size="xl"
        variant="outline"
      >
        {m.invoice_remind_now()}
      </Button>
    </Panel>
  );
}
