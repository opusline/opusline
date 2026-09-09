import type { Meta, StoryObj } from "@storybook/react";
import { LaptopIcon, SmartphoneIcon } from "lucide-react";

import { Badge } from "./badge";
import { Button } from "./button";
import {
  StatusRow,
  StatusRowActions,
  StatusRowContent,
  StatusRowDescription,
  StatusRowMedia,
  StatusRowTitle,
} from "./status-row";

const meta = {
  title: "UI/StatusRow",
  component: StatusRow,
  tags: ["autodocs"],
} satisfies Meta<typeof StatusRow>;

export default meta;
type Story = StoryObj<typeof StatusRow>;

export const Enabled: Story = {
  render: () => (
    <StatusRow>
      <StatusRowMedia>
        <SmartphoneIcon />
      </StatusRowMedia>
      <StatusRowContent>
        <StatusRowTitle>
          Application d'authentification
          <Badge variant="success">Activée</Badge>
        </StatusRowTitle>
        <StatusRowDescription>8 codes de secours restants</StatusRowDescription>
      </StatusRowContent>
      <StatusRowActions>
        <Button size="lg" variant="outline">
          Régénérer les codes
        </Button>
        <Button size="lg" variant="destructive">
          Désactiver
        </Button>
      </StatusRowActions>
    </StatusRow>
  ),
};

export const Disabled: Story = {
  render: () => (
    <StatusRow>
      <StatusRowMedia>
        <SmartphoneIcon />
      </StatusRowMedia>
      <StatusRowContent>
        <StatusRowTitle>
          Application d'authentification
          <Badge variant="quiet">Désactivée</Badge>
        </StatusRowTitle>
        <StatusRowDescription>
          Un code à six chiffres sera demandé à chaque connexion.
        </StatusRowDescription>
      </StatusRowContent>
      <StatusRowActions>
        <Button size="lg">Activer</Button>
      </StatusRowActions>
    </StatusRow>
  ),
};

export const List: Story = {
  render: () => (
    <div className="divide-y rounded-md border">
      {[
        ["Chrome sur macOS", "Utilisé aujourd'hui", true],
        ["Firefox sur Linux", "Utilisé il y a 3 jours", false],
        ["Safari sur iOS", "Utilisé il y a 12 jours", false],
      ].map(([label, hint, isCurrent]) => (
        <StatusRow key={String(label)} surface="plain">
          <StatusRowMedia>
            <LaptopIcon />
          </StatusRowMedia>
          <StatusRowContent>
            <StatusRowTitle>
              {label}
              {isCurrent ? <Badge variant="brand">Ce navigateur</Badge> : null}
            </StatusRowTitle>
            <StatusRowDescription>{hint}</StatusRowDescription>
          </StatusRowContent>
          <StatusRowActions>
            <Button size="lg" variant="outline">
              Révoquer
            </Button>
          </StatusRowActions>
        </StatusRow>
      ))}
    </div>
  ),
};
