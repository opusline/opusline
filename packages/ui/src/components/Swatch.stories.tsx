import type { Meta, StoryObj } from "@storybook/react";
import { Swatch, SwatchGroup } from "./swatch";

const meta = {
  title: "UI/Swatch",
  component: Swatch,
  tags: ["autodocs"],
} satisfies Meta<typeof Swatch>;

export default meta;
type Story = StoryObj<typeof Swatch>;

const PALETTE = [
  { value: "amber", label: "Ambre", className: "bg-palette-amber" },
  {
    value: "terracotta",
    label: "Terracotta",
    className: "bg-palette-terracotta",
  },
  { value: "olive", label: "Olive", className: "bg-palette-olive" },
  { value: "sage", label: "Sauge", className: "bg-palette-sage" },
  { value: "slate", label: "Ardoise", className: "bg-palette-slate" },
  { value: "indigo", label: "Encre", className: "bg-palette-indigo" },
  { value: "plum", label: "Prune", className: "bg-palette-plum" },
  { value: "stone", label: "Pierre", className: "bg-palette-stone" },
];

export const Default: Story = {
  render: () => (
    <SwatchGroup defaultValue={["amber"]} aria-label="Couleur">
      {PALETTE.map((color) => (
        <Swatch
          key={color.value}
          value={color.value}
          title={color.label}
          aria-label={color.label}
          className={color.className}
        />
      ))}
    </SwatchGroup>
  ),
};
