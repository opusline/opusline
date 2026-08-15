import { Button } from "@opusline/ui/components/button";
import { m } from "@/paraglide/messages.js";

type WeekEmptyBannerProps = {
  previousWeekEntryCount: number;
  isRepeating: boolean;
  onRepeat: () => void;
};

export function WeekEmptyBanner({
  previousWeekEntryCount,
  isRepeating,
  onRepeat,
}: WeekEmptyBannerProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-primary/30 bg-primary/6 px-5 py-3.5">
      <div>
        <p className="text-primary-text text-sm">{m.week_empty_title()}</p>
        <p className="text-muted-foreground text-sm">
          {m.week_empty_description()}
        </p>
      </div>
      <Button disabled={isRepeating} onClick={onRepeat} size="xl">
        {isRepeating
          ? m.week_repeat_pending()
          : m.week_repeat_button({ count: previousWeekEntryCount })}
      </Button>
    </div>
  );
}
