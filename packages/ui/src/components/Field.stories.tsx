import type { Meta, StoryObj } from "@storybook/react";
import { Field, FieldDescription, FieldError, FieldLabel } from "./field";
import { Input } from "./input";

const meta = {
  title: "UI/Field",
  component: Field,
  tags: ["autodocs"],
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof Field>;

export const Default: Story = {
  render: () => (
    <Field className="max-w-sm">
      <FieldLabel htmlFor="field-email">Adresse e-mail</FieldLabel>
      <Input id="field-email" type="email" />
      <FieldDescription>
        Utilisée pour la connexion et les rappels d'échéances.
      </FieldDescription>
    </Field>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Field className="max-w-sm" data-invalid>
      <FieldLabel htmlFor="field-invalid">Adresse e-mail</FieldLabel>
      <Input aria-invalid defaultValue="pas-un-email" id="field-invalid" />
      <FieldError errors={[{ message: "Adresse e-mail invalide." }]} />
    </Field>
  ),
};
