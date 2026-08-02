import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";

const meta = {
  title: "UI/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof DropdownMenu>;

export const Default: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">Thème</Button>} />
      <DropdownMenuContent align="start">
        <DropdownMenuItem>Clair</DropdownMenuItem>
        <DropdownMenuItem>Sombre</DropdownMenuItem>
        <DropdownMenuItem>Système</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
