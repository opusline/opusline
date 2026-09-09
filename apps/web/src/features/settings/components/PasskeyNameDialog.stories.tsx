import type { Meta, StoryObj } from "@storybook/react";

import { PasskeyNameDialog } from "./passkey-name-dialog";

const meta = {
  title: "Web/Settings/PasskeyNameDialog",
  component: PasskeyNameDialog,
  tags: ["autodocs"],
  args: {
    open: true,
    title: "Nommer cette clé d'accès",
    initialName: "Ma clé d'accès",
    isPending: false,
    onSubmit: async () => ({ status: "success" }) as const,
    onCancel: () => {},
  },
} satisfies Meta<typeof PasskeyNameDialog>;

export default meta;
type Story = StoryObj<typeof PasskeyNameDialog>;

export const Naming: Story = {};

export const Renaming: Story = {
  args: { title: "Renommer la clé d'accès", initialName: "MacBook de Théo" },
};
