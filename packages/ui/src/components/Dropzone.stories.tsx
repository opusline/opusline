import type { Meta, StoryObj } from "@storybook/react";
import { FileTextIcon, PaperclipIcon, UploadIcon } from "lucide-react";
import { Dropzone } from "./dropzone";

const meta = {
  title: "UI/Dropzone",
  component: Dropzone,
  tags: ["autodocs"],
  args: {
    accept: ".pdf,.jpg,.jpeg,.png,.webp",
    "aria-label": "Joindre la facture",
    onFiles: () => {},
  },
} satisfies Meta<typeof Dropzone>;

export default meta;
type Story = StoryObj<typeof Dropzone>;

export const Default: Story = {
  render: (args) => (
    <Dropzone {...args} className="w-96">
      <PaperclipIcon aria-hidden className="text-muted-foreground-2" />
      <span>Glissez la facture ici, ou cliquez</span>
    </Dropzone>
  ),
};

/** The three sizes: a cell affordance, a form field, a panel's empty state. */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex w-96 flex-col items-start gap-4">
      <Dropzone {...args} size="inline">
        <PaperclipIcon aria-hidden />
        Lier la facture
      </Dropzone>
      <Dropzone {...args} className="w-full">
        <PaperclipIcon aria-hidden className="text-muted-foreground-2" />
        <span>Glissez la facture ici, ou cliquez</span>
      </Dropzone>
      <Dropzone {...args} className="w-full" size="lg">
        <FileTextIcon aria-hidden />
        <span className="text-foreground-hi">
          Glissez la facture ici, ou cliquez
        </span>
        <span className="text-muted-foreground-3 text-xs">
          PDF ou photo · fournisseur, date, montants et TVA sont lus
          automatiquement
        </span>
      </Dropzone>
    </div>
  ),
};

/**
 * `attention` marks a gap the drop would fill — the receipt a row still
 * waits for; `brand` is a panel's main affordance.
 */
export const Tones: Story = {
  render: (args) => (
    <div className="flex w-96 flex-col items-start gap-4">
      <Dropzone {...args} size="inline" tone="attention">
        <PaperclipIcon aria-hidden />
        Lier la facture
      </Dropzone>
      <Dropzone {...args} className="w-full" tone="attention">
        <PaperclipIcon aria-hidden />
        <span>Lier la facture</span>
      </Dropzone>
      <Dropzone {...args} className="w-full" size="lg" tone="brand">
        <UploadIcon aria-hidden />
        <span>Glissez la facture ici, ou cliquez</span>
      </Dropzone>
    </div>
  ),
};

export const Disabled: Story = {
  render: (args) => (
    <Dropzone {...args} className="w-96" disabled>
      <PaperclipIcon aria-hidden className="text-muted-foreground-2" />
      <span>Lecture en cours…</span>
    </Dropzone>
  ),
};
