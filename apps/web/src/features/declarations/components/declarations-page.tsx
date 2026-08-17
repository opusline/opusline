import type {
  DeclarationData,
  DeclarationListData,
  FiscalDeadlineKind,
} from "@opusline/api-client";
import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Badge } from "@opusline/ui/components/badge";
import { Button } from "@opusline/ui/components/button";
import { cn } from "@opusline/ui/lib/utils";
import { Info } from "lucide-react";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatWholeAmount } from "@/lib/billing";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

const EYEBROW_CLASSES =
  "font-medium text-muted-foreground-2 text-xs uppercase tracking-widest";

const ROW_GRID =
  "grid grid-cols-[minmax(7rem,1fr)_7rem_8rem_minmax(9rem,auto)] items-center gap-3";

const KIND_MESSAGES: Record<FiscalDeadlineKind, () => string> = {
  0: m.deadlines_kind_vat,
  1: m.deadlines_kind_urssaf,
};

function declarationKey(declaration: DeclarationData): string {
  return `${declaration.kind}-${declaration.period}`;
}

type DeclarationRowProps = {
  declaration: DeclarationData;
  isSaving: boolean;
  onMarkFiled: (declaration: DeclarationData) => void;
};

function DeclarationRow({
  declaration,
  isSaving,
  onMarkFiled,
}: DeclarationRowProps) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();

  const declaredDiffers =
    declaration.declaredAmount !== null &&
    declaration.declaredAmount.amount !== declaration.amount?.amount;

  return (
    <div
      className={cn(
        ROW_GRID,
        "border-secondary border-b px-5 py-3.5 last:border-0",
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <Badge variant={declaration.kind === 0 ? "brand" : "neutral"}>
          {KIND_MESSAGES[declaration.kind]()}
        </Badge>
        <span className="truncate font-medium text-foreground-hi text-sm">
          {declaration.period}
        </span>
      </div>

      <span className="font-mono text-muted-foreground-3 text-xs tabular-nums">
        {calendarDateNumericLabel(dateFormat, declaration.dueOn)}
      </span>

      <span className="text-right font-mono text-foreground-hi text-sm tabular-nums">
        {declaration.amount === null
          ? "—"
          : formatWholeAmount(format, declaration.amount.amount)}
        {declaredDiffers && declaration.declaredAmount !== null && (
          <span className="block text-muted-foreground-3 text-xs">
            {m.declarations_declared_differs({
              amount: formatWholeAmount(
                format,
                declaration.declaredAmount.amount,
              ),
            })}
          </span>
        )}
      </span>

      <div className="flex items-center justify-end gap-2">
        {declaration.isFiled ? (
          <span className="text-muted-foreground-3 text-xs">
            {declaration.filedOn === null
              ? m.declarations_filed()
              : m.declarations_filed_on({
                  date: calendarDateNumericLabel(
                    dateFormat,
                    declaration.filedOn,
                  ),
                })}
          </span>
        ) : (
          <>
            {declaration.isLate && (
              <Badge variant="warn">{m.declarations_late()}</Badge>
            )}
            <Button
              disabled={isSaving}
              onClick={() => onMarkFiled(declaration)}
              size="sm"
              variant="outline"
            >
              {m.declarations_mark_filed()}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

type DeclarationsPageProps = {
  declarations: DeclarationListData;
  isSaving?: boolean;
  error?: string | null;
  onMarkFiled: (declaration: DeclarationData) => void;
};

export function DeclarationsPage({
  declarations,
  isSaving = false,
  error = null,
  onMarkFiled,
}: DeclarationsPageProps) {
  return (
    <div className="flex max-w-270 flex-col gap-5">
      <div>
        <h1 className="font-heading font-semibold text-2xl text-foreground-hi">
          {m.declarations_title()}
        </h1>
        <p className="mt-1.5 text-pretty text-muted-foreground-3 text-sm">
          {m.declarations_subtitle()}
        </p>
      </div>

      {error !== null && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {declarations.declarations.length === 0 ? (
        <div className="rounded-md border bg-card px-5 py-6 text-center text-muted-foreground-3 text-sm">
          {m.declarations_none()}
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border bg-card">
          <div className="overflow-x-auto">
            <div className="min-w-152">
              <div
                className={cn(ROW_GRID, EYEBROW_CLASSES, "border-b px-5 py-3")}
              >
                <div>{m.declarations_head_period()}</div>
                <div>{m.declarations_head_due()}</div>
                <div className="text-right">{m.declarations_head_amount()}</div>
                <div className="text-right">{m.declarations_head_state()}</div>
              </div>
              {declarations.declarations.map((declaration) => (
                <DeclarationRow
                  declaration={declaration}
                  isSaving={isSaving}
                  key={declarationKey(declaration)}
                  onMarkFiled={onMarkFiled}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {declarations.hasUncomputedVatSchedule && (
        <Alert>
          <Info />
          <AlertDescription>
            <strong className="font-medium">{m.deadlines_ca12_title()}</strong>{" "}
            {m.deadlines_ca12_body()}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
