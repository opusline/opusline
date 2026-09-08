import type { Meta, StoryObj } from "@storybook/react";

import { QrCode } from "./qr-code";

const meta = {
  title: "UI/QrCode",
  component: QrCode,
  tags: ["autodocs"],
  args: {
    value:
      "otpauth://totp/Opusline:theo%40example.com?secret=JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP&issuer=Opusline",
    label: "Code à scanner avec une application d'authentification",
  },
} satisfies Meta<typeof QrCode>;

export default meta;
type Story = StoryObj<typeof QrCode>;

export const Default: Story = {};

export const Large: Story = {
  args: { size: "lg" },
};
