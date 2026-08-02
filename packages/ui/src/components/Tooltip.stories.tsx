import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  tags: ["autodocs"],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline">Survoler</Button>} />
      <TooltipContent>Semaine 31 · 4,5 jours saisis</TooltipContent>
    </Tooltip>
  ),
};
