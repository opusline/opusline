import type { Meta, StoryObj } from "@storybook/react";
import { ChevronDown, Plus } from "lucide-react";

import { Button } from "./button";
import { ButtonGroup, ButtonGroupSeparator } from "./button-group";

const meta = {
  title: "UI/ButtonGroup",
  component: ButtonGroup,
  tags: ["autodocs"],
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

/** A primary action with its menu of alternatives. */
export const SplitButton: Story = {
  render: () => (
    <ButtonGroup aria-label="Créer une facture">
      <Button size="xl">
        <Plus data-icon="inline-start" />
        Créer une facture
      </Button>
      <ButtonGroupSeparator />
      <Button aria-label="Autres façons d'ajouter" size="icon-xl">
        <ChevronDown />
      </Button>
    </ButtonGroup>
  ),
};

/** Outlined buttons share their borders, so no separator is needed. */
export const Outline: Story = {
  render: () => (
    <ButtonGroup aria-label="Période">
      <Button variant="outline">Précédente</Button>
      <Button variant="outline">Suivante</Button>
    </ButtonGroup>
  ),
};
