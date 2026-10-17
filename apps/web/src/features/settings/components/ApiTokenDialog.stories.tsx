import type { Meta, StoryObj } from "@storybook/react";

import { ApiTokenDialog } from "./api-token-dialog";

const meta = {
  title: "Web/Settings/ApiTokenDialog",
  component: ApiTokenDialog,
  tags: ["autodocs"],
  args: {
    open: true,
    createdToken: null,
    isPending: false,
    onSubmit: async () => ({ status: "success" }) as const,
    onClose: () => {},
  },
} satisfies Meta<typeof ApiTokenDialog>;

export default meta;
type Story = StoryObj<typeof ApiTokenDialog>;

export const Naming: Story = {};

export const Created: Story = {
  args: {
    createdToken: "3|k4F7mQ2pL9a8Zr3Tn6WxVb2Hs9Jq1Mc7Yd4Ke8PzRt5Nw3Xg6B",
  },
};
