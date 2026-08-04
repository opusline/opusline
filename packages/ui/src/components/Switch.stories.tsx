import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "./label";
import { Switch } from "./switch";

const meta = {
  title: "UI/Switch",
  component: Switch,
  tags: ["autodocs"],
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  args: {
    defaultChecked: true,
    "aria-label": "CRA mensuel requis",
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Switch defaultChecked id="cra" />
      <div>
        <Label className="text-foreground-3 text-sm" htmlFor="cra">
          CRA mensuel requis
        </Label>
        <p className="mt-0.5 text-muted-foreground-3 text-xs">
          Exigé en fin de mois · export PDF pré-rempli.
        </p>
      </div>
    </div>
  ),
};
