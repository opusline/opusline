import type { Meta, StoryObj } from "@storybook/react";

import { craDetail, craItem, DEMO_SETTINGS } from "../lib/fixtures";
import { CraPage } from "./cra-page";

const items = [
  craItem({ id: null, month: "2026-08", status: 0 }),
  craItem({ id: 1, month: "2026-07", status: 0 }),
  craItem({ id: 2, month: "2026-06", status: 1 }),
  craItem({ id: 3, month: "2026-05", status: 2 }),
];

const meta = {
  title: "Web/Cra/CraPage",
  component: CraPage,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    counts: { toProduce: 2, sent: 1, signed: 1 },
    detail: craDetail(),
    error: null,
    isBusy: false,
    isDetailPending: false,
    issuerFallbackName: "Théo Marchand",
    items,
    onDaysChange: () => undefined,
    onDownload: () => undefined,
    onGoToClients: () => undefined,
    onOpenSignatureSettings: () => undefined,
    onPick: () => undefined,
    onReopen: () => undefined,
    onReset: () => undefined,
    onSend: () => undefined,
    onStepChange: () => undefined,
    onUploadSignedReturn: () => undefined,
    settings: DEMO_SETTINGS,
    signatureSrc: "",
    step: "days",
    uploadError: null,
  },
  decorators: [
    (Story) => (
      <div className="p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CraPage>;

export default meta;
type Story = StoryObj<typeof CraPage>;

export const Days: Story = {};
export const Review: Story = { args: { step: "review" } };
export const Document: Story = { args: { step: "document" } };

export const Sent: Story = {
  args: {
    detail: craDetail({ status: 1, sentOn: "2026-08-01", editable: false }),
  },
};

export const Loading: Story = { args: { detail: null, isDetailPending: true } };

export const NothingToProduce: Story = {
  args: {
    counts: { toProduce: 0, sent: 0, signed: 0 },
    detail: null,
    items: [],
  },
};

export const Failed: Story = {
  args: { error: "L'enregistrement a échoué. Réessayez dans un instant." },
};
