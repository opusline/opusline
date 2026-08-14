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
        drawModeLabel="Draw"
        drawnLabel="Signature drawn"
        label="Signature area"
        modeToggleLabel="Signature method"
        placeholder="Draw your signature here"
        typedLabel="Name used as signature"
        typeModeLabel="Type instead"
        typedPlaceholder="Your name"
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
        drawModeLabel="Draw"
        drawnLabel="Signature drawn"
        label="Signature area"
        modeToggleLabel="Signature method"
        placeholder="Draw your signature here"
        typedLabel="Name used as signature"
        typeModeLabel="Type instead"
        typedPlaceholder="Your name"
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
          drawModeLabel="Draw"
          drawnLabel="Signature drawn"
          label="Signature area"
          modeToggleLabel="Signature method"
          placeholder="Draw your signature here"
          typedLabel="Name used as signature"
          typeModeLabel="Type instead"
          typedPlaceholder="Your name"
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
