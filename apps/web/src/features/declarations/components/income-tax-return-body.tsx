import type { IncomeTaxReturnData } from "@opusline/api-client";
import { CopyButton } from "@opusline/ui/components/copy-button";
import { Eyebrow, eyebrowVariants } from "@opusline/ui/components/eyebrow";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@opusline/ui/components/table";
import { cn } from "@opusline/ui/lib/utils";

import {
  useDateFormat,
  useLocale,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatWholeAmount, formatWholeFigure } from "@/lib/billing";
import { calendarDateNumericLabel } from "@/lib/dates";
import { isAtOrAfterCurrent, periodTitle } from "@/lib/periods";
import { m } from "@/paraglide/messages.js";

import { declarationCopyValue } from "../lib/labels";

type IncomeTaxReturnBodyProps = {
  incomeTaxReturn: IncomeTaxReturnData;
  /** `Y-m-d`, the account's today: which periods are still ahead, and whether the year runs. */
  today: string;
};

const HEAD_CLASSES = cn(
  eyebrowVariants({ tone: "quiet" }),
  "h-auto px-4 pt-2.5 pb-2 font-normal",
);
const CELL_CLASSES = "px-4 py-1.75 text-sm";

export function IncomeTaxReturnBody({
  incomeTaxReturn,
  today,
}: IncomeTaxReturnBodyProps) {
  const format = useMoneyFormat();
  const locale = useLocale();
  const dateFormat = useDateFormat();
  const money = (cents: number) => formatWholeAmount(format, cents);
  const withLiberatingPayment = incomeTaxReturn.box === 0;
  const isRunning = Number(today.slice(0, 4)) === incomeTaxReturn.year;

  return (
    <>
      <div className="rounded-md border border-primary/40 bg-background p-5">
        <Eyebrow>
          {m.declarations_income_tax_receipts({ year: incomeTaxReturn.year })}
        </Eyebrow>
        <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3.5">
          <span className="whitespace-nowrap font-mono text-4xl text-primary-text leading-none tabular-nums">
            {formatWholeFigure(format, incomeTaxReturn.grossReceipts.amount)}
          </span>
          <CopyButton
            copiedLabel={m.common_copied()}
            failedLabel={m.common_copy_failed()}
            label={m.common_copy()}
            value={declarationCopyValue(incomeTaxReturn.grossReceipts.amount)}
          />
        </div>
        <p className="mt-3 text-foreground-3 text-sm leading-relaxed">
          {m.declarations_income_tax_box_lead()}{" "}
          <strong className="font-medium text-foreground-hi">
            {withLiberatingPayment
              ? m.declarations_income_tax_box_5te_opted()
              : m.declarations_income_tax_box_5hq()}
          </strong>
        </p>
        <p className="mt-1 text-muted-foreground-3 text-xs">
          {withLiberatingPayment
            ? m.declarations_income_tax_without_option()
            : m.declarations_income_tax_with_option()}
        </p>
      </div>

      <div className="overflow-hidden rounded-md border bg-muted">
        <div className="flex items-baseline justify-between gap-2.5 border-b px-4 py-3">
          <span className="text-foreground-hi text-sm">
            {m.declarations_income_tax_coherence()}
          </span>
          <span className="text-muted-foreground-3 text-xs">
            {m.declarations_income_tax_coherence_count({
              count: incomeTaxReturn.periods.length,
            })}
          </span>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className={HEAD_CLASSES}>
                {m.declarations_history_month()}
              </TableHead>
              <TableHead className={cn(HEAD_CLASSES, "w-24 text-right")}>
                {m.declarations_income_tax_col_base()}
              </TableHead>
              <TableHead className={cn(HEAD_CLASSES, "w-28")}>
                {m.declarations_history_filed()}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incomeTaxReturn.periods.map((row) => {
              const isAhead =
                row.declaredOn === null &&
                isAtOrAfterCurrent(row.period, today);

              return (
                <TableRow className="hover:bg-transparent" key={row.period}>
                  <TableCell className={cn(CELL_CLASSES, "text-foreground-3")}>
                    {periodTitle(locale, row.period)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      CELL_CLASSES,
                      "text-right font-mono tabular-nums",
                      isAhead ? "text-muted-foreground-4" : "text-foreground-2",
                    )}
                  >
                    {isAhead ? "—" : money(row.base.amount)}
                  </TableCell>
                  <TableCell
                    className={cn(
                      CELL_CLASSES,
                      "text-xs",
                      row.declaredOn === null
                        ? isAhead
                          ? "text-muted-foreground-4"
                          : "text-attention"
                        : "text-muted-foreground-3",
                    )}
                  >
                    {row.declaredOn === null
                      ? isAhead
                        ? m.declarations_annual_upcoming_lower()
                        : m.declarations_history_to_file()
                      : calendarDateNumericLabel(dateFormat, row.declaredOn)}
                  </TableCell>
                </TableRow>
              );
            })}
            <TableRow className="hover:bg-transparent">
              <TableCell
                className={cn(CELL_CLASSES, "py-2.5 text-foreground-hi")}
              >
                {m.declarations_income_tax_total()}
              </TableCell>
              <TableCell
                className={cn(
                  CELL_CLASSES,
                  "py-2.5 text-right font-mono text-primary-text tabular-nums",
                )}
              >
                {money(incomeTaxReturn.grossReceipts.amount)}
              </TableCell>
              <TableCell
                className={cn(
                  CELL_CLASSES,
                  "py-2.5 text-muted-foreground-3 text-xs",
                )}
              >
                {isRunning && m.declarations_income_tax_provisional()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="rounded-md border bg-muted px-4 py-3.5">
        <div className="mb-2 text-foreground-hi text-sm">
          {m.declarations_income_tax_estimate()}
        </div>
        <dl>
          <div className="flex justify-between gap-3 py-1.5 text-sm">
            <dt className="text-muted-foreground-3">
              {m.declarations_income_tax_taxable()}
            </dt>
            <dd className="whitespace-nowrap font-mono text-foreground-2 tabular-nums">
              {money(incomeTaxReturn.taxableAfterAbatement.amount)}
            </dd>
          </div>
          {incomeTaxReturn.liberatingPaymentPaid !== null && (
            <div className="flex justify-between gap-3 py-1.5 text-sm">
              <dt className="text-muted-foreground-3">
                {m.declarations_income_tax_already_paid({
                  year: incomeTaxReturn.year,
                })}
              </dt>
              <dd className="whitespace-nowrap font-mono text-success tabular-nums">
                {money(incomeTaxReturn.liberatingPaymentPaid.amount)}
              </dd>
            </div>
          )}
        </dl>
        <p className="mt-1.5 text-muted-foreground-3 text-xs leading-relaxed">
          {withLiberatingPayment
            ? m.declarations_income_tax_liberating_note()
            : m.declarations_income_tax_progressive_note()}
        </p>
      </div>
    </>
  );
}
