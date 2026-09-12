import type { Meta, StoryObj } from "@storybook/react";

import { cfeReturn } from "../lib/fixtures";
import { CfeReturnBody } from "./cfe-return-body";

const meta = {
  title: "Web/Declarations/CfeReturnBody",
  component: CfeReturnBody,
  tags: ["autodocs"],
  args: { cfe: cfeReturn(), isRunningYear: true, onEnterAmount: () => {} },
  decorators: [
    (Story) => (
      <div className="flex max-w-xl flex-col gap-3.5">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CfeReturnBody>;

export default meta;
type Story = StoryObj<typeof CfeReturnBody>;

export const Estimate: Story = {};

export const FromNotice: Story = {
  args: {
    cfe: cfeReturn({ isEstimate: false, gap: { amount: 0, currency: "EUR" } }),
  },
};

/** No last year and nothing under the barème: nothing to guess from. */
export const Unknown: Story = {
  args: {
    cfe: cfeReturn({
      expected: null,
      isEstimate: false,
      provisioned: null,
      gap: null,
    }),
  },
};

export const PastYear: Story = {
  args: {
    cfe: cfeReturn({
      expected: null,
      isEstimate: false,
      provisioned: null,
      gap: null,
    }),
    isRunningYear: false,
  },
};
