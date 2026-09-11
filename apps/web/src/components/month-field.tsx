import { Button } from "@opusline/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@opusline/ui/components/popover";
import { cn } from "@opusline/ui/lib/utils";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { useLocale } from "@/components/money-format-provider";
import { cachedDateFormatter, capitalizeFirst, localDate } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

const MONTH_PATTERN = /^(\d{4})-(0[1-9]|1[0-2])$/;

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const SHORT_MONTH: Intl.DateTimeFormatOptions = { month: "short" };
const MONTH_AND_YEAR: Intl.DateTimeFormatOptions = {
  month: "long",
  year: "numeric",
};

type MonthFieldProps = {
  id?: string;
  /** `Y-m`, or "" when no month is picked yet. */
  value: string;
  onChange: (value: string) => void;
  /** The `Y-m` whose year the grid opens on while nothing is picked. */
  defaultMonth?: string;
  disabled?: boolean;
  className?: string;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
};

/**
 * A billed month, picked rather than typed.
 *
 * The sibling of DateField, and there for the same reason: `<input type="month">`
 * renders in the *browser's* language and layout, which has nothing to do with the
 * account. It differs only in its grid: twelve months where the other has a
 * calendar.
 *
 * The value is always `Y-m`, the shape the API speaks for a month.
 */
export function MonthField({
  id,
  value,
  onChange,
  defaultMonth,
  disabled,
  className,
  ...aria
}: MonthFieldProps) {
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const picked = MONTH_PATTERN.exec(value);

  const [year, setYear] = useState(() => {
    const opening = picked ?? MONTH_PATTERN.exec(defaultMonth ?? "");

    return opening === null ? new Date().getFullYear() : Number(opening[1]);
  });

  const label = (
    forYear: number,
    month: number,
    options: Intl.DateTimeFormatOptions,
  ) =>
    capitalizeFirst(
      cachedDateFormatter(locale, options).format(localDate(forYear, month, 1)),
    );

  const selectedMonth =
    picked !== null && Number(picked[1]) === year ? Number(picked[2]) : null;

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger
        render={
          <Button
            {...aria}
            className={cn("w-full justify-between font-normal", className)}
            disabled={disabled}
            id={id}
            size="2xl"
            variant="outline"
          />
        }
      >
        {picked === null ? (
          <span className="text-muted-foreground-3">
            {m.month_field_placeholder()}
          </span>
        ) : (
          <span>
            {label(Number(picked[1]), Number(picked[2]), MONTH_AND_YEAR)}
          </span>
        )}
        <CalendarIcon aria-hidden />
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3">
        <div className="flex items-center justify-between">
          <Button
            aria-label={m.month_field_previous_year()}
            onClick={() => setYear(year - 1)}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <ChevronLeft aria-hidden />
          </Button>
          <span className="font-medium text-sm tabular-nums">{year}</span>
          <Button
            aria-label={m.month_field_next_year()}
            onClick={() => setYear(year + 1)}
            size="icon-sm"
            type="button"
            variant="ghost"
          >
            <ChevronRight aria-hidden />
          </Button>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-1.5">
          {MONTHS.map((month) => (
            <Button
              key={month}
              onClick={() => {
                onChange(`${year}-${String(month).padStart(2, "0")}`);
                setOpen(false);
              }}
              size="lg"
              type="button"
              variant={selectedMonth === month ? "default" : "ghost"}
            >
              {/* Short on screen, whole to a screen reader: read on its own, out
                  of sight of the year above it, "juil." names nothing. */}
              <span aria-hidden>{label(year, month, SHORT_MONTH)}</span>
              <span className="sr-only">
                {label(year, month, MONTH_AND_YEAR)}
              </span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
