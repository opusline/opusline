import type { DeclarationCompletionData } from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import { CheckIcon } from "lucide-react";

import { useDateFormat } from "@/components/money-format-provider";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

type DeclarationActionsProps = {
  completion: DeclarationCompletionData | null;
  /** Nothing to tick for a period the account did not exist in. */
  hasDeadline: boolean;
  href: string;
  linkLabel: string;
  isBusy: boolean;
  onMarkFiled: () => void;
  onMarkPaid: () => void;
  onUndo: (completion: DeclarationCompletionData) => void;
};

export function DeclarationActions({
  completion,
  hasDeadline,
  href,
  linkLabel,
  isBusy,
  onMarkFiled,
  onMarkPaid,
  onUndo,
}: DeclarationActionsProps) {
  const dateFormat = useDateFormat();

  return (
    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t pt-4">
      <a
        className="text-link text-sm transition-colors hover:text-link-hover"
        href={href}
        rel="noreferrer"
        target="_blank"
      >
        {linkLabel}
      </a>
      {completion === null ? (
        hasDeadline && (
          <Button
            disabled={isBusy}
            onClick={onMarkFiled}
            size="xl"
            variant="outline"
          >
            <CheckIcon aria-hidden />
            {m.declarations_mark_filed()}
          </Button>
        )
      ) : (
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-2 text-sm text-success">
            <CheckIcon aria-hidden className="size-3" />
            {m.declarations_filed_on({
              date: calendarDateNumericLabel(dateFormat, completion.declaredOn),
            })}
            {completion.paidOn !== null &&
              ` · ${m.declarations_paid_on({ date: calendarDateNumericLabel(dateFormat, completion.paidOn) })}`}
          </span>
          {completion.paidOn === null && (
            <Button
              disabled={isBusy}
              onClick={onMarkPaid}
              size="lg"
              variant="outline"
            >
              {m.declarations_mark_paid()}
            </Button>
          )}
          <Button
            disabled={isBusy}
            onClick={() => onUndo(completion)}
            size="sm"
            variant="link"
          >
            {m.declarations_undo()}
          </Button>
        </div>
      )}
    </div>
  );
}
