import type { TreasuryData } from "@opusline/api-client";
import { cn } from "@opusline/ui/lib/utils";

import {
  useDateFormat,
  useMoneyFormat,
} from "@/components/money-format-provider";
import { formatPercentFromBp, formatWholeAmount } from "@/lib/billing";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";

import { TREASURY_BAND_SKINS } from "../lib/band-skins";
import { type TreasuryBandKey, treasuryBands } from "../lib/bands";

type TreasuryBreakdownProps = {
  data: TreasuryData;
};

export function TreasuryBreakdown({ data }: TreasuryBreakdownProps) {
  const format = useMoneyFormat();
  const dateFormat = useDateFormat();
  const bands = treasuryBands(data);

  if (bands.length === 0) {
    return null;
  }

  const { vat, urssaf, cfe } = data.provisions;

  // Undefined, not an empty string: a provision that does not apply has neither
  // a band nor a caption.
  const captions: Record<TreasuryBandKey, string | undefined> = {
    vat:
      vat === null
        ? undefined
        : m.treasury_band_vat_sub({
            date: calendarDateNumericLabel(dateFormat, vat.periodEnd),
          }),
    urssaf:
      urssaf === null
        ? undefined
        : m.treasury_band_urssaf_sub({
            rate: m.common_percent({
              value: formatPercentFromBp(format.locale, urssaf.rateBp ?? 0),
            }),
            date: calendarDateNumericLabel(dateFormat, urssaf.periodEnd),
          }),
    cfe:
      cfe === null
        ? undefined
        : m.treasury_band_cfe_sub({ year: cfe.periodEnd.slice(0, 4) }),
    buffer: m.treasury_band_buffer_sub(),
    transferable: m.treasury_band_transferable_sub(),
  };

  return (
    <section className="rounded-md border bg-card p-6">
      <div
        aria-label={m.treasury_breakdown_aria()}
        className="flex h-9 overflow-hidden rounded-sm border"
        role="img"
      >
        {bands.map((band) => (
          <div
            className={TREASURY_BAND_SKINS[band.key].swatch}
            key={band.key}
            // Grown in proportion rather than sized in percent, so the four
            // shares divide the bar exactly whatever it is wide.
            style={{ flexBasis: 0, flexGrow: band.ratio }}
          />
        ))}
      </div>

      <dl className="mt-5 grid grid-cols-[repeat(auto-fit,minmax(10rem,1fr))] gap-5">
        {bands.map((band) => {
          const skin = TREASURY_BAND_SKINS[band.key];

          return (
            <div key={band.key}>
              <dt className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={cn("size-2.5 shrink-0 rounded-xs", skin.swatch)}
                />
                <span className={cn("text-sm", skin.label_tone)}>
                  {skin.label()}
                </span>
              </dt>
              <dd
                className={cn(
                  "whitespace-nowrap font-mono text-xl tabular-nums",
                  skin.value_tone,
                )}
              >
                {formatWholeAmount(format, band.amountCents)}
              </dd>
              {captions[band.key] !== undefined && (
                <dd className="mt-1 text-muted-foreground-3 text-xs">
                  {captions[band.key]}
                </dd>
              )}
            </div>
          );
        })}
      </dl>
    </section>
  );
}
