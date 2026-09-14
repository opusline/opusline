import { linkVariants } from "@opusline/ui/components/text-link";
import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "@tanstack/react-router";

import { StoryRouter } from "@/test/story-router";

import { AuthCard } from "./auth-card";
import { LoginForm } from "./login-form";

const meta = {
  title: "Web/Auth/AuthCard",
  component: AuthCard,
  tags: ["autodocs"],
} satisfies Meta<typeof AuthCard>;

export default meta;
type Story = StoryObj<typeof AuthCard>;

export const WithLoginForm: Story = {
  args: {
    title: "Connexion",
    footer: "Pas encore de compte ? Créer un compte",
    children: <LoginForm onSubmit={() => undefined} />,
  },
};

/**
 * The footer as the routes actually pass it. A plain string renders no anchor,
 * so the only link the app paints on `--background` never reached the contrast
 * gate — which is how it stayed on `--primary` at 3.42:1, and how it stayed
 * distinguished from the sentence around it by colour alone.
 */
export const WithFooterLink: Story = {
  args: {
    title: "Connexion",
    footer: (
      <>
        Pas encore de compte ?{" "}
        <Link className={linkVariants({ underline: "always" })} to="/">
          Créer un compte
        </Link>
      </>
    ),
    children: <LoginForm onSubmit={() => undefined} />,
  },
  decorators: [
    (Story) => (
      <StoryRouter>
        <Story />
      </StoryRouter>
    ),
  ],
};
