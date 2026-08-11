import type { Meta, StoryObj } from "@storybook/react";

import { SignatureSettings } from "./signature-settings";

const SIGNATURE_PREVIEW =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="60"><path d="M8 44c22-30 34 6 52-14s26 18 44-4 30 10 46-6" fill="none" stroke="#1F1B18" stroke-width="3" stroke-linecap="round"/></svg>`,
  );

const meta = {
  title: "Web/SignatureSettings",
  component: SignatureSettings,
  tags: ["autodocs"],
  args: {
    hasSignature: false,
    signatureSrc: SIGNATURE_PREVIEW,
    isPending: false,
    error: null,
    onSave: async () => true,
    onRemove: () => {},
  },
} satisfies Meta<typeof SignatureSettings>;

export default meta;
type Story = StoryObj<typeof SignatureSettings>;

export const EmptyPad: Story = {};

export const Saved: Story = {
  args: { hasSignature: true },
};

export const UploadFailed: Story = {
  args: { error: "L'envoi a échoué. Réessayez dans un instant." },
};
