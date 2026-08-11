import type { Meta, StoryObj } from "@storybook/react";

import { SettingsSection } from "./settings-section";

const meta = {
  title: "Web/SettingsSection",
  component: SettingsSection,
  tags: ["autodocs"],
} satisfies Meta<typeof SettingsSection>;

export default meta;
type Story = StoryObj<typeof SettingsSection>;

export const Default: Story = {
  args: {
    title: "Fiscalité",
    description:
      "Ces valeurs pilotent les provisions et les échéances calculées par l'app.",
    children: (
      <div className="text-foreground-3 text-sm">Champs du panneau</div>
    ),
  },
};
