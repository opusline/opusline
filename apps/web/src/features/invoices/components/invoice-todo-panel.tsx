import type {
  InvoiceTodoData,
  InvoiceTodoOverdueData,
  InvoiceTodoStepData,
  InvoiceTodoWorkData,
} from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { m } from "@/paraglide/messages.js";

import {
  type InvoicePrefill,
  prefillFromStep,
  prefillFromUnbilledWork,
} from "../lib/invoice-prefill";
import {
  billingStepDetail,
  overdueDetail,
  unbilledWorkDetail,
  unbilledWorkTitle,
} from "../lib/summary-labels";

type InvoiceTodoPanelProps = {
  todo: InvoiceTodoData[];
  todoTotal: number;
  onRemind: (invoiceId: number) => void;
  /**
   * One handler whatever the row bills: the rows already know their kind, so a
   * fourth one costs a row component and nothing else.
   */
  onInvoice: (prefill: InvoicePrefill) => void;
  pendingInvoiceId?: number | null;
};

export function InvoiceTodoPanel({
  todo,
  todoTotal,
  onRemind,
  onInvoice,
  pendingInvoiceId,
}: InvoiceTodoPanelProps) {
  return (
    <section className="overflow-hidden rounded-md border bg-card">
      <header className="flex items-baseline justify-between gap-3 border-b bg-muted-2 px-5 py-3">
        <h2 className="font-medium text-foreground-hi text-sm">
          {m.invoices_todo_title()}
        </h2>
        <span className="text-muted-foreground-3 text-xs">
          {todoTotal === 0
            ? m.invoices_none_pending()
            : m.invoices_pending_count({ count: todoTotal })}
        </span>
      </header>

      {todo.length === 0 ? (
        <p className="px-5 py-6 text-muted-foreground-3 text-sm">
          {m.invoices_todo_empty()}
        </p>
      ) : (
        <ul>
          {todo.map((item) => (
            <li key={todoKey(item)}>
              {item.overdue != null && (
                <OverdueRow
                  todo={item}
                  overdue={item.overdue}
                  isPending={pendingInvoiceId === item.overdue.invoiceId}
                  onRemind={onRemind}
                />
              )}
              {item.work != null && (
                <UnbilledWorkRow
                  todo={item}
                  work={item.work}
                  onInvoice={onInvoice}
                />
              )}
              {item.step != null && (
                <BillingStepRow
                  todo={item}
                  step={item.step}
                  onInvoice={onInvoice}
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {todoTotal > todo.length && (
        <p className="border-t px-5 py-2.5 text-muted-foreground-3 text-xs">
          {m.invoices_more_count({ count: todoTotal - todo.length })}
        </p>
      )}
    </section>
  );
}

/** Two kinds share the list and neither id is unique across it on its own. */
function todoKey(todo: InvoiceTodoData): string {
  return `${todo.kind}-${todo.overdue?.invoiceId ?? todo.work?.missionId}`;
}

function Row({
  badge,
  title,
  detail,
  amount,
  action,
}: {
  badge: React.ReactNode;
  title: string;
  detail: string;
  amount: string;
  action: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)_auto_auto] items-center gap-4 border-b px-5 py-3 last:border-b-0">
      {badge}
      <div className="min-w-0">
        <p className="truncate text-foreground-2 text-sm">{title}</p>
        <p className="mt-0.75 truncate text-muted-foreground-3 text-xs">
          {detail}
        </p>
      </div>
      <span className="w-28 text-right font-mono text-foreground-hi text-sm tabular-nums">
        {amount}
      </span>
      <div className="flex justify-end">{action}</div>
    </div>
  );
}

function OverdueRow({
  todo,
  overdue,
  isPending,
  onRemind,
}: {
  todo: InvoiceTodoData;
  overdue: InvoiceTodoOverdueData;
  isPending: boolean;
  onRemind: (invoiceId: number) => void;
}) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();

  return (
    <Row
      badge={<Badge variant="warn">{m.invoice_status_late()}</Badge>}
      title={`${overdue.number ?? m.invoices_no_reference()} · ${todo.clientName}`}
      detail={overdueDetail(dateFormat, overdue)}
      amount={formatWholeAmount(format, todo.amount.amount)}
      action={
        <Button
          variant="outline"
          size="lg"
          disabled={isPending}
          onClick={() => onRemind(overdue.invoiceId)}
        >
          {m.invoices_note_reminder()}
        </Button>
      }
    />
  );
}

function UnbilledWorkRow({
  todo,
  work,
  onInvoice,
}: {
  todo: InvoiceTodoData;
  work: InvoiceTodoWorkData;
  onInvoice: (prefill: InvoicePrefill) => void;
}) {
  const format = useMoneyFormat();

  return (
    <Row
      badge={<Badge variant="brand">{m.invoices_to_invoice_badge()}</Badge>}
      title={unbilledWorkTitle(format.locale, work)}
      detail={unbilledWorkDetail(format.locale, work)}
      amount={`${formatWholeAmount(format, todo.amount.amount)} HT`}
      action={
        <Button
          size="lg"
          onClick={() =>
            onInvoice(prefillFromUnbilledWork(format.locale, todo, work))
          }
        >
          {m.invoices_create_title()}
        </Button>
      }
    />
  );
}

/**
 * An instalment of a fixed price the contract says is now due. Its amount is what
 * the schedule planned, not what any tracked time is worth — which is why it never
 * joins the "à facturer" total beside it.
 */
function BillingStepRow({
  todo,
  step,
  onInvoice,
}: {
  todo: InvoiceTodoData;
  step: InvoiceTodoStepData;
  onInvoice: (prefill: InvoicePrefill) => void;
}) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();

  return (
    <Row
      badge={<Badge variant="brand">{m.invoices_step_badge()}</Badge>}
      title={m.invoices_step_title({
        label: step.label,
        missionName: step.missionName,
      })}
      detail={billingStepDetail(dateFormat, step)}
      amount={`${formatWholeAmount(format, todo.amount.amount)} HT`}
      action={
        <Button
          size="lg"
          onClick={() => onInvoice(prefillFromStep(todo, step))}
        >
          {m.invoices_create_title()}
        </Button>
      }
    />
  );
}
