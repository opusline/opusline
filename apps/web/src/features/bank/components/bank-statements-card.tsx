import type { BankAccountData, BankStatementData } from "@opusline/api-client";
import { FileTextIcon } from "lucide-react";

import { useDateFormat } from "@/components/money-format-provider";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

type BankStatementsCardProps = {
  data: BankAccountData;
};

export function BankStatementsCard({ data }: BankStatementsCardProps) {
  return (
    <section className="rounded-md border bg-card p-5">
      <h2 className="font-medium text-muted-foreground-2 text-xs uppercase tracking-widest">
        {m.bank_statements_title()}
      </h2>

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

  return (
    <div className="flex flex-wrap items-center gap-3.5 border-secondary border-t py-3 first:border-t-0">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted">
        <FileTextIcon
          aria-hidden
          className="size-3.5 text-muted-foreground-2"
        />
      </span>
      <div className="min-w-0 flex-1 basis-56">
        <div className="truncate text-foreground-2 text-sm">
          {statement.fileName}
        </div>
        <div className="mt-0.5 text-muted-foreground-3 text-xs">
          {m.bank_statement_detail({
            start: calendarDateNumericLabel(dateFormat, statement.periodStart),
            end: calendarDateNumericLabel(dateFormat, statement.periodEnd),
            lines: statement.lineCount,
            date: calendarDateNumericLabel(dateFormat, statement.importedAt),
          })}
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
