import type { Currency, DateFormat, Locale } from "@opusline/api-client";
import { zCurrency, zDateFormat, zLocale } from "@opusline/api-client/zod";
import { Button } from "@opusline/ui/components/button";
import { Chip, ChipGroup } from "@opusline/ui/components/chip";
import { Field, FieldLabel } from "@opusline/ui/components/field";
import { NativeSelect } from "@opusline/ui/components/native-select";
import { useEffect, useState } from "react";

import { formatAmountWithCents } from "@/lib/billing";
import { COUNTRY_OPTIONS } from "@/lib/countries";
import { calendarDateNumericLabel } from "@/lib/dates";
import { unsavedChangesLabel } from "../lib/settings-form";
import { SaveBar } from "./save-bar";
import { SettingsSection } from "./settings-section";

const currencyNames = new Intl.DisplayNames(["fr"], { type: "currency" });

const CURRENCY_OPTIONS = zCurrency.options.map((code) => ({
  code,
  label: `${code} · ${currencyNames.of(code) ?? code}`,
}));

const LOCALE_LABELS: Record<Locale, string> = {
  "fr-FR": "Français",
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
};

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
    ? "La France est le seul pays dont les règles fiscales sont implémentées : régime auto-entrepreneur, SIRET, cotisations URSSAF et TVA française."
    : "Le suivi du temps, les clients et les factures fonctionnent normalement. En revanche les règles fiscales de ce pays ne sont pas encore implémentées : cotisations, TVA et numéro d'immatriculation restent à saisir à la main.";
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
  const { businessCountry, currency, locale, dateFormat } = saved;

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

  const changes = (Object.keys(draft) as (keyof LocalisationDraft)[]).filter(
    (key) => draft[key] !== saved[key],
  ).length;

  return (
    <>
      <SettingsSection
        description="Pays d'exercice, monnaie dans laquelle Opusline compte votre activité, et langue de l'interface."
        title="Localisation"
      >
        <Field>
          <FieldLabel className={LABEL} htmlFor="localisation-country">
            Pays d'exercice
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
            {COUNTRY_OPTIONS.map((country) => (
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
            Devise de l'activité
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
              {CURRENCY_OPTIONS.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.label}
                </option>
              ))}
            </NativeSelect>
            <span className="font-mono text-muted-foreground-3 text-xs tabular-nums">
              Exemple :{" "}
              {formatAmountWithCents(
                { locale: draft.locale, currency: draft.currency },
                165_000,
              )}
            </span>
          </div>
          <p className={NOTE}>
            {currencyLocked
              ? "Fixée : une mission tarifée ou une facture existe déjà dans cette devise."
              : "Tous les montants de l'application sont comptés et affichés dans cette devise : revenus, factures, matelas de trésorerie, provisions. Elle devient définitive à la première mission tarifée ou facture."}
          </p>
        </Field>

        <div className="my-5.5 h-px bg-secondary" />

        <Field>
          <FieldLabel className={LABEL} htmlFor="localisation-lang">
            Langue de l'interface
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
          <p className={NOTE}>
            Détermine le format des montants et des nombres. La traduction
            complète de l'interface et des CRA arrivera plus tard — les libellés
            restent en français.
          </p>
        </Field>

        <div className="my-5.5 h-px bg-secondary" />

        <Field>
          <FieldLabel className={LABEL} htmlFor="localisation-date-format">
            Format des dates
          </FieldLabel>
          <ChipGroup
            aria-label="Format des dates"
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
            {isSaving ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </SaveBar>
      )}
    </>
  );
}
