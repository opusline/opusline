import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { MoneyFormatProvider } from "@/components/money-format-provider";
import { m } from "@/paraglide/messages.js";
import { MissionRateField } from "./mission-rate-field";

function MissionRateFieldExample({
  billingMode,
  initialDraft = "",
}: {
  billingMode: 0 | 1 | 2;
  initialDraft?: string;
}) {
  const [rateDraft, setRateDraft] = useState(initialDraft);

  return (
    <MissionRateField
      billingMode={billingMode}
      id="story-mission-rate"
      isRateMissing={false}
      onDraftChange={setRateDraft}
      rateDraft={rateDraft}
    />
  );
}

const meta = {
  title: "Web/Missions/MissionRateField",
  component: MissionRateField,
  tags: ["autodocs"],
  args: {
    id: "story-mission-rate",
    billingMode: 0,
    rateDraft: "550",
    isRateMissing: false,
    onDraftChange: () => {},
  },
} satisfies Meta<typeof MissionRateField>;

export default meta;
type Story = StoryObj<typeof MissionRateField>;

export const Daily: Story = {};

export const Hourly: Story = {
  args: { billingMode: 1, rateDraft: "85" },
};

export const MissingRate: Story = {
  args: { rateDraft: "", isRateMissing: true },
};

/** A US-hosted account: dollar unit, dot-decimal drafts. */
export const UsAccount: Story = {
  render: () => (
    <MoneyFormatProvider currency="USD" locale="en-US">
      <MissionRateFieldExample billingMode={0} initialDraft="1,234.5" />
    </MoneyFormatProvider>
  ),
};

/**
 * A forfait's « TJM de référence »: the same money draft, relabelled, with the hint
 * that explains why a fixed price carries a daily rate at all.
 */
export const AsAReferenceDailyRate: Story = {
  args: {
    billingMode: 0,
    hint: m.missions_reference_rate_hint(),
    label: m.missions_reference_rate_label(),
    placeholder: m.missions_reference_rate_placeholder(),
    rateDraft: "480",
  },
};
