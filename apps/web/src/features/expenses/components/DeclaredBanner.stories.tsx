import type { Meta, StoryObj } from "@storybook/react";

import { DeclaredBanner } from "./declared-banner";

const meta = {
  title: "Web/Expenses/DeclaredBanner",
  component: DeclaredBanner,
  tags: ["autodocs"],
  args: {
    month: "2026-08",
    declaredOn: "2026-09-09",
    deductedCents: 101_645,
    isBusy: false,
    onUndo: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DeclaredBanner>;

export default meta;
type Story = StoryObj<typeof DeclaredBanner>;

export const Default: Story = {};

export const Undoing: Story = { args: { isBusy: true } };
