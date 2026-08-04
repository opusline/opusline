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
