import type { Meta, StoryObj } from "@storybook/react";
import {
  CheckIcon,
  CircleAlert,
  RefreshCwIcon,
  TriangleAlert,
} from "lucide-react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "./alert";
import { Button } from "./button";

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

/** A settled state the page keeps showing — a month declared, a file read. */
export const Success: Story = {
  render: () => (
    <Alert variant="success">
      <CheckIcon />
      <AlertDescription>
        CA3 août déclarée le 30 juillet · 1 016,45 € déduits
      </AlertDescription>
    </Alert>
  ),
};

export const Brand: Story = {
  render: () => (
    <Alert variant="brand">
      <TriangleAlert />
      <AlertTitle>2 périodes travaillées non facturées</AlertTitle>
      <AlertDescription>
        Orvella front · 3 j, Vesterhus maintenance · 3,5 h. Soit 1 948 € HT qui
        ne figurent sur aucune facture.
      </AlertDescription>
    </Alert>
  ),
};

/** One small action fits the corner the alert keeps free beside its text. */
export const CornerAction: Story = {
  render: () => (
    <Alert>
      <AlertTitle>Relevé importé</AlertTitle>
      <AlertDescription>42 mouvements lus sur le compte pro.</AlertDescription>
      <AlertAction>
        <Button size="xs" variant="outline">
          Voir
        </Button>
      </AlertAction>
    </Alert>
  ),
};

/** Several actions take a row under the text, whatever its length. */
export const RowActions: Story = {
  render: () => (
    <Alert variant="brand">
      <RefreshCwIcon />
      <AlertDescription>
        Prélèvement récurrent détecté : PRLV SEPA ATELIERS RUCHE · 49,00 € · le
        20 du mois · 3 mois consécutifs
      </AlertDescription>
      <AlertAction layout="row">
        <Button size="lg" variant="secondary">
          Créer l'abonnement
        </Button>
        <Button size="lg" variant="ghost">
          Ignorer
        </Button>
      </AlertAction>
    </Alert>
  ),
};
