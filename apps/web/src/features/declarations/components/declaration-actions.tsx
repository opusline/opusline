import type { DeclarationCompletionData } from "@opusline/api-client";
import { Button, ButtonLink } from "@opusline/ui/components/button";
import { CheckIcon, ExternalLinkIcon } from "lucide-react";

import { useDateFormat } from "@/components/money-format-provider";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

import { EXTENSION_DOCS_URL } from "../lib/handoff";

type DeclarationActionsProps = {
  completion: DeclarationCompletionData | null;
  /** Nothing to tick for a period the account did not exist in. */
  hasDeadline: boolean;
  href: string;
  linkLabel: string;
  /** The portal URL carrying the figures for the browser extension to type in. */
  prefill?: { href: string; label: string };
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
  prefill,
  isBusy,
  onMarkFiled,
  onMarkPaid,
  onUndo,
}: DeclarationActionsProps) {
  const dateFormat = useDateFormat();
  const isPending = completion === null && hasDeadline;

  return (
    <div className="mt-auto border-t pt-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <a
          className="text-link text-sm transition-colors hover:text-link-hover"
          href={href}
          rel="noreferrer"
          target="_blank"
        >
          {linkLabel}
        </a>
        {completion === null ? (
          isPending && (
            <div className="flex flex-wrap items-center gap-2.5">
              {prefill !== undefined && (
                <ButtonLink
                  render={
                    <a href={prefill.href} rel="noreferrer" target="_blank" />
                  }
                  size="xl"
                  variant="brand-outline"
                >
                  <ExternalLinkIcon aria-hidden />
                  {prefill.label}
                </ButtonLink>
              )}
              <Button
                disabled={isBusy}
                onClick={onMarkFiled}
                size="xl"
                variant="outline"
              >
                <CheckIcon aria-hidden />
                {m.declarations_mark_filed()}
              </Button>
            </div>
          )
        ) : (
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="inline-flex items-center gap-2 text-sm text-success">
              <CheckIcon aria-hidden className="size-3" />
              {m.declarations_filed_on({
                date: calendarDateNumericLabel(
                  dateFormat,
                  completion.declaredOn,
                ),
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
      {prefill !== undefined && isPending && (
        <p className="mt-2 text-right text-muted-foreground-3 text-xs">
          {m.declarations_prefill_hint()}{" "}
          <a
            className="text-link underline underline-offset-4 transition-colors hover:text-link-hover"
            href={EXTENSION_DOCS_URL}
            rel="noreferrer"
            target="_blank"
          >
            {m.declarations_prefill_hint_link()}
          </a>
        </p>
      )}
    </div>
  );
}
