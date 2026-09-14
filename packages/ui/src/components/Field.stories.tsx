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

/**
 * The label is the same role everywhere, drawn at the weight the surrounding
 * form asks for: a creation page leads with `strong`, a dense edit sheet drops
 * to `quiet` at `sm`.
 */
export const LabelTones: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Field className="max-w-sm">
        <FieldLabel htmlFor="field-tone-default">Par défaut</FieldLabel>
        <Input id="field-tone-default" />
      </Field>
      <Field className="max-w-sm">
        <FieldLabel htmlFor="field-tone-strong" tone="strong">
          Raison sociale
        </FieldLabel>
        <Input id="field-tone-strong" />
      </Field>
      <Field className="max-w-sm">
        <FieldLabel htmlFor="field-tone-muted" size="sm" tone="muted">
          Fuseau horaire
        </FieldLabel>
        <Input id="field-tone-muted" />
      </Field>
      <Field className="max-w-sm">
        <FieldLabel htmlFor="field-tone-quiet" size="sm" tone="quiet">
          TJM
        </FieldLabel>
        <Input id="field-tone-quiet" />
      </Field>
    </div>
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
