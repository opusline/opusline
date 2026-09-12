import type { Meta, StoryObj } from "@storybook/react";

import { m } from "@/paraglide/messages.js";

import { ReceiptScanZone } from "./receipt-scan-zone";

const meta = {
  title: "Web/Expenses/ReceiptScanZone",
  component: ReceiptScanZone,
  tags: ["autodocs"],
  args: { state: { status: "idle" }, onFile: () => {}, onReset: () => {} },
  decorators: [
    (Story) => (
      <div className="w-105">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ReceiptScanZone>;

export default meta;
type Story = StoryObj<typeof ReceiptScanZone>;

export const Idle: Story = {};

export const Reading: Story = {
  args: { state: { status: "busy", fileName: "lunaprint-facture-9921.pdf" } },
};

export const Done: Story = {
  args: {
    state: {
      status: "done",
      fileName: "lunaprint-facture-9921.pdf",
      readCount: 4,
      hasCategory: true,
    },
  },
};

export const Unreadable: Story = {
  args: { state: { status: "unreadable", fileName: "photo-facture.png" } },
};

export const Failed: Story = {
  args: {
    state: {
      status: "failed",
      fileName: "lunaprint-facture-9921.pdf",
      message: m.expenses_scan_throttled(),
    },
  },
};
