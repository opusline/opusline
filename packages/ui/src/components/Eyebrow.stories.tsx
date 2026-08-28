import type { Meta, StoryObj } from "@storybook/react";
import { Eyebrow, eyebrowVariants } from "./eyebrow";

const meta = {
  title: "UI/Eyebrow",
  component: Eyebrow,
  tags: ["autodocs"],
} satisfies Meta<typeof Eyebrow>;

export default meta;
type Story = StoryObj<typeof Eyebrow>;

export const Default: Story = {
  args: {
    children: "Mouvements",
  },
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <Eyebrow>Solde courant</Eyebrow>
      <Eyebrow tone="quiet">Relevés importés</Eyebrow>
    </div>
  ),
};

/** A panel's title, where the role has to be a real heading. */
export const AsAHeading: Story = {
  render: () => <h2 className={eyebrowVariants()}>Provisions à conserver</h2>,
};

/** A column header, where the styling belongs to a cell the table owns. */
export const AsAColumnHeader: Story = {
  render: () => (
    <table>
      <thead>
        <tr>
          <th className={eyebrowVariants()}>Client</th>
          <th className={eyebrowVariants({ tone: "quiet" })}>Type</th>
        </tr>
      </thead>
    </table>
  ),
};
