import type { Currency, DateFormat, Locale } from "@opusline/api-client";
import { zCurrency, zDateFormat, zLocale } from "@opusline/api-client/zod";
import { Button } from "@opusline/ui/components/button";
import { Chip, ChipGroup } from "@opusline/ui/components/chip";
import { Field, FieldLabel } from "@opusline/ui/components/field";
import { NativeSelect } from "@opusline/ui/components/native-select";
import { useEffect, useMemo, useState } from "react";

import { formatAmountWithCents } from "@/lib/billing";
import { countryOptions } from "@/lib/countries";
import { calendarDateNumericLabel } from "@/lib/dates";
import { m } from "@/paraglide/messages.js";
import { unsavedChangesLabel } from "../lib/settings-form";
import { SaveBar } from "./save-bar";
import { SettingsSection } from "./settings-section";

type CurrencyOption = { code: Currency; label: string };

function buildCurrencyOptions(locale: Locale): CurrencyOption[] {
  const currencyNames = new Intl.DisplayNames([locale], { type: "currency" });

  return zCurrency.options.map((code) => ({
    code,
    label: `${code} · ${currencyNames.of(code) ?? code}`,
  }));
}

const LOCALE_LABELS: Record<Locale, string> = {
  "fr-FR": "Français", // i18n-ignore
  "en-US": "English",
};

const DATE_FORMATS: DateFormat[] = [0, 1];
const DATE_SAMPLE = "2026-08-31";

const LABEL = "text-foreground-3 text-sm";
const NOTE = "mt-2.5 text-muted-foreground-3 text-xs leading-relaxed";

export type LocalisationDraft = {
  businessCountry: string;
  currency: Currency;
  locale: Locale;
  dateFormat: DateFormat;
  timezone: string;
};

const TIMEZONES = Intl.supportedValuesOf("timeZone");

function timezoneOptions(saved: string): string[] {
  return TIMEZONES.includes(saved) ? TIMEZONES : [saved, ...TIMEZONES];
}

type LocalisationSettingsProps = {
  saved: LocalisationDraft;
  currencyLocked: boolean;
  isSaving: boolean;
  error: string | null;
  onSave: (draft: LocalisationDraft) => void;
  onCancel: () => void;
};

function countryNote(country: string): string {
  return country === "FR"
    ? m.settings_country_note_france()
    : m.settings_country_note_abroad();
}

/**
 * Country, currency, language and date format share one draft and one save,
 * the way the design draws them — unlike the page form, whose fields save
 * through the bulk settings payload.
 */
export function LocalisationSettings({
  saved,
  currencyLocked,
  isSaving,
  error,
  onSave,
  onCancel,
}: LocalisationSettingsProps) {
  const [draft, setDraft] = useState<LocalisationDraft>(saved);
  const { businessCountry, currency, locale, dateFormat, timezone } = saved;
  const currencyOptions = useMemo(() => buildCurrencyOptions(locale), [locale]);
  const zones = useMemo(() => timezoneOptions(timezone), [timezone]);

  // Re-seed field by field on value-stable deps: a save echo or an outside
  // change resets the draft, while an unrelated refetch leaves typing alone.
  useEffect(() => {
    setDraft((current) => ({ ...current, businessCountry }));
  }, [businessCountry]);
  useEffect(() => {
    setDraft((current) => ({ ...current, currency }));
  }, [currency]);
  useEffect(() => {
    setDraft((current) => ({ ...current, locale }));
  }, [locale]);
  useEffect(() => {
    setDraft((current) => ({ ...current, dateFormat }));
  }, [dateFormat]);
  useEffect(() => {
    setDraft((current) => ({ ...current, timezone }));
  }, [timezone]);

  const changes = (Object.keys(draft) as (keyof LocalisationDraft)[]).filter(
    (key) => draft[key] !== saved[key],
  ).length;

  return (
    <>
      <SettingsSection
        description={m.settings_regional_description()}
        title={m.settings_tab_regional_label()}
      >
        <Field>
          <FieldLabel className={LABEL} htmlFor="localisation-country">
            {m.settings_country_label()}
          </FieldLabel>
          <NativeSelect
            className="w-70"
            id="localisation-country"
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                businessCountry: event.target.value,
              }))
            }
            value={draft.businessCountry}
          >
            {countryOptions(locale).map((country) => (
              <option key={country.id} value={country.id}>
                {country.label}
              </option>
            ))}
          </NativeSelect>
          <p className={NOTE}>{countryNote(draft.businessCountry)}</p>
        </Field>

        <div className="my-5.5 h-px bg-secondary" />

        <Field>
          <FieldLabel className={LABEL} htmlFor="localisation-currency">
            {m.settings_currency_label()}
          </FieldLabel>
          <div className="flex flex-wrap items-center gap-3">
            <NativeSelect
              className="w-70"
              disabled={currencyLocked}
              id="localisation-currency"
              onChange={(event) => {
                const next = zCurrency.safeParse(event.target.value);

                if (next.success) {
                  setDraft((current) => ({ ...current, currency: next.data }));
                }
              }}
              value={draft.currency}
            >
              {currencyOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </NativeSelect>
            <span className="font-mono text-muted-foreground-3 text-xs tabular-nums">
              {m.settings_currency_example()}{" "}
              {formatAmountWithCents(
                { locale: draft.locale, currency: draft.currency },
                165_000,
              )}
            </span>
          </div>
          <p className={NOTE}>
            {currencyLocked
              ? m.settings_currency_locked()
              : m.settings_currency_hint()}
          </p>
        </Field>

        <div className="my-5.5 h-px bg-secondary" />

        <Field>
          <FieldLabel className={LABEL} htmlFor="localisation-lang">
            {m.settings_interface_language_label()}
          </FieldLabel>
          <NativeSelect
            className="w-70"
            id="localisation-lang"
            onChange={(event) => {
              const next = zLocale.safeParse(event.target.value);

              if (next.success) {
                setDraft((current) => ({ ...current, locale: next.data }));
              }
            }}
            value={draft.locale}
          >
            {zLocale.options.map((option) => (
              <option key={option} value={option}>
                {LOCALE_LABELS[option]}
              </option>
            ))}
          </NativeSelect>
          <p className={NOTE}>{m.settings_language_hint()}</p>
        </Field>

        <div className="my-5.5 h-px bg-secondary" />

        <Field>
          <FieldLabel className={LABEL} htmlFor="localisation-timezone">
            {m.settings_timezone_label()}
          </FieldLabel>
          <NativeSelect
            className="w-70"
            id="localisation-timezone"
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                timezone: event.target.value,
              }))
            }
            value={draft.timezone}
          >
            {zones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </NativeSelect>
          <p className={NOTE}>{m.settings_timezone_hint()}</p>
        </Field>

        <div className="my-5.5 h-px bg-secondary" />

        <Field>
          <FieldLabel className={LABEL} htmlFor="localisation-date-format">
            {m.settings_date_format_label()}
          </FieldLabel>
          <ChipGroup
            aria-label={m.settings_date_format_label()}
            id="localisation-date-format"
            onValueChange={(value) => {
              const next = zDateFormat.safeParse(Number(value[0]));

              if (next.success) {
                setDraft((current) => ({
                  ...current,
                  dateFormat: next.data,
                }));
              }
            }}
            value={[String(draft.dateFormat)]}
          >
            {DATE_FORMATS.map((option) => (
              <Chip key={option} className="font-mono" value={String(option)}>
                {calendarDateNumericLabel(option, DATE_SAMPLE)}
              </Chip>
            ))}
          </ChipGroup>
        </Field>
      </SettingsSection>

      {error !== null && (
        <p className="mt-4 text-destructive text-xs" role="alert">
          {error}
        </p>
      )}

      {changes > 0 && (
        <SaveBar
          isSaving={isSaving}
          label={unsavedChangesLabel(changes)}
          onCancel={() => {
            setDraft(saved);
            onCancel();
          }}
        >
          <Button disabled={isSaving} onClick={() => onSave(draft)} size="xl">
            {isSaving ? m.common_saving() : m.common_save()}
          </Button>
        </SaveBar>
      )}
    </>
  );
}
