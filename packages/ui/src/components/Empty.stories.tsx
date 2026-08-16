import type { Meta, StoryObj } from "@storybook/react";
import { FolderOpenIcon } from "lucide-react";
import { Button } from "./button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./empty";

const meta = {
  title: "UI/Empty",
  component: Empty,
  tags: ["autodocs"],
} satisfies Meta<typeof Empty>;

export default meta;
type Story = StoryObj<typeof Empty>;

export const Default: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderOpenIcon />
        </EmptyMedia>
        <EmptyTitle>Aucun document</EmptyTitle>
        <EmptyDescription>
          Glissez un document ici, ou cliquez pour parcourir.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline">Parcourir</Button>
      </EmptyContent>
    </Empty>
  ),
};

export const StrongTitle: Story = {
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderOpenIcon />
        </EmptyMedia>
        <EmptyTitle variant="strong">Tout est rapproché</EmptyTitle>
        <EmptyDescription>
          Le titre appuyé, pour les états vides qui occupent un panneau entier.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  ),
};
