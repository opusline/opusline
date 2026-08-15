import type { Meta, StoryObj } from "@storybook/react";

import { RichMessage } from "./rich-message";

const meta = {
  title: "Web/RichMessage",
  component: RichMessage,
  tags: ["autodocs"],
} satisfies Meta<typeof RichMessage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BoldInsideSentence: Story = {
  args: {
    message:
      "Le mode de facturation fixe l'unité de saisie : <strong>jours</strong> pour un TJM, <strong>heures</strong> sinon.",
    strongClassName: "font-medium text-foreground-2",
  },
};

export const WithoutMarkers: Story = {
  args: {
    message: "Une phrase sans mise en avant.",
  },
};
