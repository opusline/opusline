import { Button } from "@opusline/ui/components/button";
import { Calendar } from "@opusline/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@opusline/ui/components/popover";
import { calendarLocale } from "@opusline/ui/lib/calendar-locale";
import { cn } from "@opusline/ui/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

import { useLocale } from "@/components/money-format-provider";
import {
  calendarDateLabel,
  fromCalendarDate,
  isCalendarDate,
  toCalendarDate,
} from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

/**
 * A calendar date, picked from a grid.
 *
 * The sibling of MonthField, and the same control: a trigger showing what is
 * chosen, opening the calendar. A date field that looks like a text box reads as
 * the native `<input type="date">` it replaced — and that one renders in the
 * *browser's* language, which has nothing to do with the account.
 *
 * The button spells the date out rather than showing 11/09/2026, because a
 * numeric date is the one thing that cannot be read without knowing which
 * layout it is in.
 *
 * The value is always a `Y-m-d` calendar date — the shape the API speaks —
 * never a Date, so no timezone gets a chance to shift the day.
 */
type DateFieldProps = {
  id?: string;
  /** `Y-m-d`, or "" when nothing is picked yet. */
  value: string;
  onChange: (value: string) => void;
  /** Earliest and latest selectable days, inclusive. */
  min?: string;
  max?: string;
  /**
   * Offers to empty the field from inside the calendar. Only for a date the
   * form actually lets go — an optional end date, not an invoice's issue date.
   */
  clearable?: boolean;
  disabled?: boolean;
  size?: "sm" | "default";
  className?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  onBlur?: () => void;
};

export function DateField({
  id,
  value,
  onChange,
  min,
  max,
  clearable = false,
  disabled,
  size = "default",
  className,
  onBlur,
  ...aria
}: DateFieldProps) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);

  const selected = isCalendarDate(value) ? fromCalendarDate(value) : undefined;
  const minDay = isCalendarDate(min) ? fromCalendarDate(min) : undefined;
  const maxDay = isCalendarDate(max) ? fromCalendarDate(max) : undefined;

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        render={
          <Button
            {...aria}
            className={cn(
              "w-full justify-between font-normal",
              disabled && "cursor-not-allowed",
              className,
            )}
            disabled={disabled}
            id={id}
            onBlur={onBlur}
            size={size === "sm" ? "xl" : "2xl"}
            variant="outline"
          />
        }
      >
        {selected === undefined ? (
          <span className="text-muted-foreground-3">
            {m.date_field_placeholder()}
          </span>
        ) : (
          <span>{calendarDateLabel(locale, value)}</span>
        )}
        <CalendarIcon aria-hidden />
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          autoFocus
          defaultMonth={selected ?? maxDay}
          disabled={[
            ...(minDay === undefined ? [] : [{ before: minDay }]),
            ...(maxDay === undefined ? [] : [{ after: maxDay }]),
          ]}
          endMonth={maxDay}
          locale={calendarLocale(locale)}
          mode="single"
          onSelect={(day) => {
            if (day !== undefined) {
              onChange(toCalendarDate(day));
              setOpen(false);
            }
          }}
          selected={selected}
          startMonth={minDay}
        />
        {/* Inside the calendar rather than beside the trigger: a button that
            appears next to the field only once a date is set makes the row jump
            the first time anyone picks one. */}
        {clearable && selected !== undefined && (
          <div className="border-t p-1.5">
            <Button
              className="w-full"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              size="lg"
              type="button"
              variant="ghost"
            >
              {m.date_field_clear()}
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
