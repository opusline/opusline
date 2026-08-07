import type { Meta, StoryObj } from "@storybook/react";

import { SAMPLE_LOGO_SRC } from "@/lib/logo-fixture";
import { LogoPicker } from "./logo-picker";

const meta = {
  title: "Web/LogoPicker",
  component: LogoPicker,
  tags: ["autodocs"],
  args: {
    label: "Logo du client",
    onPick: () => {},
    onRemove: () => {},
    removeLabel: "Retirer le logo du client",
  },
} satisfies Meta<typeof LogoPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The slot as it appears on the creation form. */
export const Empty: Story = {
  args: { placeholder: "Déposez le logo", size: "lg" },
};

export const Filled: Story = {
  args: { placeholder: "Déposez le logo", size: "lg", src: SAMPLE_LOGO_SRC },
};

/** The compact slot used in the client edit form. */
export const Small: Story = {
  args: { placeholder: "Déposez", size: "sm" },
};

export const SmallFilled: Story = {
  args: { placeholder: "Déposez", size: "sm", src: SAMPLE_LOGO_SRC },
};

export const WithError: Story = {
  args: {
    placeholder: "Déposez le logo",
    size: "lg",
    error: "L'envoi a échoué. Réessayez dans un instant.",
  },
};

/** Both actions stay locked while an upload or a removal is in flight. */
export const Pending: Story = {
  args: {
    placeholder: "Déposez le logo",
    size: "lg",
    src: SAMPLE_LOGO_SRC,
    isPending: true,
  },
};
