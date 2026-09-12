import type {
  DeclarationCompletionData,
  DeclarationHistoryRowData,
} from "@opusline/api-client";
import { eyebrowVariants } from "@opusline/ui/components/eyebrow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@opusline/ui/components/table";
import { cn } from "@opusline/ui/lib/utils";
import { Link } from "@tanstack/react-router";

import {
  useDateFormat,
  useLocale,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { calendarDateNumericLabel } from "@/lib/dates";
import { periodTitle } from "@/lib/periods";
import { m } from "@/paraglide/messages.js";

type DeclarationsHistoryCardProps = {
  history: DeclarationHistoryRowData[];
  /** The period on screen, highlighted in the table. */
  period: string;
};

const HEAD_CLASSES = cn(
  eyebrowVariants({ tone: "quiet" }),
  "h-auto px-2 pt-2.5 pb-2 font-normal first:pl-5 last:pr-5",
);
const CELL_CLASSES = "px-2 py-2.75 text-sm first:pl-5 last:pr-5";
const AMOUNT_CLASSES = cn(
  CELL_CLASSES,
  "text-right font-mono text-foreground-2 tabular-nums",
);

export function DeclarationsHistoryCard({
  history,
  period,
}: DeclarationsHistoryCardProps) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();
  const locale = useLocale();

  const filedCell = (completion: DeclarationCompletionData | null) =>
    completion === null ? (
      <span className="text-attention">{m.declarations_history_to_file()}</span>
    ) : (
      <span className="text-muted-foreground-3">
        {calendarDateNumericLabel(dateFormat, completion.declaredOn)}
      </span>
    );
  // « à payer » only once filed and only when there is something to pay: a
  // credit month or an empty period is done the day it is filed.
  const paidCell = (
    completion: DeclarationCompletionData | null,
    owedCents: number,
  ) =>
    completion?.paidOn != null ? (
      <span className="text-muted-foreground-3">
        {calendarDateNumericLabel(dateFormat, completion.paidOn)}
      </span>
    ) : completion !== null && owedCents > 0 ? (
      <span className="text-attention">{m.declarations_history_to_pay()}</span>
    ) : (
      <span className="text-muted-foreground-3">—</span>
    );

  return (
    <section className="overflow-hidden rounded-md border bg-card">
      <div className="border-b px-5 py-3.5">
        <h2 className="font-heading font-semibold text-foreground-hi text-lg">
          {m.declarations_history_title()}
        </h2>
      </div>
      <Table className="table-fixed">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className={HEAD_CLASSES}>
              {m.declarations_history_month()}
            </TableHead>
            <TableHead className={cn(HEAD_CLASSES, "w-24 text-right")}>
              {m.declarations_kind_urssaf()}
            </TableHead>
            <TableHead className={cn(HEAD_CLASSES, "w-24")}>
              {m.declarations_history_filed()}
            </TableHead>
            <TableHead className={cn(HEAD_CLASSES, "w-24")}>
              {m.declarations_history_paid()}
            </TableHead>
            <TableHead className={cn(HEAD_CLASSES, "w-28 text-right")}>
              {m.declarations_history_vat()}
            </TableHead>
            <TableHead className={cn(HEAD_CLASSES, "w-24")}>
              {m.declarations_history_filed()}
            </TableHead>
            <TableHead className={cn(HEAD_CLASSES, "w-24")}>
              {m.declarations_history_paid()}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((row) => (
            <TableRow
              className={cn(
                "border-t hover:bg-accent",
                row.period === period && "bg-primary/6",
              )}
              key={row.period}
            >
              <TableCell className={cn(CELL_CLASSES, "text-foreground-hi")}>
                <Link
                  className="hover:text-primary-text"
                  search={{ period: row.period }}
                  to="/declarations"
                >
                  {periodTitle(locale, row.period)}
                </Link>
              </TableCell>
              <TableCell className={AMOUNT_CLASSES}>
                {row.urssaf === null
                  ? "—"
                  : formatWholeAmount(format, row.urssaf.total.amount)}
              </TableCell>
              <TableCell className={CELL_CLASSES}>
                {row.urssaf === null ? "—" : filedCell(row.urssaf.completion)}
              </TableCell>
              <TableCell className={CELL_CLASSES}>
                {row.urssaf === null
                  ? "—"
                  : paidCell(row.urssaf.completion, row.urssaf.total.amount)}
              </TableCell>
              <TableCell className={AMOUNT_CLASSES}>
                {row.vat === null
                  ? "—"
                  : row.vat.credit.amount > 0
                    ? m.declarations_history_credit({
                        amount: formatWholeAmount(
                          format,
                          row.vat.credit.amount,
                        ),
                      })
                    : formatWholeAmount(format, row.vat.due.amount)}
              </TableCell>
              <TableCell className={CELL_CLASSES}>
                {row.vat === null ? "—" : filedCell(row.vat.completion)}
              </TableCell>
              <TableCell className={CELL_CLASSES}>
                {row.vat === null
                  ? "—"
                  : paidCell(row.vat.completion, row.vat.due.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
