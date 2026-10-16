import type { Meta, StoryObj } from "@storybook/react";

import { CLIENT_FIXTURE } from "@/test/fixtures";
import { StoryRouter } from "@/test/story-router";
import { secondClient } from "../lib/fixtures";
import { ExternalQuotePage } from "./external-quote-page";

const meta = {
  title: "Web/ExternalQuotePage",
  component: ExternalQuotePage,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
  args: {
    clients: [CLIENT_FIXTURE, secondClient],
    accountToday: "2026-10-16",
    isSaving: false,
    error: null,
    onSubmit: () => {},
  },
} satisfies Meta<typeof ExternalQuotePage>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The form as it opens: today, « Envoyé », no file yet. */
export const Empty: Story = {};

/** The API refused the reference: another quote already carries it. */
export const Refused: Story = {
  args: { error: "Un autre devis porte déjà ce numéro." },
};

/** No client to file the quote under. */
export const NoClients: Story = {
  args: { clients: [] },
};
