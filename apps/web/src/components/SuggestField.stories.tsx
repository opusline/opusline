import type { Meta, StoryObj } from "@storybook/react";

import { searchAddresses } from "@/lib/addresses";
import { SuggestField } from "./suggest-field";

const meta = {
  title: "Web/SuggestField",
  component: SuggestField,
  tags: ["autodocs"],
  args: {
    label: "Adresse de facturation",
    placeholder: "12 rue de la Paix",
    onSearch: searchAddresses,
    onSelect: () => {},
    field: {
      name: "billingAddressLine1",
      state: {
        value: "",
        meta: { isTouched: false, isValid: true, errors: [] },
      },
      handleChange: () => {},
      handleBlur: () => {},
    },
  },
} satisfies Meta<typeof SuggestField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Invalid: Story = {
  args: {
    field: {
      name: "billingAddressLine1",
      state: {
        value: "12 rue",
        meta: {
          isTouched: true,
          isValid: false,
          errors: [{ message: "Adresse incomplète." }],
        },
      },
      handleChange: () => {},
      handleBlur: () => {},
    },
  },
};
