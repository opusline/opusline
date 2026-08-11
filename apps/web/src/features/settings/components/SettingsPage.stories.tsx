import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import type { ThemePreference } from "@/lib/theme";
import { settingsFixture } from "../lib/settings-fixture";
import type { SettingsTab } from "../lib/settings-form";
import { SettingsPage } from "./settings-page";

const meta = {
  title: "Web/SettingsPage",
  component: SettingsPage,
  tags: ["autodocs"],
  args: {
    settings: settingsFixture,
    activeTab: "identite",
    onTabChange: () => {},
    onSubmit: async () => ({ status: "success" }) as const,
    theme: "system",
    onThemeChange: () => {},
    signature: {
      src: "",
      isPending: false,
      error: null,
      onSave: () => {},
      onRemove: () => {},
    },
  },
} satisfies Meta<typeof SettingsPage>;

export default meta;
type Story = StoryObj<typeof SettingsPage>;

export const Identity: Story = {};

export const Fiscality: Story = {
  args: { activeTab: "fiscalite" },
};

export const VatLiable: Story = {
  args: {
    activeTab: "fiscalite",
    settings: { ...settingsFixture, vatRegime: 2, vatLiable: true },
  },
};

export const Billing: Story = {
  args: { activeTab: "facturation" },
};

/** Edit any field to raise the unsaved-changes bar. */
export const Browsable: Story = {
  render: (args) => {
    const [tab, setTab] = useState<SettingsTab>(args.activeTab);
    const [theme, setTheme] = useState<ThemePreference>(args.theme);

    return (
      <SettingsPage
        {...args}
        activeTab={tab}
        onTabChange={setTab}
        onThemeChange={setTheme}
        theme={theme}
      />
    );
  },
};
