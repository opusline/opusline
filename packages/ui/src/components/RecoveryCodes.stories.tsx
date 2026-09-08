import type { Meta, StoryObj } from "@storybook/react";

import { RecoveryCodes } from "./recovery-codes";

const meta = {
  title: "UI/RecoveryCodes",
  component: RecoveryCodes,
  tags: ["autodocs"],
  args: {
    codes: [
      "k4F7mQ2pL9-a8Zr3Tn6Wx",
      "Vb2Hs9Jq1M-c7Yd4Ke8Pz",
      "Rt5Nw3Xg6B-h1Lm9Qv2Sc",
      "Zp8Ck4Dj7F-u3Ha6Nb1Ye",
      "Mq1Ws5Ef9G-t2Kj8Lr4Xv",
      "Hd6Pn2Bt3C-y9Vz7Gm5Ka",
      "Jx9Lr4Ms8Q-e1Wf6Tc3Nb",
      "Ck3Yv7Hq2Z-p5Dg1Rs9Lm",
    ],
    label: "Codes de secours",
    copyLabel: "Copier",
    copiedLabel: "Copié",
    copyFailedLabel: "Échec de la copie",
    downloadLabel: "Télécharger",
    downloadFileName: "opusline-codes-de-secours.txt",
  },
} satisfies Meta<typeof RecoveryCodes>;

export default meta;
type Story = StoryObj<typeof RecoveryCodes>;

export const Default: Story = {};

export const Narrow: Story = {
  render: (args) => (
    <div className="max-w-72">
      <RecoveryCodes {...args} />
    </div>
  ),
};
