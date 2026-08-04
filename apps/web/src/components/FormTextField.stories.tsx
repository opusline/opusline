import type { Meta, StoryObj } from "@storybook/react";
import { FormTextField, type StringFieldApi } from "./form-text-field";

function stubField(value: string, error?: string): StringFieldApi {
  return {
    name: "demo",
    state: {
      value,
      meta: {
        isTouched: error !== undefined,
        isValid: error === undefined,
        errors: error === undefined ? [] : [{ message: error }],
      },
    },
    handleChange: () => {},
    handleBlur: () => {},
  };
}

const meta = {
  title: "Web/FormTextField",
  component: FormTextField,
  tags: ["autodocs"],
} satisfies Meta<typeof FormTextField>;

export default meta;
type Story = StoryObj<typeof FormTextField>;

export const Default: Story = {
  args: {
    field: stubField("Nordlys"),
    label: "Raison sociale",
    labelClassName: "text-foreground-3",
  },
};

export const Mono: Story = {
  args: {
    field: stubField("123 456 789 00012"),
    label: "SIRET",
    labelClassName: "text-foreground-3",
    font: "mono",
  },
};

export const WithError: Story = {
  args: {
    field: stubField("Nordlys", "Ce nom est déjà utilisé."),
    label: "Raison sociale",
    labelClassName: "text-foreground-3",
  },
};

export const Multiline: Story = {
  args: {
    field: stubField("12 rue de la Paix\n44000 Nantes"),
    label: "Adresse de facturation",
    labelClassName: "text-foreground-3",
    multiline: true,
  },
};
