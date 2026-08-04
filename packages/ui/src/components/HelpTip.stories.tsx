import type { Meta, StoryObj } from "@storybook/react";
import { HelpTip } from "./help-tip";
import { Label } from "./label";

const meta = {
  title: "UI/HelpTip",
  component: HelpTip,
  tags: ["autodocs"],
} satisfies Meta<typeof HelpTip>;

export default meta;
type Story = StoryObj<typeof HelpTip>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-1.5">
      <Label className="text-foreground-3 text-sm">Arrondi des entrées</Label>
      <HelpTip label="Qu'est-ce que l'arrondi ?">
        Chaque temps saisi est arrondi à ce pas avant d'être valorisé. Exemple :
        avec un arrondi à 0,5 j, 3 h pointées comptent pour une demi-journée.
      </HelpTip>
    </div>
  ),
};
