import type { Meta, StoryObj } from "@storybook/react";
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
