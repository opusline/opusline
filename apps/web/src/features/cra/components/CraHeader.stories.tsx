import type { Meta, StoryObj } from "@storybook/react";

import { craDetail } from "../lib/fixtures";
import { CraHeader } from "./cra-header";

const meta = {
  title: "Web/Cra/CraHeader",
  component: CraHeader,
  tags: ["autodocs"],
  args: {
    detail: craDetail(),
    isBusy: false,
    onDownload: () => undefined,
    onReopen: () => undefined,
    onSignedReturn: () => undefined,
  },
  decorators: [
    (Story) => (
      <div className="p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CraHeader>;

export default meta;
type Story = StoryObj<typeof CraHeader>;

export const Draft: Story = {};

export const Sent: Story = {
  args: {
    detail: craDetail({ status: 1, sentOn: "2026-08-01", editable: false }),
  },
};

export const Signed: Story = {
  args: {
    detail: craDetail({
      status: 2,
      sentOn: "2026-08-01",
      signedOn: "2026-08-04",
      editable: false,
    }),
  },
};

export const Busy: Story = { args: { isBusy: true } };
