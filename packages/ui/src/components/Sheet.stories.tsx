import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

const meta = {
  title: "UI/Sheet",
  component: Sheet,
  tags: ["autodocs"],
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof Sheet>;

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Ouvrir</Button>} />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Détail de la mission</SheetTitle>
          <SheetDescription>
            Panneau latéral pour l'édition rapide.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};
