import type { CraDetailData, SettingsData } from "@opusline/api-client";
import { Button } from "@opusline/ui/components/button";
import { Switch } from "@opusline/ui/components/switch";
import { PenLineIcon } from "lucide-react";

import { useMoneyFormat } from "@/components/money-format-provider";
import { formatMissionRate } from "@/lib/billing";
import { accountTodayCalendarDate, calendarDateLabel } from "@/lib/dates";
import { monthTitle } from "@/lib/months";
import { PAPER } from "@/lib/paper";

import type { CraGridModel } from "../lib/cra-grid";
import { formatDayFraction } from "../lib/cra-grid";
import { EYEBROW, SIGNATURE_MISSING, SIGNATURE_ON } from "../lib/labels";

type CraDocumentProps = {
  detail: CraDetailData;
  model: CraGridModel;
  settings: SettingsData;
  /** Who issues the document when no trade name is set — never the client. */
  issuerFallbackName: string;
  signatureSrc: string;
  applySignature: boolean;
  onApplySignatureChange: (applySignature: boolean) => void;
  onOpenSignatureSettings: () => void;
};

/**
 * Mirrors RenderCraPdf::placeAndDate() — the signature block on paper carries the date
 * as well as the city, and still carries the date when no city is set.
 */
function placeAndDate(city: string | null, timezone: string): string {
  const today = calendarDateLabel("fr-FR", accountTodayCalendarDate(timezone));

  return city === null ? ` · le ${today}` : ` · fait à ${city}, le ${today}`;
}

/** The document as the client will receive it. */
export function CraDocument({
  detail,
  model,
  settings,
  issuerFallbackName,
  signatureSrc,
  applySignature,
  onApplySignatureChange,
  onOpenSignatureSettings,
}: CraDocumentProps) {
  const format = useMoneyFormat();
  const { cra, client, mission, recipientName } = detail;
  const issuerName = settings.tradeName ?? issuerFallbackName;

  return (
    <section className="min-w-0 flex-1">
      <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
        <span className={EYEBROW}>Aperçu du document</span>
        {settings.hasSignature ? (
          // biome-ignore lint/a11y/noLabelWithoutControl: Base UI's Switch renders a hidden input beside its span, so the wrapping label is its control
          <label className="flex cursor-pointer items-center gap-2 text-muted-foreground-3 text-sm">
            <Switch
              checked={applySignature}
              onCheckedChange={onApplySignatureChange}
            />
            {SIGNATURE_ON}
          </label>
        ) : (
          <Button onClick={onOpenSignatureSettings} size="xl" variant="outline">
            <PenLineIcon aria-hidden data-icon="inline-start" />
            {SIGNATURE_MISSING}
          </Button>
        )}
      </div>

      <article
        className="rounded-sm p-8 shadow-lg"
        style={{ background: "#FFFFFF", color: PAPER.ink }}
      >
        <header
          className="flex flex-wrap items-start justify-between gap-4 pb-3.5"
          style={{ borderBottom: `2px solid ${PAPER.ink}` }}
        >
          <div>
            <h2 className="font-heading font-semibold text-xl">
              Compte rendu d'activité
            </h2>
            <p className="mt-0.75 text-xs" style={{ color: "#444444" }}>
              {monthTitle("fr-FR", cra.month)}
            </p>
          </div>
          <div className="text-right text-xs leading-relaxed">
            <div className="font-semibold">{issuerName}</div>
            {settings.siret !== null && <div>SIRET {settings.siret}</div>}
            {settings.vatNumber !== null && <div>TVA {settings.vatNumber}</div>}
            <div style={{ color: PAPER.quiet }}>{addressLine(settings)}</div>
            <div style={{ color: PAPER.quiet }}>{contactLine(settings)}</div>
          </div>
        </header>

        <div
          className="flex flex-wrap justify-between gap-3 py-4 text-xs"
          style={{ color: "#333333" }}
        >
          <span>
            <span style={{ color: PAPER.faint }}>Client :</span> {client.name}
          </span>
          <span>
            <span style={{ color: PAPER.faint }}>Mission :</span> {mission.name}
          </span>
          <span>
            <span style={{ color: PAPER.faint }}>TJM :</span>{" "}
            {formatMissionRate(format, mission)}
          </span>
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {model.weekdayLabels.map((label) => (
            <div
              className="pb-0.75 text-center text-xs uppercase tracking-wider"
              key={label}
              style={{ color: PAPER.faint }}
            >
              {label}
            </div>
          ))}
          {model.weeks.flatMap((week) =>
            week.cells.map((cell) => (
              <div
                className="flex h-11 flex-col px-1 py-0.5"
                key={cell.key}
                style={paperCellStyle(cell)}
              >
                {cell.date !== null && (
                  <>
                    <span className="text-xs" style={{ color: PAPER.faint }}>
                      {cell.dayOfMonth}
                    </span>
                    <span className="mt-auto text-center font-semibold text-xs">
                      {formatDayFraction(format.locale, cell.dayFractionBp)}
                    </span>
                  </>
                )}
              </div>
            )),
          )}
        </div>

        <div
          className="flex flex-wrap gap-3.5 py-3.5 text-xs"
          style={{ color: PAPER.faint }}
        >
          <span>1 = journée</span>
          <span>0,5 = demi-journée</span>
          <span>Grisé = week-end ou férié</span>
          <span>Ambré = jour non ouvré travaillé</span>
        </div>

        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th
                className="py-1.5 pr-1 text-left font-semibold"
                style={{ borderBottom: `1px solid ${PAPER.ink}` }}
              >
                Semaine
              </th>
              <th
                className="py-1.5 pl-1 text-right font-semibold"
                style={{ borderBottom: `1px solid ${PAPER.ink}` }}
              >
                Jours
              </th>
            </tr>
          </thead>
          <tbody>
            {model.weeks.map((week) => {
              const total = week.cells.reduce(
                (sum, cell) => sum + cell.dayFractionBp,
                0,
              );

              if (total === 0) {
                return null;
              }

              return (
                <tr key={week.key}>
                  <td
                    className="py-1.5 pr-1 tabular-nums"
                    style={{ borderBottom: `1px solid ${PAPER.rule}` }}
                  >
                    {weekLabel(week.cells)}
                  </td>
                  <td
                    className="py-1.5 pl-1 text-right tabular-nums"
                    style={{ borderBottom: `1px solid ${PAPER.rule}` }}
                  >
                    {formatDayFraction(format.locale, total)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr>
              <td
                className="py-2.5 pr-1 font-semibold"
                style={{ borderTop: `2px solid ${PAPER.ink}` }}
              >
                Total à facturer
              </td>
              <td
                className="py-2.5 pl-1 text-right font-semibold tabular-nums"
                style={{ borderTop: `2px solid ${PAPER.ink}` }}
              >
                {cra.totalDays.toLocaleString(format.locale, {
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
          </tfoot>
        </table>

        <div
          className="mt-8 grid grid-cols-2 gap-7 text-xs"
          style={{ color: "#333333" }}
        >
          <div>
            <div className="font-semibold">Le prestataire</div>
            <div className="mt-0.5" style={{ color: PAPER.faint }}>
              {issuerName}
              {placeAndDate(settings.signatureCity, settings.timezone)}
            </div>
            <div
              className="mt-1.5 flex h-13 items-end"
              style={{ borderBottom: "1px solid #BBBBBB" }}
            >
              {applySignature &&
                settings.hasSignature &&
                signatureSrc !== "" && (
                  <img
                    alt="Signature"
                    className="max-h-11 object-contain"
                    src={signatureSrc}
                  />
                )}
            </div>
          </div>
          <div>
            <div className="font-semibold">Le client — bon pour accord</div>
            <div className="mt-0.5" style={{ color: PAPER.faint }}>
              {recipientName} · date et signature
            </div>
            <div
              className="mt-1.5 h-13"
              style={{ borderBottom: "1px solid #BBBBBB" }}
            />
          </div>
        </div>
      </article>
    </section>
  );
}

function paperCellStyle(cell: {
  date: string | null;
  dayFractionBp: number;
  isWeekend: boolean;
  isHoliday: boolean;
  isOffDayWorked: boolean;
}) {
  if (cell.date === null) {
    return undefined;
  }

  if (cell.isOffDayWorked) {
    return {
      background: PAPER.offDay,
      border: `1px solid ${PAPER.offDayBorder}`,
    };
  }

  if (cell.dayFractionBp > 0) {
    return {
      background: PAPER.worked,
      border: `1px solid ${PAPER.workedBorder}`,
    };
  }

  if (cell.isWeekend || cell.isHoliday) {
    return { background: PAPER.closed };
  }

  return { border: `1px dashed ${PAPER.rule}` };
}

function weekLabel(cells: { date: string | null }[]): string {
  const dates = cells
    .map((cell) => cell.date)
    .filter((date): date is string => date !== null);
  const first = Number(dates[0].slice(8, 10));
  const last = Number(dates[dates.length - 1].slice(8, 10));

  return `${first} – ${last}`;
}

function addressLine(settings: SettingsData): string {
  return [
    settings.companyAddressLine1,
    settings.companyAddressLine2,
    [settings.companyPostalCode, settings.companyCity]
      .filter((part) => part !== null)
      .join(" "),
  ]
    .filter((part) => part !== null && part !== "")
    .join(" · ");
}

function contactLine(settings: SettingsData): string {
  return [settings.contactEmail, settings.phone]
    .filter((part) => part !== null)
    .join(" · ");
}
