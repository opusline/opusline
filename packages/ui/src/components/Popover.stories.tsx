import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { Input } from "./input";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "./popover";

const meta = {
  title: "UI/Popover",
  component: Popover,
  tags: ["autodocs"],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" size="xl" />}>
        Activité
      </PopoverTrigger>
      <PopoverContent>
        <PopoverTitle>Activité</PopoverTitle>
        <Input
          aria-label="Activité"
          className="mt-2"
          placeholder="Revue PR, cadrage…"
          size="sm"
          type="text"
        />
        <div className="mt-2.5 flex justify-end">
          <PopoverClose render={<Button variant="outline" size="lg" />}>
            OK
          </PopoverClose>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" size="xl" />}>
        Détails
      </PopoverTrigger>
      <PopoverContent align="start">
        <PopoverTitle>Mardi 28 juillet</PopoverTitle>
        <PopoverDescription className="mt-1.5">
          Deux entrées sur cette mission, éditables séparément.
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  ),
};

export const RaisedSurface: Story = {
  render: () => (
    <Popover open>
      <PopoverTrigger render={<Button variant="outline">Détails</Button>} />
      <PopoverContent surface="raised">
        <PopoverTitle>Suivi en cours</PopoverTitle>
        <PopoverDescription>
          Repose sur la surface carte plutôt que sur le fond popover.
        </PopoverDescription>
      </PopoverContent>
    </Popover>
  ),
};
