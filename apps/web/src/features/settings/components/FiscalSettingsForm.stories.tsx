import type { SettingsData } from "@opusline/api-client";
import type { Meta, StoryObj } from "@storybook/react";

import {
  abroadSettingsFixture,
  nonEuSettingsFixture,
  settingsFixture,
} from "../lib/settings-fixture";
import { SettingsFormStory } from "../lib/settings-form-story";
import {
  DeadlineSettingsFields,
  FiscalAbroadPanel,
  FiscalSettingsForm,
} from "./fiscal-settings-form";

function Example({
  settings,
  savedAcre = settings.acre,
}: {
  settings: SettingsData;
  savedAcre?: boolean;
}) {
  return (
    <SettingsFormStory settings={settings}>
      {(form) => (
        <FiscalSettingsForm
          contributionRateBp={settings.contributionRateBp}
          effectiveContributionRateBp={settings.effectiveContributionRateBp}
          form={form}
          isBackgroundRefresh={false}
          isRefreshingRates={false}
          liberatingPaymentRateBp={settings.liberatingPaymentRateBp}
          onRefreshRates={() => {}}
          ratesCheckedAt={settings.ratesCheckedAt}
          ratesError={null}
          ratesYear={settings.ratesYear}
          savedAcre={savedAcre}
          savedBusinessStartedOn={settings.businessStartedOn}
        />
      )}
    </SettingsFormStory>
  );
}

const meta = {
  title: "Web/FiscalSettingsForm",
  component: FiscalSettingsForm,
  tags: ["autodocs"],
} satisfies Meta<typeof FiscalSettingsForm>;

export default meta;
type Story = StoryObj<typeof FiscalSettingsForm>;

export const FranchiseEnBase: Story = {
  render: () => <Example settings={settingsFixture} />,
};

export const WithLiberatingPayment: Story = {
  render: () => (
    <Example
      settings={{
        ...settingsFixture,
        liberatingPayment: true,
        effectiveContributionRateBp: 2820,
      }}
    />
  ),
};

export const UnsavedSituation: Story = {
  render: () => (
    <Example savedAcre={!settingsFixture.acre} settings={settingsFixture} />
  ),
};

export const QuarterlyAndVatLiable: Story = {
  render: () => (
    <Example
      settings={{
        ...settingsFixture,
        urssafPeriodicity: 1,
        vatRegime: 2,
        vatLiable: true,
      }}
    />
  ),
};

/** Abroad the tab explains itself and keeps only the tax rate — TVA in the EU. */
export const AbroadInsideEu: Story = {
  render: () => (
    <SettingsFormStory settings={abroadSettingsFixture}>
      {(form) => <FiscalAbroadPanel form={form} isEuVat={true} />}
    </SettingsFormStory>
  ),
};

/** Outside the EU the same panel names the rate a sales tax. */
export const AbroadOutsideEu: Story = {
  render: () => (
    <SettingsFormStory settings={nonEuSettingsFixture}>
      {(form) => <FiscalAbroadPanel form={form} isEuVat={false} />}
    </SettingsFormStory>
  ),
};

/** The one figure the calendar cannot derive: the commune's CFE, as an override. */
export const DeadlineFields: Story = {
  render: () => (
    <SettingsFormStory settings={settingsFixture}>
      {(form) => <DeadlineSettingsFields form={form} />}
    </SettingsFormStory>
  ),
};
