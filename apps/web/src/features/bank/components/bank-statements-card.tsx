import type { BankAccountData, BankStatementData } from "@opusline/api-client";
import { eyebrowVariants } from "@opusline/ui/components/eyebrow";
import { FileTextIcon, RefreshCwIcon } from "lucide-react";

import { useDateFormat } from "@/components/money-format-provider";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";
import { isSyncedStatement } from "../lib/statements";

type BankStatementsCardProps = {
  data: BankAccountData;
};

export function BankStatementsCard({ data }: BankStatementsCardProps) {
  return (
    <section className="rounded-md border bg-card p-5">
      <h2 className={eyebrowVariants()}>{m.bank_statements_title()}</h2>

      {data.statements.length === 0 ? (
        <p className="pt-6 pb-2 text-center text-pretty text-muted-foreground-3 text-sm">
          {m.bank_statements_empty()}
        </p>
      ) : (
        <div className="mt-1.5 max-h-80 overflow-y-auto">
          {data.statements.map((statement) => (
            <StatementRow key={statement.id} statement={statement} />
          ))}
        </div>
      )}
    </section>
  );
}

function StatementRow({ statement }: { statement: BankStatementData }) {
  const dateFormat = useDateFormat();
  const period = {
    start: calendarDateNumericLabel(dateFormat, statement.periodStart),
    end: calendarDateNumericLabel(dateFormat, statement.periodEnd),
    lines: statement.lineCount,
  };
  const isSynced = isSyncedStatement(statement);
  const Icon = isSynced ? RefreshCwIcon : FileTextIcon;
  const date = calendarDateNumericLabel(dateFormat, statement.importedAt);

  return (
    <div
      className="flex flex-wrap items-center gap-3.5 border-secondary border-t py-3 first:border-t-0"
      data-format={statement.format}
      data-testid="bank-statement-row"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <Icon aria-hidden className="size-3.5 text-muted-foreground-2" />
      </span>
      <div className="min-w-0 flex-1 basis-56">
        <div className="truncate text-foreground-2 text-sm">
          {statement.fileName}
        </div>
        <div className="mt-0.5 text-muted-foreground-3 text-xs">
          {isSynced
            ? m.bank_statement_synced_detail({ ...period, date })
            : m.bank_statement_detail({ ...period, date })}
        </div>
      </div>
      <span className="shrink-0 text-muted-foreground-3 text-sm">
        {m.bank_statement_reconciled_count({
          validated: statement.validatedMatchCount,
          total: statement.matchCount,
        })}
      </span>
    </div>
  );
}
