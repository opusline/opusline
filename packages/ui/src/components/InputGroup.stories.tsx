import type { Meta, StoryObj } from "@storybook/react";
import { InputGroup, InputGroupInput, InputGroupSuffix } from "./input-group";

const meta = {
  title: "UI/InputGroup",
  component: InputGroup,
  tags: ["autodocs"],
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof InputGroup>;

export const Default: Story = {
  render: () => (
    <InputGroup className="w-60">
      <InputGroupInput
        aria-label="Tarif HT"
        className="flex-1 text-base"
        defaultValue="550"
        inputMode="decimal"
      />
      <InputGroupSuffix className="pl-2">€ / jour</InputGroupSuffix>
    </InputGroup>
  ),
};

export const Small: Story = {
  render: () => (
    <InputGroup size="sm">
      <InputGroupInput
        aria-label="Délai en jours"
        className="w-13 text-sm"
        defaultValue="45"
        inputMode="numeric"
      />
      <InputGroupSuffix>jours</InputGroupSuffix>
    </InputGroup>
  ),
};

export const Invalid: Story = {
  render: () => (
    <InputGroup className="w-60">
      <InputGroupInput
        aria-invalid
        aria-label="Tarif HT"
        className="flex-1 text-base"
        placeholder="550"
      />
      <InputGroupSuffix className="pl-2">€ / jour</InputGroupSuffix>
    </InputGroup>
  ),
};

/** The field a panel leads with — a quick-entry line above a form. */
export const Brand: Story = {
  render: () => (
    <InputGroup className="w-80" tone="brand">
      <InputGroupInput placeholder="lunaprint 429 écran 20%" />
    </InputGroup>
  ),
};
