import type { Meta, StoryObj } from "@storybook/react";

import type { StringFieldApi } from "@/components/form-text-field";
import { BillingAddressFields } from "./billing-address-fields";

function stubField(name: string, value: string): StringFieldApi {
  return {
    name,
    state: { value, meta: { isTouched: false, isValid: true, errors: [] } },
    handleChange: () => {},
    handleBlur: () => {},
  };
}

const meta = {
  title: "Web/BillingAddressFields",
  component: BillingAddressFields,
  tags: ["autodocs"],
  args: {
    complementLabel: "Complément d'adresse",
    gapClassName: "gap-4",
    labelClassName: "text-foreground-3",
    setFieldValue: () => {},
    streetLabel: "Adresse de facturation",
    renderField: (name, render) => render(stubField(name, "")),
  },
} satisfies Meta<typeof BillingAddressFields>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = { args: { withPlaceholders: true } };

export const Filled: Story = {
  args: {
    complementLabel: "Complément",
    gapClassName: "gap-3.5",
    streetLabel: "Adresse",
    renderField: (name, render) =>
      render(
        stubField(
          name,
          {
            billingAddressLine1: "12 rue de la Paix",
            billingAddressLine2: "Bâtiment C",
            billingPostalCode: "44000",
            billingCity: "Nantes",
            billingCountry: "France",
          }[name] ?? "",
        ),
      ),
  },
};
