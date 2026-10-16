import type { SettingsData } from "@opusline/api-client";
import type { Meta, StoryObj } from "@storybook/react";

import { hasEuVat } from "@/lib/countries";
import type { CompanyLogoSlot } from "@/lib/logos";
import {
  abroadSettingsFixture,
  nonEuSettingsFixture,
  settingsFixture,
} from "@/test/settings-fixture";
import { SettingsFormStory } from "../lib/settings-form-story";
import { IdentitySettingsForm } from "./identity-settings-form";

const EMPTY_LOGO: CompanyLogoSlot = {
  isPending: false,
  error: null,
  onPick: () => {},
  onRemove: () => {},
};

const LOGO_SVG = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40"><rect width="120" height="40" rx="6" fill="#BA7517"/><text x="60" y="26" font-family="sans-serif" font-size="16" fill="#fff" text-anchor="middle">TM</text></svg>',
)}`;

function Example({
  settings,
  logo = EMPTY_LOGO,
}: {
  settings: SettingsData;
  logo?: CompanyLogoSlot;
}) {
  return (
    <SettingsFormStory settings={settings}>
      {(form) => (
        <IdentitySettingsForm
          form={form}
          hasFrenchFiscality={settings.hasFrenchFiscality}
          logo={logo}
          showEuVatNumber={hasEuVat(settings.businessCountry)}
        />
      )}
    </SettingsFormStory>
  );
}

const meta = {
  title: "Web/IdentitySettingsForm",
  component: IdentitySettingsForm,
  tags: ["autodocs"],
} satisfies Meta<typeof IdentitySettingsForm>;

export default meta;
type Story = StoryObj<typeof IdentitySettingsForm>;

export const Empty: Story = {
  render: () => (
    <Example
      settings={{
        ...settingsFixture,
        tradeName: null,
        siret: null,
        signatureCity: null,
        contactEmail: null,
        phone: null,
        companyAddressLine1: null,
        companyPostalCode: null,
        companyCity: null,
        iban: null,
        bic: null,
      }}
    />
  ),
};

export const Filled: Story = {
  render: () => <Example settings={settingsFixture} />,
};

export const VatLiable: Story = {
  render: () => (
    <Example
      settings={{
        ...settingsFixture,
        vatRegime: 2,
        vatLiable: true,
        vatNumber: "FR62 892447118",
      }}
    />
  ),
};

/** Abroad, the auto-entrepreneur status and the SIRET disappear. */
export const EstablishedAbroad: Story = {
  render: () => <Example settings={abroadSettingsFixture} />,
};

/** Outside the EU, the intra-community VAT number disappears too. */
export const EstablishedOutsideEu: Story = {
  render: () => <Example settings={nonEuSettingsFixture} />,
};

export const SeparateHomeAddress: Story = {
  render: () => (
    <Example
      settings={{ ...settingsFixture, homeAddressSameAsCompany: false }}
    />
  ),
};

/** The logo is stored, and the RCS of a commerçant is filled in. */
export const WithLogo: Story = {
  render: () => (
    <Example
      logo={{ ...EMPTY_LOGO, src: LOGO_SVG }}
      settings={{
        ...settingsFixture,
        hasLogo: true,
        tradeRegistry: "RCS Nantes 123 456 782",
      }}
    />
  ),
};

export const LogoRejected: Story = {
  render: () => (
    <Example
      logo={{ ...EMPTY_LOGO, error: "PNG, JPG ou SVG uniquement" }}
      settings={settingsFixture}
    />
  ),
};
