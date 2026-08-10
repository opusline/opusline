import { PILL_SKINS } from "../lib/pill-skins";

export function WeekLegend() {
  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-muted-foreground-3 text-xs">
      {Object.entries(PILL_SKINS).map(([skin, { label, swatch }]) => (
        <li className="flex items-center gap-2" key={skin}>
          <span
            aria-hidden
            className={`h-3 w-3.5 rounded-sm border ${swatch}`}
          />
          {label}
        </li>
      ))}
    </ul>
  );
}
