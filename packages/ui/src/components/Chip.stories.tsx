import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Chip, ChipCount, ChipGroup } from "./chip";

const meta = {
  title: "UI/Chip",
  component: Chip,
  tags: ["autodocs"],
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {
  render: () => (
    <ChipGroup defaultValue={["direct"]} aria-label="Type de client">
      <Chip value="direct">Direct</Chip>
      <Chip value="intermediaire">Intermédiaire</Chip>
      <Chip value="interne">Interne</Chip>
    </ChipGroup>
  ),
};

function FilterExample() {
  const [scope, setScope] = useState("all");

  return (
    <ChipGroup
      value={[scope]}
      onValueChange={(value) => {
        const next = value[0];
        if (typeof next === "string") {
          setScope(next);
        }
      }}
      aria-label="Filtrer les clients"
    >
      <Chip value="all" shape="pill">
        Tous
        <ChipCount>6</ChipCount>
      </Chip>
      <Chip value="active" shape="pill">
        Actifs
        <ChipCount>4</ChipCount>
      </Chip>
      <Chip value="archived" shape="pill">
        Archivés
        <ChipCount>2</ChipCount>
      </Chip>
    </ChipGroup>
  );
}

export const FilterWithCounts: Story = {
  render: () => <FilterExample />,
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ChipGroup defaultValue={["jour"]} aria-label="Mode de facturation">
        <Chip value="jour" size="md">
          Au jour
        </Chip>
        <Chip value="heure" size="md">
          À l'heure
        </Chip>
        <Chip value="forfait" size="md">
          Forfait
        </Chip>
      </ChipGroup>
      <ChipGroup defaultValue={["jour"]} aria-label="Mode de facturation">
        <Chip value="jour" size="sm">
          Au jour
        </Chip>
        <Chip value="heure" size="sm">
          À l'heure
        </Chip>
        <Chip value="forfait" size="sm">
          Forfait
        </Chip>
      </ChipGroup>
    </div>
  ),
};
