import type { AnnualDeclarationsData } from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@opusline/ui/components/sheet";
import { Link } from "@tanstack/react-router";
import { CheckIcon } from "lucide-react";
import { useState } from "react";

import { useDateFormat } from "@/components/money-format-provider";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

import {
  type AnnualReturnKind,
  AnnualReturnStatusBadge,
} from "./annual-returns-card";
import { CfeAmountDialog } from "./cfe-amount-dialog";
import { CfeReturnBody } from "./cfe-return-body";
import { IncomeTaxReturnBody } from "./income-tax-return-body";

type AnnualReturnSheetProps = {
  open: AnnualReturnKind | null;
  annual: AnnualDeclarationsData;
  /** `Y-m-d`, the account's today. */
  today: string;
  isBusy: boolean;
  onOpenChange: (open: boolean) => void;
  /** Files the 2042, or pays the CFE — whichever sheet is open. */
  onMarkDone: () => void;
  onUndo: () => void;
  onSaveCfeAmount: (cents: number) => Promise<void>;
};

export function AnnualReturnSheet({
  open,
  annual,
  today,
  isBusy,
  onOpenChange,
  onMarkDone,
  onUndo,
  onSaveCfeAmount,
}: AnnualReturnSheetProps) {
  const dateFormat = useDateFormat();
  const [isAmountDialogOpen, setIsAmountDialogOpen] = useState(false);
  const { incomeTaxReturn, cfe } = annual;
  const isRunningYear = Number(today.slice(0, 4)) === incomeTaxReturn.year;
  const view =
    open === "incomeTax"
      ? {
          kind: open,
          title: m.declarations_income_tax_sheet_title({
            year: incomeTaxReturn.year,
          }),
          deadline: m.declarations_income_tax_deadline({
            date: calendarDateNumericLabel(dateFormat, incomeTaxReturn.dueOn),
          }),
          doneOn: incomeTaxReturn.completion?.declaredOn ?? null,
          href: "https://www.impots.gouv.fr",
          linkLabel: m.declarations_vat_link(),
          actionLabel: m.declarations_mark_filed(),
          // A running year's income cannot be declared yet: the fisc asks in the spring.
          canMarkDone: !isRunningYear,
          body: (
            <IncomeTaxReturnBody
              incomeTaxReturn={incomeTaxReturn}
              today={today}
            />
          ),
        }
      : open === "cfe" && cfe !== null
        ? {
            kind: open,
            title: m.declarations_cfe_sheet_title({ year: cfe.year }),
            deadline: m.declarations_cfe_deadline({
              date: calendarDateNumericLabel(dateFormat, cfe.dueOn),
            }),
            doneOn: cfe.completion?.paidOn ?? null,
            href: "https://cfspro.impots.gouv.fr",
            linkLabel: m.declarations_cfe_link(),
            actionLabel: m.declarations_cfe_mark_paid(),
            canMarkDone: true,
            body: (
              <CfeReturnBody
                cfe={cfe}
                isRunningYear={isRunningYear}
                onEnterAmount={() => setIsAmountDialogOpen(true)}
              />
            ),
          }
        : null;

  return (
    <Sheet onOpenChange={onOpenChange} open={view !== null}>
      <SheetContent side="right" size="lg">
        {view !== null && (
          <>
            <SheetHeader className="border-b pb-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <SheetTitle size="lg">{view.title}</SheetTitle>
                  <SheetDescription className="mt-1.5 text-muted-foreground-3 text-sm">
                    {view.deadline}
                    {" · "}
                    <Link
                      aria-label={m.declarations_deadline_edit_aria()}
                      className="text-link text-xs hover:text-link-hover"
                      to="/settings"
                    >
                      {m.declarations_deadline_edit()}
                    </Link>
                  </SheetDescription>
                </div>
                <div className="mr-8 shrink-0">
                  <AnnualReturnStatusBadge
                    doneOn={view.doneOn}
                    kind={view.kind}
                    shape="pill"
                  />
                </div>
              </div>
            </SheetHeader>
            <SheetBody className="flex flex-col gap-3.5 py-5">
              {view.body}
            </SheetBody>
            <SheetFooter className="flex-row flex-wrap items-center justify-between gap-3 border-t pt-4">
              <a
                className="text-link text-sm transition-colors hover:text-link-hover"
                href={view.href}
                rel="noreferrer"
                target="_blank"
              >
                {view.linkLabel}
              </a>
              {view.doneOn !== null ? (
                <Button
                  disabled={isBusy}
                  onClick={onUndo}
                  size="sm"
                  variant="link"
                >
                  {m.declarations_annual_undo()}
                </Button>
              ) : (
                view.canMarkDone && (
                  <Button disabled={isBusy} onClick={onMarkDone} size="xl">
                    <CheckIcon aria-hidden />
                    {view.actionLabel}
                  </Button>
                )
              )}
            </SheetFooter>
            {cfe !== null && (
              <CfeAmountDialog
                initialCents={
                  cfe.isEstimate ? null : (cfe.expected?.amount ?? null)
                }
                onOpenChange={setIsAmountDialogOpen}
                onSave={async (cents) => {
                  await onSaveCfeAmount(cents);
                  setIsAmountDialogOpen(false);
                }}
                open={isAmountDialogOpen}
              />
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
