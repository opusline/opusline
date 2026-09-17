import { linkVariants } from "@opusline/ui/components/text-link";
import type { Meta, StoryObj } from "@storybook/react";
import { Link } from "@tanstack/react-router";

import { StoryRouter } from "@/test/story-router";

import { AuthCard } from "./auth-card";
import { LoginForm } from "./login-form";
import { TwoFactorChallenge } from "./two-factor-challenge";

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

/** A step inside the sign-in flow shows its title and says what it asks for. */
export const WithDescription: Story = {
  args: {
    title: "Vérification en deux étapes",
    description: "Une étape de plus pour confirmer que c'est bien vous.",
    children: (
      <TwoFactorChallenge
        error={null}
        isPending={false}
        methods={[0, 1]}
        onBack={() => {}}
        onSubmitCode={async () => ({ status: "success" })}
        onSubmitRecoveryCode={async () => ({ status: "success" })}
        onUsePasskey={async () => ({ status: "success" })}
      />
    ),
  },
};
