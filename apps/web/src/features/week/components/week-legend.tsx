import { PILL_SKINS, type PillSkin } from "../lib/pill-skins";

export const WEEK_SKINS: PillSkin[] = ["billedDay", "hourly", "nonBillable"];

export function WeekLegend({ skins = WEEK_SKINS }: { skins?: PillSkin[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-muted-foreground-3 text-xs">
      {skins.map((skin) => (
        <li className="flex items-center gap-2" key={skin}>
          <span
            aria-hidden
            className={`h-3 w-3.5 rounded-sm border ${PILL_SKINS[skin].swatch}`}
          />
          {PILL_SKINS[skin].label}
        </li>
      ))}
    </ul>
  );
}
