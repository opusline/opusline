import type { Meta, StoryObj } from "@storybook/react";
import { useRef, useState } from "react";

import { Button } from "./button";
import { SignaturePad, type SignaturePadHandle } from "./signature-pad";

const meta = {
  title: "UI/SignaturePad",
  component: SignaturePad,
  tags: ["autodocs"],
} satisfies Meta<typeof SignaturePad>;

export default meta;
type Story = StoryObj<typeof SignaturePad>;

export const Default: Story = {
  render: () => (
    <div className="max-w-2xl">
      <SignaturePad
        drawnLabel="Signature drawn"
        label="Signature area"
        placeholder="Draw your signature here"
      />
    </div>
  ),
};

/**
 * La bascule « Saisir au clavier » est l'alternative accessible au tracé : le
 * nom saisi est peint sur le canevas en Lora italique, et l'export PNG reste
 * identique au mode dessin.
 */
export const TypedMode: Story = {
  render: () => (
    <div className="max-w-2xl">
      <SignaturePad
        defaultMode="type"
        drawnLabel="Signature drawn"
        label="Signature area"
        placeholder="Draw your signature here"
      />
    </div>
  ),
};

export const WithActions: Story = {
  render: () => {
    const padRef = useRef<SignaturePadHandle>(null);
    const [hasDrawing, setHasDrawing] = useState(false);
    const [savedSize, setSavedSize] = useState<number | null>(null);

    return (
      <div className="flex max-w-2xl flex-col gap-3.5">
        <SignaturePad
          drawnLabel="Signature drawn"
          label="Signature area"
          placeholder="Draw your signature here"
          onDrawingChange={setHasDrawing}
          ref={padRef}
        />
        <div className="flex items-center gap-2">
          <Button
            disabled={!hasDrawing}
            onClick={async () => {
              const blob = await padRef.current?.toBlob();

              setSavedSize(blob?.size ?? null);
            }}
            size="2xl"
          >
            Enregistrer la signature
          </Button>
          <Button
            onClick={() => padRef.current?.clear()}
            size="2xl"
            variant="outline"
          >
            Effacer
          </Button>
          {savedSize === null ? null : (
            <span className="text-muted-foreground-3 text-xs">
              PNG de {savedSize} octets
            </span>
          )}
        </div>
      </div>
    );
  },
};
