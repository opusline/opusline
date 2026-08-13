import type { InvoiceTodoData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";

import { formatEuros } from "@/lib/billing";

import {
  overdueDetail,
  unbilledWorkDetail,
  unbilledWorkTitle,
} from "../lib/summary-labels";

type InvoiceTodoPanelProps = {
  todo: InvoiceTodoData[];
  todoTotal: number;
  onRemind: (invoiceId: number) => void;
  onCreateInvoice: (todo: InvoiceTodoData) => void;
  pendingInvoiceId?: number | null;
};

export function InvoiceTodoPanel({
  todo,
  todoTotal,
  onRemind,
  onCreateInvoice,
  pendingInvoiceId,
}: InvoiceTodoPanelProps) {
  return (
    <section className="overflow-hidden rounded-md border bg-card">
      <header className="flex items-baseline justify-between gap-3 border-b bg-muted-2 px-5 py-3">
        <h2 className="font-medium text-foreground-hi text-sm">À traiter</h2>
        <span className="text-muted-foreground-3 text-xs">
          {todoTotal === 0 ? "rien en attente" : `${todoTotal} en attente`}
        </span>
      </header>

      {todo.length === 0 ? (
        <p className="px-5 py-6 text-muted-foreground-3 text-sm">
          Tout est facturé et encaissé.
        </p>
      ) : (
        <ul>
          {todo.map((item) => (
            <li key={todoKey(item)}>
              {item.kind === 0 ? (
                <OverdueRow
                  todo={item}
                  isPending={pendingInvoiceId === item.invoiceId}
                  onRemind={onRemind}
                />
              ) : (
                <UnbilledWorkRow
                  todo={item}
                  onCreateInvoice={onCreateInvoice}
                />
              )}
            </li>
          ))}
        </ul>
      )}

      {todoTotal > todo.length && (
        <p className="border-t px-5 py-2.5 text-muted-foreground-3 text-xs">
          {`+ ${todoTotal - todo.length} autres`}
        </p>
      )}
    </section>
  );
}

/** Two kinds share the list and neither id is unique across it on its own. */
function todoKey(todo: InvoiceTodoData): string {
  return `${todo.kind}-${todo.invoiceId ?? todo.missionId}`;
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
  detail: string | null;
  amount: string;
  action: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[6.5rem_minmax(0,1fr)_auto_auto] items-center gap-4 border-b px-5 py-3 last:border-b-0">
      {badge}
      <div className="min-w-0">
        <p className="truncate text-foreground-2 text-sm">{title}</p>
        {detail !== null && (
          <p className="mt-0.75 truncate text-muted-foreground-3 text-xs">
            {detail}
          </p>
        )}
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
  isPending,
  onRemind,
}: {
  todo: InvoiceTodoData;
  isPending: boolean;
  onRemind: (invoiceId: number) => void;
}) {
  const invoiceId = todo.invoiceId;

  return (
    <Row
      badge={<Badge variant="warn">En retard</Badge>}
      title={`${todo.number ?? "Sans référence"} · ${todo.clientName}`}
      detail={overdueDetail(todo)}
      amount={formatEuros(todo.amount.amount)}
      action={
        <Button
          variant="outline"
          size="sm"
          disabled={invoiceId === null || isPending}
          onClick={() => {
            if (invoiceId !== null) {
              onRemind(invoiceId);
            }
          }}
        >
          Noter une relance
        </Button>
      }
    />
  );
}

function UnbilledWorkRow({
  todo,
  onCreateInvoice,
}: {
  todo: InvoiceTodoData;
  onCreateInvoice: (todo: InvoiceTodoData) => void;
}) {
  return (
    <Row
      badge={<Badge variant="brand">À facturer</Badge>}
      title={unbilledWorkTitle(todo)}
      detail={unbilledWorkDetail(todo)}
      amount={`${formatEuros(todo.amount.amount)} HT`}
      action={
        <Button size="sm" onClick={() => onCreateInvoice(todo)}>
          Créer la facture
        </Button>
      }
    />
  );
}
