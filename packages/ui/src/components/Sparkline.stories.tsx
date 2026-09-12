import type { Meta, StoryObj } from "@storybook/react";
import { Sparkline } from "./sparkline";

const format = (value: number) =>
  `${Math.round(value).toLocaleString("fr-FR")} €`;

const POINTS = [
  ["sept. 25", 412],
  ["oct. 25", 505],
  ["nov. 25", 388],
  ["déc. 25", 612],
  ["janv. 26", 455],
  ["févr. 26", 530],
  ["mars 26", 690],
  ["avr. 26", 522],
  ["mai 26", 604],
  ["juin 26", 578],
  ["juil. 26", 1048],
  ["août 26", 167],
].map(([label, value]) => ({ label: String(label), value: Number(value) }));

const meta = {
  title: "UI/Sparkline",
  component: Sparkline,
  tags: ["autodocs"],
  args: {
    "aria-label": "Dépenses HT sur 12 mois",
    format,
    points: POINTS,
  },
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof Sparkline>;

/**
 * The marker guide is a solid hairline: dashed rules are reserved for
 * projections in the dataviz vocabulary, and the canvas's dashed guide read as
 * one.
 */
export const Default: Story = {
  render: (args) => (
    <div className="w-105 rounded-md border bg-card p-5">
      <Sparkline {...args} />
    </div>
  ),
};

export const MarkedElsewhere: Story = {
  args: { markerIndex: 6 },
  render: (args) => (
    <div className="w-105 rounded-md border bg-card p-5">
      <Sparkline {...args} />
    </div>
  ),
};

/** Stretches with its box: the stroke and the marker keep their size. */
export const Narrow: Story = {
  render: (args) => (
    <div className="w-56 rounded-md border bg-card p-4">
      <Sparkline {...args} className="h-16" />
    </div>
  ),
};

export const Flat: Story = {
  args: { points: POINTS.map((point) => ({ ...point, value: 0 })) },
  render: (args) => (
    <div className="w-105 rounded-md border bg-card p-5">
      <Sparkline {...args} />
    </div>
  ),
};
