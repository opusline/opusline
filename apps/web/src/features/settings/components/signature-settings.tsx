import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import {
  SignaturePad,
  type SignaturePadHandle,
} from "@opusline/ui/components/signature-pad";
import { CircleAlert, PencilLine, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { PAPER } from "@/lib/paper";
import { m } from "@/paraglide/messages.js";
import { SettingsSection } from "./settings-section";

type SignatureSettingsProps = {
  hasSignature: boolean;
  signatureSrc: string;
  isPending: boolean;
  error: string | null;
  onSave: (signature: File) => Promise<boolean>;
  onRemove: () => void;
};

export function SignatureSettings({
  hasSignature,
  signatureSrc,
  isPending,
  error,
  onSave,
  onRemove,
}: SignatureSettingsProps) {
  const padRef = useRef<SignaturePadHandle>(null);
  const [isPadOpen, setIsPadOpen] = useState(!hasSignature);
  const [hasDrawing, setHasDrawing] = useState(false);

  const closePad = () => {
    setIsPadOpen(false);
    setHasDrawing(false);
  };

  const save = async () => {
    const blob = await padRef.current?.toBlob();

    if (!blob) {
      return;
    }

    const saved = await onSave(
      new File([blob], "signature.png", { type: "image/png" }),
    );

    if (saved) {
      closePad();
    }
  };

  return (
    <SettingsSection
      description={m.settings_signature_description()}
      title={m.settings_tab_signature_label()}
    >
      {error === null ? null : (
        <Alert className="mb-3.5" variant="warn">
          <CircleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {hasSignature && !isPadOpen ? (
        <div className="flex flex-wrap items-center gap-4 rounded-md border bg-muted px-4 py-3.5">
          <span
            className="flex h-15 w-40 shrink-0 items-center justify-center rounded-md border border-border-3 px-2"
            style={{ background: PAPER.sheet }}
          >
            <img
              alt={m.settings_signature_saved()}
              className="max-h-11 max-w-full object-contain"
              src={signatureSrc}
            />
          </span>
          <div className="min-w-40 flex-1">
            <div className="text-foreground-hi text-sm">
              {m.settings_signature_saved()}
            </div>
            <div className="mt-0.5 text-muted-foreground-3 text-xs leading-relaxed">
              {m.settings_signature_saved_hint()}
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              disabled={isPending}
              onClick={() => setIsPadOpen(true)}
              size="lg"
              variant="outline"
            >
              <PencilLine data-icon="inline-start" />
              {m.settings_signature_redo()}
            </Button>
            <Button
              disabled={isPending}
              onClick={onRemove}
              size="lg"
              variant="destructive"
            >
              <Trash2 data-icon="inline-start" />
              {m.settings_signature_delete()}
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <SignaturePad
            drawModeLabel={m.settings_signature_pad_draw_mode()}
            drawnLabel={m.settings_signature_pad_drawn()}
            label={m.settings_signature_pad_area()}
            modeToggleLabel={m.settings_signature_pad_mode_toggle()}
            placeholder={m.settings_signature_pad_placeholder()}
            typedLabel={m.settings_signature_pad_typed()}
            typeModeLabel={m.settings_signature_pad_type_mode()}
            typedPlaceholder={m.settings_signature_pad_typed_placeholder()}
            onDrawingChange={setHasDrawing}
            ref={padRef}
          />
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <Button
              disabled={!hasDrawing || isPending}
              onClick={() => void save()}
              size="2xl"
            >
              {m.settings_signature_save()}
            </Button>
            <Button
              disabled={!hasDrawing || isPending}
              onClick={() => {
                padRef.current?.clear();
                setHasDrawing(false);
              }}
              size="2xl"
              variant="outline"
            >
              {m.settings_signature_clear()}
            </Button>
            {hasSignature ? (
              <Button
                disabled={isPending}
                onClick={closePad}
                size="2xl"
                variant="ghost"
              >
                {m.common_cancel()}
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </SettingsSection>
  );
}
