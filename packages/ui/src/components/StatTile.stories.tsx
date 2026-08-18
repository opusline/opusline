import type { Meta, StoryObj } from "@storybook/react";
import { Pencil } from "lucide-react";
import { Button } from "./button";
import { StatTile, StatTileRow } from "./stat-tile";

const meta = {
  title: "UI/StatTile",
  component: StatTile,
  tags: ["autodocs"],
} satisfies Meta<typeof StatTile>;

export default meta;
type Story = StoryObj<typeof StatTile>;

export const Default: Story = {
  args: {
    label: "À encaisser",
    value: "17 448 €",
    sub: "5 factures ouvertes",
    tone: "strong",
  },
  render: (args) => (
    <StatTileRow className="grid-cols-1">
      <StatTile {...args} />
    </StatTileRow>
  ),
};

export const InvoiceHeader: Story = {
  render: () => (
    <StatTileRow className="grid-cols-3">
      <StatTile
        label="À encaisser"
        value="17 448 €"
        sub="5 factures ouvertes"
        tone="strong"
      />
      <StatTile
        label="Dont en retard"
        value="3 756 €"
        sub="3 échues · jusqu'à 147 j"
        tone="warn"
      />
      <StatTile
        label="Solde compte pro"
        value="—"
        sub="saisi à la main · importer un relevé"
        tone="quiet"
      />
    </StatTileRow>
  ),
};

export const Tones: Story = {
  render: () => (
    <StatTileRow className="grid-cols-2 md:grid-cols-5">
      <StatTile label="Défaut" value="12" tone="default" />
      <StatTile label="Appuyé" value="1 224 €" tone="strong" />
      <StatTile label="Marque" value="48 900 €" tone="brand" />
      <StatTile label="Alerte" value="3 756 €" tone="warn" />
      <StatTile label="Discret" value="—" tone="quiet" />
    </StatTileRow>
  ),
};

/**
 * Standalone cards instead of the shared-hairline band, for tiles that answer
 * separate questions rather than reading as one run of figures.
 */
export const Cards: Story = {
  render: () => (
    <StatTileRow className="grid-cols-1 md:grid-cols-2" variant="cards">
      <StatTile
        label="Facturable cette semaine"
        value="2 497,50 €"
        sub="4 j × 550 € + 3,5 h × 85 €"
        tone="brand"
        size="lg"
      />
      <StatTile
        label="Mois en cours"
        value="19 j"
        meter={19 / 22}
        sub="sur 22 jours ouvrés"
        tone="strong"
        size="lg"
      />
    </StatTileRow>
  ),
};

/**
 * A meter turns a figure into a share of its ceiling. It is decorative: the
 * value and the sub line already carry the same reading in words.
 */
export const WithMeter: Story = {
  render: () => (
    <StatTileRow className="grid-cols-1 md:grid-cols-3">
      <StatTile
        label="Mois en cours"
        value="18,5 j"
        meter={18.5 / 21}
        sub="sur 21 jours ouvrés"
        tone="strong"
        size="lg"
      />
      <StatTile
        label="Mois vide"
        value="0 j"
        meter={0}
        sub="sur 21 jours ouvrés"
        tone="quiet"
        size="lg"
      />
      <StatTile
        label="Mois dépassé"
        value="23 j"
        meter={23 / 21}
        sub="sur 21 jours ouvrés"
        tone="strong"
        size="lg"
      />
    </StatTileRow>
  ),
};

export const WithoutSub: Story = {
  render: () => (
    <StatTileRow className="grid-cols-2 md:grid-cols-4">
      <StatTile label="CA 2026" value="—" tone="brand" />
      <StatTile label="En attente" value="—" tone="strong" />
      <StatTile label="Délai moyen" value="—" />
      <StatTile label="Missions" value="3" />
    </StatTileRow>
  ),
};

export const Large: Story = {
  render: () => (
    <StatTileRow className="grid-cols-1 md:grid-cols-3">
      <StatTile
        label="Solde courant"
        value="14 820,00 €"
        sub="relevé du 10/08/2026"
        tone="strong"
        size="lg"
      />
      <StatTile
        label="Provisions à garder"
        value="6 307 €"
        sub="TVA, URSSAF et matelas"
        size="lg"
      />
      <StatTile
        label="À rapprocher"
        value="3"
        sub="encaissements sans facture liée"
        tone="brand"
        size="lg"
      />
    </StatTileRow>
  ),
};

export const WithAction: Story = {
  render: () => (
    <StatTileRow className="grid-cols-1">
      <StatTile
        label="Solde courant"
        value="14 820,00 €"
        sub="saisi à la main"
        tone="strong"
        size="lg"
        action={
          <Button variant="ghost" size="icon-sm" aria-label="Modifier le solde">
            <Pencil />
          </Button>
        }
      />
    </StatTileRow>
  ),
};
