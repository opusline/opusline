import type { AnnualDeclarationsData } from "@opusline/api-client";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import { useId } from "react";

import { useDateFormat } from "@/components/money-format-provider";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

export type AnnualReturnKind = "incomeTax" | "cfe";

type AnnualReturnsCardProps = {
  annual: AnnualDeclarationsData;
  onOpen: (kind: AnnualReturnKind) => void;
};

/** « À venir » until the return is done, then the date it was — filed for the 2042, paid for the CFE. */
export function AnnualReturnStatusBadge({
  kind,
  doneOn,
  shape,
}: {
  kind: AnnualReturnKind;
  doneOn: string | null;
  shape?: "pill";
}) {
  const dateFormat = useDateFormat();

  if (doneOn === null) {
    return (
      <Badge shape={shape} variant="quiet">
        {m.declarations_annual_upcoming()}
      </Badge>
    );
  }

  const date = calendarDateNumericLabel(dateFormat, doneOn);

  return (
    <Badge shape={shape} variant="success">
      {kind === "incomeTax"
        ? m.declarations_annual_filed_on({ date })
        : m.declarations_annual_paid_on({ date })}
    </Badge>
  );
}

export function AnnualReturnsCard({ annual, onOpen }: AnnualReturnsCardProps) {
  const dateFormat = useDateFormat();
  const titleId = useId();
  const { incomeTaxReturn, cfe } = annual;
  const rows = [
    {
      kind: "incomeTax" as const,
      name: m.declarations_kind_income_tax(),
      description: m.declarations_income_tax_description({
        year: incomeTaxReturn.year,
      }),
      due: m.declarations_annual_due_before({
        date: calendarDateNumericLabel(dateFormat, incomeTaxReturn.dueOn),
      }),
      doneOn: incomeTaxReturn.completion?.declaredOn ?? null,
    },
    ...(cfe === null
      ? []
      : [
          {
            kind: "cfe" as const,
            name: m.declarations_kind_cfe(),
            description: m.declarations_cfe_description(),
            due: calendarDateNumericLabel(dateFormat, cfe.dueOn),
            doneOn: cfe.completion?.paidOn ?? null,
          },
        ]),
  ];

  return (
    <section
      aria-labelledby={titleId}
      className="overflow-hidden rounded-md border bg-card"
    >
      <div className="border-b px-5 py-3.5">
        <h2
          className="font-heading font-semibold text-foreground-hi text-lg"
          id={titleId}
        >
          {m.declarations_annual_title()}
        </h2>
      </div>
      <ul>
        {rows.map((row) => (
          <li
            className="flex flex-wrap items-center gap-4 border-secondary border-b px-5 py-3 last:border-b-0"
            key={row.kind}
          >
            <div className="min-w-0 flex-1 basis-50">
              <div className="text-foreground-hi text-sm">{row.name}</div>
              <div className="mt-0.5 text-muted-foreground-3 text-xs">
                {row.description}
              </div>
            </div>
            <span className="whitespace-nowrap text-foreground-3 text-sm">
              {row.due}
            </span>
            <AnnualReturnStatusBadge doneOn={row.doneOn} kind={row.kind} />
            <Button
              aria-label={m.declarations_annual_open_aria({ name: row.name })}
              onClick={() => onOpen(row.kind)}
              size="sm"
              variant="link"
            >
              {m.declarations_annual_open()}
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
