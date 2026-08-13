import type { Meta, StoryObj } from "@storybook/react";

import { craItem } from "../lib/fixtures";
import { CraPicker } from "./cra-picker";

const items = [
  craItem({ id: null, month: "2026-08", status: 0 }),
  craItem({ id: 1, month: "2026-07", status: 1 }),
  craItem({ id: 2, month: "2026-06", status: 2 }),
  craItem({
    id: 3,
    missionId: 20,
    missionName: "Callisto socle API",
    month: "2026-06",
    status: 2,
    color: 3,
  }),
];

const meta = {
  title: "Web/Cra/CraPicker",
  component: CraPicker,
  tags: ["autodocs"],
  args: {
    counts: { toProduce: 1, sent: 1, signed: 2 },
    items,
    onPick: () => undefined,
    onQueryChange: () => undefined,
    query: "",
    selectedKey: "10:2026-07",
  },
  decorators: [
    (Story) => (
      <div className="max-w-xs p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CraPicker>;

export default meta;
type Story = StoryObj<typeof CraPicker>;

export const Default: Story = {};

export const Searching: Story = {
  args: { query: "socle" },
};

export const NoMatch: Story = {
  args: { query: "zzz" },
};

export const NothingOwed: Story = {
  args: {
    counts: { toProduce: 0, sent: 1, signed: 2 },
    items: items.slice(1),
  },
};
