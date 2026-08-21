import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { FormDateField } from "./form-date-field";
import type { StringFieldApi } from "./form-text-field";

function fieldApi(
  value: string,
  setValue: (next: string) => void,
  errors: string[],
): StringFieldApi {
  return {
    name: "startDate",
    state: {
      value,
      meta: {
        isTouched: true,
        isValid: errors.length === 0,
        errors: errors.map((message) => ({ message })),
      },
    },
    handleChange: setValue,
    handleBlur: () => {},
  };
}

function Example({ errors = [] }: { errors?: string[] }) {
  const [value, setValue] = useState("2026-08-21");

  return (
    <div className="w-72">
      <FormDateField
        field={fieldApi(value, setValue, errors)}
        label="Début"
        max="2026-12-31"
      />
    </div>
  );
}

const meta = {
  title: "Web/FormDateField",
  component: FormDateField,
  tags: ["autodocs"],
  args: {
    field: fieldApi("2026-08-21", () => {}, []),
    label: "Début",
  },
} satisfies Meta<typeof FormDateField>;

export default meta;
type Story = StoryObj<typeof FormDateField>;

export const Default: Story = {
  render: () => <Example />,
};

export const Invalid: Story = {
  render: () => <Example errors={["Renseignez une date."]} />,
};
