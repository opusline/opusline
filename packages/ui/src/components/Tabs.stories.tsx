import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Underline: Story = {
  render: () => (
    <Tabs defaultValue="missions">
      <TabsList variant="underline">
        <TabsTrigger value="missions">Missions</TabsTrigger>
        <TabsTrigger value="factures">Factures</TabsTrigger>
        <TabsTrigger value="coordonnees">Coordonnées</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      <TabsContent value="missions" className="p-4 text-sm">
        La liste des missions du client.
      </TabsContent>
      <TabsContent value="factures" className="p-4 text-sm">
        Les factures émises pour ce client.
      </TabsContent>
      <TabsContent value="coordonnees" className="p-4 text-sm">
        SIRET, TVA et adresse de facturation.
      </TabsContent>
      <TabsContent value="notes" className="p-4 text-sm">
        Notes libres sur le client.
      </TabsContent>
    </Tabs>
  ),
};

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="missions">
      <TabsList>
        <TabsTrigger value="missions">Missions</TabsTrigger>
        <TabsTrigger value="factures">Factures</TabsTrigger>
        <TabsTrigger value="coordonnees">Coordonnées</TabsTrigger>
        <TabsTrigger value="notes">Notes</TabsTrigger>
      </TabsList>
      <TabsContent value="missions" className="p-4 text-sm">
        La liste des missions du client.
      </TabsContent>
      <TabsContent value="factures" className="p-4 text-sm">
        Les factures émises pour ce client.
      </TabsContent>
      <TabsContent value="coordonnees" className="p-4 text-sm">
        SIRET, TVA et adresse de facturation.
      </TabsContent>
      <TabsContent value="notes" className="p-4 text-sm">
        Notes libres sur le client.
      </TabsContent>
    </Tabs>
  ),
};

export const Sidebar: Story = {
  render: () => (
    <Tabs
      className="items-start gap-8"
      defaultValue="identite"
      orientation="vertical"
    >
      <TabsList className="w-55 shrink-0" variant="sidebar">
        <TabsTrigger value="identite">
          <span className="flex flex-col gap-0.75">
            <span className="text-sm">Identité</span>
            <span className="text-muted-foreground-3 text-xs">
              Coordonnées, adresse
            </span>
          </span>
        </TabsTrigger>
        <TabsTrigger value="fiscalite">
          <span className="flex flex-col gap-0.75">
            <span className="text-sm">Fiscalité</span>
            <span className="text-muted-foreground-3 text-xs">
              URSSAF, TVA, provisions
            </span>
          </span>
        </TabsTrigger>
        <TabsTrigger value="facturation">
          <span className="flex flex-col gap-0.75">
            <span className="text-sm">Facturation</span>
            <span className="text-muted-foreground-3 text-xs">
              Délais, numérotation, matelas
            </span>
          </span>
        </TabsTrigger>
      </TabsList>
      <TabsContent
        className="rounded-md border bg-card p-6 text-sm"
        value="identite"
      >
        Nom commercial, SIRET, adresses.
      </TabsContent>
      <TabsContent
        className="rounded-md border bg-card p-6 text-sm"
        value="fiscalite"
      >
        Périodicité URSSAF, taux de cotisations, régime de TVA.
      </TabsContent>
      <TabsContent
        className="rounded-md border bg-card p-6 text-sm"
        value="facturation"
      >
        Délai de paiement, numérotation, matelas de trésorerie.
      </TabsContent>
    </Tabs>
  ),
};
