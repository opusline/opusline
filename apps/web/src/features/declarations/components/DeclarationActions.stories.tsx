import type { Meta, StoryObj } from "@storybook/react";

import { DeclarationActions } from "./declaration-actions";

const meta = {
  title: "Web/Declarations/DeclarationActions",
  component: DeclarationActions,
  tags: ["autodocs"],
  args: {
    completion: null,
    hasDeadline: true,
    href: "https://autoentrepreneur.urssaf.fr",
    linkLabel: "Ouvrir autoentrepreneur.urssaf.fr →",
    prefill: {
      href: "https://www.autoentrepreneur.urssaf.fr/portail/accueil.html#opusline=eyJ2IjoxfQ",
      label: "Pré-remplir sur autoentrepreneur.urssaf.fr",
    },
    isBusy: false,
    onMarkFiled: () => {},
    onMarkPaid: () => {},
    onUndo: () => {},
  },
  decorators: [
    (Story) => (
      <div className="max-w-lg">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DeclarationActions>;

export default meta;
type Story = StoryObj<typeof DeclarationActions>;

export const Default: Story = {};

export const WithoutPrefill: Story = { args: { prefill: undefined } };

export const Filed: Story = {
  args: { completion: { declaredOn: "2026-08-09", paidOn: null } },
};

export const Paid: Story = {
  args: { completion: { declaredOn: "2026-08-09", paidOn: "2026-08-12" } },
};

export const Busy: Story = { args: { isBusy: true } };
