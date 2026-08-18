import type { Meta, StoryObj } from "@storybook/react";

import { ExemptField } from "./exempt-field";

const meta = {
  title: "Web/ExemptField",
  component: ExemptField,
  tags: ["autodocs"],
} satisfies Meta<typeof ExemptField>;

export default meta;
type Story = StoryObj<typeof ExemptField>;

/** The client form, when the account charges no TVA to anyone. */
export const VatRate: Story = {
  args: {
    label: "TVA facturée",
    reason: "Pas de TVA · franchise en base",
    labelClassName: "text-muted-foreground-3 text-xs",
  },
};

/** The settings form, where the intra-community number has nothing to identify. */
export const VatNumber: Story = {
  args: {
    label: "TVA intracommunautaire",
    reason: "Non assujetti · franchise en base",
    labelClassName: "text-muted-foreground-2 text-xs",
  },
};
