import type {
  DeclarationCompletionData,
  DeclarationDeadlineData,
} from "@opusline/api-client";
import { cn } from "@opusline/ui/lib/utils";
import { Link } from "@tanstack/react-router";

import { useDateFormat } from "@/components/money-format-provider";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

import { declarationDeadlineTone } from "../lib/labels";

type DeclarationDeadlineLineProps = {
  deadline: DeclarationDeadlineData | null;
  completion: DeclarationCompletionData | null;
};

const TONE_CLASSES = {
  quiet: "text-muted-foreground-3",
  attention: "text-attention",
  overdue: "text-destructive",
} as const;

function timing(deadline: DeclarationDeadlineData): string | null {
  switch (declarationDeadlineTone(deadline)) {
    case "quiet":
      return null;
    case "overdue":
      return m.declarations_deadline_overdue();
    case "attention":
      return deadline.daysLeft === 0
        ? m.declarations_deadline_today()
        : m.declarations_deadline_soon({ count: deadline.daysLeft });
  }
}

export function DeclarationDeadlineLine({
  deadline,
  completion,
}: DeclarationDeadlineLineProps) {
  const dateFormat = useDateFormat();

  if (deadline === null) {
    return null;
  }

  const date = calendarDateNumericLabel(dateFormat, deadline.dueOn);
  const tone =
    completion === null ? declarationDeadlineTone(deadline) : "quiet";

  return (
    <p className={cn("text-sm leading-relaxed", TONE_CLASSES[tone])}>
      {completion !== null
        ? m.declarations_deadline_done({ date })
        : m.declarations_deadline_before({ date })}
      {completion === null && timing(deadline) !== null && (
        <> {timing(deadline)}</>
      )}
      {" · "}
      <Link
        aria-label={m.declarations_deadline_edit_aria()}
        className="text-link text-xs hover:text-link-hover"
        to="/settings"
      >
        {m.declarations_deadline_edit()}
      </Link>
    </p>
  );
}
