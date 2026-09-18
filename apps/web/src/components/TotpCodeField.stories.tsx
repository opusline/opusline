import { Field, FieldLabel } from "@opusline/ui/components/field";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { TotpCodeField } from "./totp-code-field";

function Example(props: {
  disabled?: boolean;
  invalid?: boolean;
  size?: "default" | "lg";
}) {
  const [value, setValue] = useState("");

  return (
    <Field data-invalid={props.invalid ?? false}>
      <FieldLabel htmlFor="code">Code à six chiffres</FieldLabel>
      <TotpCodeField
        disabled={props.disabled ?? false}
        id="code"
        invalid={props.invalid ?? false}
        onChange={setValue}
        onComplete={() => {}}
        size={props.size}
        value={value}
      />
    </Field>
  );
}

const meta = {
  title: "Web/TotpCodeField",
  component: Example,
  tags: ["autodocs"],
} satisfies Meta<typeof Example>;

export default meta;
type Story = StoryObj<typeof Example>;

export const Default: Story = {};

export const Invalid: Story = {
  args: { invalid: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/** As the sign-in challenge shows it: the code is the screen's only field. */
export const Large: Story = {
  args: { size: "lg" },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
};
