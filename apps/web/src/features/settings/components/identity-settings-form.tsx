import type { VatRegime } from "@opusline/api-client";
import { Switch } from "@opusline/ui/components/switch";
import { House } from "lucide-react";

import { AddressFields } from "@/components/address-fields";
import { ExemptField } from "@/components/exempt-field";
import { FormTextField } from "@/components/form-text-field";
import { LogoPicker } from "@/components/logo-picker";
import {
  formatFrenchPhone,
  formatIban,
  formatSiret,
  formatVatNumber,
} from "@/lib/identifiers";
import { COMPANY_LOGO_RULES } from "@/lib/logos";
import { m } from "@/paraglide/messages.js";
import {
  COMPANY_ADDRESS_NAMES,
  HOME_ADDRESS_NAMES,
} from "../lib/settings-form";
import type { SettingsForm } from "../lib/use-settings-form";
import { SettingsSection } from "./settings-section";

const EYEBROW =
  "font-medium text-muted-foreground-2 text-xs uppercase tracking-wider-2";
const LABEL = "text-muted-foreground-2 text-xs";

/** The logo uploads on its own, the moment it is picked, outside the form's save. */
export type CompanyLogoSlot = {
  /** Set only while a logo is stored, so an empty slot shows its placeholder. */
  src?: string;
  isPending: boolean;
  error: string | null;
  onPick: (logo: File) => void;
  onRemove: () => void;
};

export function IdentitySettingsForm({
  form,
  hasFrenchFiscality,
  showEuVatNumber,
  logo,
}: {
  form: SettingsForm;
  logo: CompanyLogoSlot;
  /** The auto-entrepreneur status and the SIRET only exist in France. */
  hasFrenchFiscality: boolean;
  /** The intra-community VAT number only exists inside the EU. */
  showEuVatNumber: boolean;
}) {
  return (
    <SettingsSection
      description={m.settings_identity_description()}
      title={m.settings_identity_title()}
    >
      {hasFrenchFiscality && (
        <div className="mb-5 flex items-center gap-3 rounded-md border bg-muted px-3.5 py-3">
          <span className="flex size-7.5 shrink-0 items-center justify-center rounded-md bg-primary/15">
            <House aria-hidden className="size-3.75 text-primary-text" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-foreground-hi text-sm">
              {m.settings_auto_entrepreneur()}
            </span>
            <span className="mt-0.5 block text-muted-foreground-3 text-xs">
              {m.settings_auto_entrepreneur_hint()}
            </span>
          </span>
        </div>
      )}

      <div className="mb-5 flex flex-wrap items-center gap-4">
        <LogoPicker
          error={logo.error}
          isPending={logo.isPending}
          label={m.settings_logo_input_aria()}
          onPick={logo.onPick}
          onRemove={logo.onRemove}
          placeholder={m.settings_logo_pick()}
          removeLabel={m.settings_logo_remove_aria()}
          rules={COMPANY_LOGO_RULES}
          size="sm"
          src={logo.src}
          testId="settings-logo"
        />
        <span className="min-w-40 flex-1">
          <span className="block text-foreground-hi text-sm">
            {m.settings_logo_title()}
          </span>
          <span className="mt-0.5 block text-muted-foreground-3 text-xs">
            {m.settings_logo_hint()}
          </span>
        </span>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field name="tradeName">
          {(field) => (
            <FormTextField
              field={field}
              label={m.settings_trade_name_label()}
              labelClassName={LABEL}
              placeholder={m.settings_trade_name_placeholder()}
              testId="settings-trade-name"
            />
          )}
        </form.Field>

        {hasFrenchFiscality && (
          <form.Field name="siret">
            {(field) => (
              <FormTextField
                field={field}
                font="mono"
                formatOnBlur={formatSiret}
                inputMode="numeric"
                label="SIRET"
                labelClassName={LABEL}
                placeholder="000 000 000 00000"
              />
            )}
          </form.Field>
        )}

        {showEuVatNumber && (
          <form.Subscribe<VatRegime>
            selector={(state) => state.values.vatRegime}
          >
            {(vatRegime) =>
              vatRegime === 0 ? (
                <ExemptField
                  label={m.settings_eu_vat_label()}
                  labelClassName={LABEL}
                  reason={m.settings_eu_vat_exempt()}
                />
              ) : (
                <form.Field name="vatNumber">
                  {(field) => (
                    <FormTextField
                      field={field}
                      font="mono"
                      formatOnBlur={formatVatNumber}
                      label={m.settings_eu_vat_label()}
                      labelClassName={LABEL}
                      placeholder="FR00 000000000"
                    />
                  )}
                </form.Field>
              )
            }
          </form.Subscribe>
        )}

        <form.Field name="signatureCity">
          {(field) => (
            <FormTextField
              field={field}
              label={m.settings_signature_city_label()}
              labelClassName={LABEL}
              placeholder={m.address_city()}
            />
          )}
        </form.Field>

        <form.Field name="contactEmail">
          {(field) => (
            <FormTextField
              field={field}
              label="Email"
              labelClassName={LABEL}
              placeholder={m.settings_email_placeholder()}
              type="email"
            />
          )}
        </form.Field>

        <form.Field name="phone">
          {(field) => (
            <FormTextField
              field={field}
              formatOnBlur={hasFrenchFiscality ? formatFrenchPhone : undefined}
              label={m.settings_phone_label()}
              labelClassName={LABEL}
              placeholder="00 00 00 00 00"
              type="tel"
            />
          )}
        </form.Field>

        {hasFrenchFiscality && (
          <form.Field name="tradeRegistry">
            {(field) => (
              <FormTextField
                field={field}
                description={m.settings_trade_registry_hint()}
                label={m.settings_trade_registry_label()}
                labelClassName={LABEL}
                placeholder="RCS Lyon 000 000 000"
              />
            )}
          </form.Field>
        )}
      </div>

      <div className="mt-6.5 mb-3 flex items-baseline justify-between gap-3">
        <span className={EYEBROW}>{m.settings_company_address_title()}</span>
        <span className="text-muted-foreground-3 text-xs">
          {m.settings_company_address_hint()}
        </span>
      </div>
      <AddressFields
        complementLabel={m.address_complement_label()}
        gapClassName="gap-4"
        labelClassName={LABEL}
        names={COMPANY_ADDRESS_NAMES}
        renderField={(name, render) => (
          <form.Field name={name}>{(field) => render(field)}</form.Field>
        )}
        setFieldValue={(name, value) => form.setFieldValue(name, value)}
        streetLabel={m.address_label()}
        withPlaceholders
      />

      <div className="mt-6.5 mb-3 flex items-baseline justify-between gap-3">
        <span className={EYEBROW}>{m.settings_bank_title()}</span>
        <span className="text-muted-foreground-3 text-xs">
          {m.settings_bank_hint()}
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="sm:col-span-2">
          <form.Field name="iban">
            {(field) => (
              <FormTextField
                field={field}
                font="mono"
                formatOnBlur={formatIban}
                label="IBAN"
                labelClassName={LABEL}
                placeholder="FR76 0000 0000 0000 0000 0000 000"
                testId="settings-iban"
              />
            )}
          </form.Field>
        </div>
        <form.Field name="bic">
          {(field) => (
            <FormTextField
              field={field}
              font="mono"
              formatOnBlur={(value) => value.trim().toUpperCase()}
              label="BIC"
              labelClassName={LABEL}
              placeholder="AAAAFRPP"
              testId="settings-bic"
            />
          )}
        </form.Field>
      </div>

      <div className="mt-6.5 mb-3 flex items-baseline justify-between gap-3">
        <span className={EYEBROW}>{m.settings_home_address_title()}</span>
        <form.Field name="homeAddressSameAsCompany">
          {(field) => (
            // biome-ignore lint/a11y/noLabelWithoutControl: Base UI's Switch renders a hidden input beside its span, so the wrapping label is its control
            <label className="flex cursor-pointer items-center gap-2 text-muted-foreground-3 text-xs">
              <Switch
                checked={field.state.value}
                onCheckedChange={field.handleChange}
              />
              {m.settings_home_same_label()}
            </label>
          )}
        </form.Field>
      </div>

      <form.Subscribe<boolean>
        selector={(state) => state.values.homeAddressSameAsCompany}
      >
        {(isSame) =>
          isSame ? (
            <div className="rounded-md border bg-muted px-3.5 py-3 text-muted-foreground-3 text-sm leading-relaxed">
              {m.settings_home_same_note()}
            </div>
          ) : (
            <>
              <AddressFields
                complementLabel={m.address_complement_label()}
                gapClassName="gap-4"
                labelClassName={LABEL}
                names={HOME_ADDRESS_NAMES}
                renderField={(name, render) => (
                  <form.Field name={name}>
                    {(field) => render(field)}
                  </form.Field>
                )}
                setFieldValue={(name, value) => form.setFieldValue(name, value)}
                streetLabel={m.address_label()}
                withPlaceholders
              />
              <p className="mt-2.5 text-muted-foreground-3 text-xs leading-relaxed">
                {m.settings_home_address_hint()}
              </p>
            </>
          )
        }
      </form.Subscribe>

      <form.Subscribe<string> selector={(state) => state.values.signatureCity}>
        {(city) => (
          <p className="mt-4.5 text-muted-foreground-3 text-xs">
            {m.settings_made_at_note({
              city: city.trim() === "" ? "…" : city,
            })}
          </p>
        )}
      </form.Subscribe>
    </SettingsSection>
  );
}
