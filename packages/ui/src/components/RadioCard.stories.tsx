import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { RadioCard, RadioGroup } from "./radio-group";

const meta = {
  title: "UI/RadioCard",
  component: RadioCard,
  tags: ["autodocs"],
} satisfies Meta<typeof RadioCard>;

export default meta;
type Story = StoryObj<typeof RadioCard>;

export const Default: Story = {
  render: () => {
    const [regime, setRegime] = useState("0");

    return (
      <RadioGroup
        aria-label="Régime de TVA"
        className="max-w-140"
        onValueChange={(value) => setRegime(String(value))}
        value={regime}
      >
        <RadioCard
          description="Vos factures sont émises hors taxes, sans déclaration."
          title="Franchise en base"
          value="0"
        />
        <RadioCard
          description="TVA facturée aux clients et CA3 déclarée chaque mois."
          title="Assujetti à la TVA"
          value="1"
        />
      </RadioGroup>
    );
  },
};
