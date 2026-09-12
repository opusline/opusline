import type { Meta, StoryObj } from "@storybook/react";
import { Meter } from "./meter";

const meta = {
  title: "UI/Meter",
  component: Meter,
  tags: ["autodocs"],
  args: { "aria-label": "Part du plafond micro-BNC", value: 0.86 },
} satisfies Meta<typeof Meter>;

export default meta;
type Story = StoryObj<typeof Meter>;

export const Default: Story = {
  render: (args) => (
    <div className="w-80">
      <Meter {...args} />
    </div>
  ),
};

/** Category bars: each row's label names its meter, the quiet tone marks the grouped row. */
export const CategoryRows: Story = {
  render: () => (
    <div className="flex w-96 flex-col gap-2.5 text-sm">
      {[
        ["Matériel", 1, "brand"],
        ["Abonnements", 0.31, "quiet"],
        ["Repas", 0.09, "brand"],
      ].map(([label, value, tone]) => (
        <div
          className="grid grid-cols-[7rem_minmax(0,1fr)_5.5rem] items-center gap-3"
          key={String(label)}
        >
          <span className="truncate text-foreground-3" id={`meter-${label}`}>
            {label}
          </span>
          <Meter
            aria-labelledby={`meter-${label}`}
            tone={tone as "brand" | "quiet"}
            value={Number(value)}
          />
          <span className="text-right font-mono text-foreground-2 tabular-nums">
            {Math.round(Number(value) * 4950)} €
          </span>
        </div>
      ))}
    </div>
  ),
};

export const Empty: Story = {
  args: { value: 0 },
  render: (args) => (
    <div className="w-80">
      <Meter {...args} />
    </div>
  ),
};
