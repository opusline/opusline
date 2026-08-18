import { m } from "@/paraglide/messages.js";

import { PILL_SKINS, type PillSkin } from "../lib/pill-skins";

export const WEEK_SKINS: PillSkin[] = ["billedDay", "hourly", "nonBillable"];

type WeekLegendProps = {
  skins?: PillSkin[];
  /** The week's billable time no invoice covers yet; omitted when all of it is. */
  uninvoicedTotal?: string | null;
};

export function WeekLegend({
  skins = WEEK_SKINS,
  uninvoicedTotal = null,
}: WeekLegendProps) {
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-muted-foreground-3 text-xs">
      {skins.map((skin) => (
        <li className="flex items-center gap-2" key={skin}>
          <span
            aria-hidden
            className={`h-3 w-3.5 rounded-sm border ${PILL_SKINS[skin].swatch}`}
          />
          {PILL_SKINS[skin].label()}
        </li>
      ))}
      {uninvoicedTotal !== null && (
        <li className="flex items-center gap-2">
          <span
            aria-hidden
            className="size-2 rounded-full border-2 border-primary-note"
          />
          {m.week_uninvoiced_legend({ value: uninvoicedTotal })}
        </li>
      )}
    </ul>
  );
}
