import type { Meta, StoryObj } from "@storybook/react";

import { craDays, craDetail, craGrid, DEMO_SETTINGS } from "../lib/fixtures";
import { CraDocument } from "./cra-document";

const meta = {
  title: "Web/Cra/CraDocument",
  component: CraDocument,
  tags: ["autodocs"],
  args: {
    applySignature: false,
    detail: craDetail(),
    model: craGrid(),
    onApplySignatureChange: () => undefined,
    onOpenSignatureSettings: () => undefined,
    issuerFallbackName: "Théo Marchand",
    settings: DEMO_SETTINGS,
    signatureSrc: "",
  },
  decorators: [
    (Story) => (
      <div className="max-w-3xl p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof CraDocument>;

export default meta;
type Story = StoryObj<typeof CraDocument>;

export const Default: Story = {};

export const WeekendWorked: Story = {
  args: {
    detail: craDetail({}, craDays({ "2026-07-11": 5_000 })),
    model: craGrid(craDetail({}, craDays({ "2026-07-11": 5_000 }))),
  },
};

export const WithoutASignature: Story = {
  args: { settings: { ...DEMO_SETTINGS, hasSignature: false } },
};
