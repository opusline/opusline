import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { type VatChoice, vatChoiceTerms } from "../lib/vat";
import { VatChoiceField } from "./vat-choice-field";

function Controlled({ initial }: { initial: VatChoice | null }) {
  const [value, setValue] = useState<VatChoice | null>(initial);

  return (
    <VatChoiceField
      keptTerms={
        initial === null
          ? { vatTreatment: 0, vatRateBp: 210 }
          : vatChoiceTerms(initial)
      }
      onChange={setValue}
      value={value}
    />
  );
}

const meta = {
  title: "Web/Expenses/VatChoiceField",
  component: VatChoiceField,
  tags: ["autodocs"],
  args: {
    value: "fr20",
    keptTerms: vatChoiceTerms("fr20"),
    onChange: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-105">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof VatChoiceField>;

export default meta;
type Story = StoryObj<typeof VatChoiceField>;

/** Six chips; the sentence under them explains the picked one and what the invoice shows. */
export const Default: Story = { render: () => <Controlled initial="fr20" /> };

export const ReverseChargeEu: Story = {
  render: () => <Controlled initial="eu" />,
};

/** A stored rate no chip covers: nothing pressed, the kept rate named under the chips. */
export const KeptRate: Story = { render: () => <Controlled initial={null} /> };
