import { cn } from "@opusline/ui/lib/utils";

import { useLocale } from "@/components/money-format-provider";
import { cachedDateFormatter, fromCalendarDate } from "@/lib/dates";

type DateTileProps = {
  /** `Y-m-d`. */
  date: string;
  size?: "default" | "sm";
};

export function DateTile({ date, size = "default" }: DateTileProps) {
  const locale = useLocale();
  const day = fromCalendarDate(date);

  return (
    <time
      className={cn(
        "flex shrink-0 flex-col items-center justify-center rounded-md border bg-muted",
        size === "sm" ? "size-10" : "h-11 w-12",
      )}
      dateTime={date}
    >
      <span
        className={cn(
          "font-mono text-foreground-hi leading-none tabular-nums",
          size === "sm" ? "text-sm" : "text-base",
        )}
      >
        {String(day.getDate()).padStart(2, "0")}
      </span>
      <span className="mt-0.75 text-2xs text-muted-foreground-3 uppercase tracking-wider">
        {/* French abbreviates with a trailing dot the tile has no room for. */}
        {cachedDateFormatter(locale, { month: "short" })
          .format(day)
          .replace(".", "")}
      </span>
    </time>
  );
}
