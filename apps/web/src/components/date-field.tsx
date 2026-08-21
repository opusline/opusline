import { Button } from "@opusline/ui/components/button";
import { Calendar } from "@opusline/ui/components/calendar";
import {
  InputGroup,
  InputGroupInput,
} from "@opusline/ui/components/input-group";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@opusline/ui/components/popover";
import { calendarLocale } from "@opusline/ui/lib/calendar-locale";
import { CalendarIcon } from "lucide-react";
import { useRef, useState } from "react";

import { useDateFormat, useLocale } from "@/components/money-format-provider";
import {
  calendarDateNumericLabel,
  fromCalendarDate,
  isCalendarDate,
  parseNumericDate,
  toCalendarDate,
} from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

/**
 * A calendar date, typed or picked, in the layout the account chose.
 *
 * The native `<input type="date">` renders in the *browser's* language, which
 * has nothing to do with the account: Chrome shows 08/21/2026 to a French user
 * whose Chrome is in English, and no `lang` attribute changes that. Every other
 * date in the app follows the user's own DateFormat, so this one does too.
 *
 * It stays a text input rather than becoming a picker-only trigger because
 * typing a date is faster than navigating to it, and because the forms around
 * it rely on a date being clearable — "paid on" has to be able to go empty.
 *
 * The value is always a `Y-m-d` calendar date — the shape the API speaks —
 * never a Date, so no timezone gets a chance to shift the day. A draft that is
 * not yet a real day reads as no date at all, so nothing errors mid-keystroke.
 */
type DateFieldProps = {
  id?: string;
  /** `Y-m-d`, or "" when nothing is picked yet. */
  value: string;
  onChange: (value: string) => void;
  /** Earliest and latest selectable days, inclusive. */
  min?: string;
  max?: string;
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
  disabled,
  size = "default",
  className,
  onBlur,
  ...aria
}: DateFieldProps) {
  const locale = useLocale();
  const dateFormat = useDateFormat();
  const [open, setOpen] = useState(false);

  const shown = (date: string) =>
    date === "" ? "" : calendarDateNumericLabel(dateFormat, date);

  const [draft, setDraft] = useState(() => shown(value));

  // The draft is the user's half-finished text, so it must not be clobbered by
  // the "" this component itself emits for an incomplete date. Only a value
  // that changed somewhere else re-seeds it.
  const emitted = useRef(value);

  if (value !== emitted.current) {
    emitted.current = value;
    setDraft(shown(value));
  }

  const emit = (next: string) => {
    emitted.current = next;
    onChange(next);
  };

  // `Y-m-d` compares lexicographically the way it reads, so the bounds the
  // calendar greys out hold for a typed date too — otherwise the picker would
  // refuse a day the keyboard let straight through.
  const inRange = (date: string) =>
    (min === undefined || date >= min) && (max === undefined || date <= max);

  const selected = isCalendarDate(value) ? fromCalendarDate(value) : undefined;
  const minDay = isCalendarDate(min) ? fromCalendarDate(min) : undefined;
  const maxDay = isCalendarDate(max) ? fromCalendarDate(max) : undefined;

  return (
    <InputGroup className={className} size={size}>
      <InputGroupInput
        {...aria}
        className="flex-1"
        disabled={disabled}
        id={id}
        inputMode="numeric"
        onBlur={onBlur}
        onChange={(event) => {
          setDraft(event.target.value);

          const parsed = parseNumericDate(dateFormat, event.target.value);

          emit(parsed !== null && inRange(parsed) ? parsed : "");
        }}
        placeholder={
          dateFormat === 1 ? m.date_field_hint_iso() : m.date_field_hint_dmy()
        }
        value={draft}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              aria-label={m.date_field_open_calendar()}
              className="-mr-1.5 shrink-0"
              disabled={disabled}
              size="icon-sm"
              variant="ghost"
            />
          }
        >
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
                const picked = toCalendarDate(day);
                setDraft(shown(picked));
                emit(picked);
                setOpen(false);
              }
            }}
            selected={selected}
            startMonth={minDay}
          />
        </PopoverContent>
      </Popover>
    </InputGroup>
  );
}
