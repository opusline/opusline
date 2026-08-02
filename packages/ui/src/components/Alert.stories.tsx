import type { Meta, StoryObj } from "@storybook/react";
import { CircleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./alert";

const meta = {
  title: "UI/Alert",
  component: Alert,
  tags: ["autodocs"],
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Information</AlertTitle>
      <AlertDescription>Une information sans gravité.</AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <CircleAlert />
      <AlertTitle>Erreur</AlertTitle>
      <AlertDescription>Quelque chose s'est mal passé.</AlertDescription>
    </Alert>
  ),
};

export const Warn: Story = {
  render: () => (
    <Alert variant="warn">
      <CircleAlert />
      <AlertDescription>
        Email ou mot de passe incorrect. 2 essais restants avant blocage
        temporaire.
      </AlertDescription>
    </Alert>
  ),
};
