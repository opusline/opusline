import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import type { ThemePreference } from "@/lib/theme";
import { AppearanceSettings } from "./appearance-settings";

function AppearanceSettingsExample({ theme }: { theme: ThemePreference }) {
  const [chosen, setChosen] = useState(theme);

  return <AppearanceSettings onChange={setChosen} theme={chosen} />;
}

const meta = {
  title: "Web/AppearanceSettings",
  component: AppearanceSettings,
  tags: ["autodocs"],
  args: { theme: "system", onChange: () => {} },
} satisfies Meta<typeof AppearanceSettings>;

export default meta;
type Story = StoryObj<typeof AppearanceSettings>;

export const System: Story = {};

export const Light: Story = {
  args: { theme: "light" },
};

export const Interactive: Story = {
  render: (args) => <AppearanceSettingsExample theme={args.theme} />,
};
