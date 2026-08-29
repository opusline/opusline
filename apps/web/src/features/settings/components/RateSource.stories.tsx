import type { SettingsData } from "@opusline/api-client";
import type { Meta, StoryObj } from "@storybook/react";

import { settingsFixture } from "../lib/settings-fixture";
import { SettingsFormStory } from "../lib/settings-form-story";
import { RateSource } from "./rate-source";

function Example({
  settings = settingsFixture,
  savedAcre = settings.acre,
  isRefreshing = false,
  refreshError = null,
}: {
  settings?: SettingsData;
  savedAcre?: boolean;
  isRefreshing?: boolean;
  refreshError?: string | null;
}) {
  return (
    <SettingsFormStory settings={settings}>
      {(form) => (
        <RateSource
          form={form}
          isBackgroundRefresh={false}
          isRefreshing={isRefreshing}
          onRefresh={() => {}}
          ratesCheckedAt={settings.ratesCheckedAt}
          ratesYear={settings.ratesYear}
          refreshError={refreshError}
          savedAcre={savedAcre}
          savedBusinessStartedOn={settings.businessStartedOn}
        />
      )}
    </SettingsFormStory>
  );
}

const meta = {
  title: "Web/RateSource",
  component: RateSource,
  tags: ["autodocs"],
} satisfies Meta<typeof RateSource>;

export default meta;
type Story = StoryObj<typeof RateSource>;

export const Default: Story = {
  render: () => <Example />,
};

export const NeverChecked: Story = {
  render: () => (
    <Example
      settings={{ ...settingsFixture, ratesCheckedAt: null, ratesYear: null }}
    />
  ),
};

export const Refreshing: Story = {
  render: () => <Example isRefreshing />,
};

export const RefreshError: Story = {
  render: () => (
    <Example refreshError="La lecture du barème a échoué. Réessayez plus tard." />
  ),
};

export const RefreshHeldWhileUnsaved: Story = {
  render: () => <Example savedAcre={!settingsFixture.acre} />,
};

export const ManualRates: Story = {
  render: () => <Example settings={{ ...settingsFixture, autoRates: false }} />,
};
