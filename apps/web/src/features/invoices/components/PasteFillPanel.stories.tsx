import type { Meta, StoryObj } from "@storybook/react";

import { pasteFillPrompt, pasteFillSample } from "../lib/paste-fill";
import { PasteFillPanel } from "./paste-fill-panel";

const meta = {
  title: "Web/PasteFillPanel",
  component: PasteFillPanel,
  tags: ["autodocs"],
  args: {
    prompt: pasteFillPrompt("quote", ["Nordlys", "Callisto"], "€"),
    sample: pasteFillSample("quote"),
    onFill: () => [
      { kind: "client", name: "Nordlys" },
      { kind: "title" },
      { kind: "lines", count: 2 },
      { kind: "term" },
      { kind: "validity", days: 30 },
      { kind: "deposit", percent: 30 },
    ],
  },
} satisfies Meta<typeof PasteFillPanel>;

export default meta;
type Story = StoryObj<typeof PasteFillPanel>;

/** Folded, as the editor opens it. */
export const Folded: Story = {};

/** Every fill is refused: what a free text gets. */
export const Unrecognized: Story = {
  args: { onFill: () => null },
};
