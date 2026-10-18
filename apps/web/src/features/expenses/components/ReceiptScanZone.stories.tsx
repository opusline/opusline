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

/** An account with an Anthropic key picks who reads each receipt. */
export const WithReaderChoice: Story = {
  args: { readerChoice: { reader: 1, onChange: () => {} } },
};

export const Reading: Story = {
  args: { state: { status: "busy", fileName: "lunaprint-facture-9921.pdf" } },
};

export const Done: Story = {
  args: {
    state: {
      status: "done",
      reader: 0,
      claudeFailure: null,
      fileName: "lunaprint-facture-9921.pdf",
      readCount: 4,
      hasCategory: true,
    },
  },
};

/** A photo only Claude can read: the account gave an Anthropic key. */
export const ReadByClaude: Story = {
  args: {
    state: {
      status: "done",
      reader: 1,
      claudeFailure: null,
      fileName: "photo-ticket-callisto.jpg",
      readCount: 5,
      hasCategory: true,
    },
  },
};

/** The key was revoked: the heuristics read the PDF and the form says why. */
export const ClaudeKeyRejected: Story = {
  args: {
    state: {
      status: "done",
      reader: 0,
      claudeFailure: 0,
      fileName: "lunaprint-facture-9921.pdf",
      readCount: 3,
      hasCategory: false,
    },
  },
};

export const Unreadable: Story = {
  args: {
    state: {
      status: "unreadable",
      fileName: "photo-facture.png",
      reader: 0,
      claudeFailure: null,
    },
  },
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
