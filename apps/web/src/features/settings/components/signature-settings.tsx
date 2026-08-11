import { Alert, AlertDescription } from "@opusline/ui/components/alert";
import { Button } from "@opusline/ui/components/button";
import {
  SignaturePad,
  type SignaturePadHandle,
} from "@opusline/ui/components/signature-pad";
import { CircleAlert, PencilLine, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

type SignatureSettingsProps = {
  hasSignature: boolean;
  signatureSrc: string;
  isPending: boolean;
  error: string | null;
  onSave: (signature: File) => void;
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

  const save = async () => {
    const blob = await padRef.current?.toBlob();

    if (!blob) {
      return;
    }

    onSave(new File([blob], "signature.png", { type: "image/png" }));
    setIsPadOpen(false);
    setHasDrawing(false);
  };

  const closePad = () => {
    setIsPadOpen(false);
    setHasDrawing(false);
  };

  return (
    <div className="rounded-md border bg-card px-7 py-6.5">
      <div className="mb-1 font-heading font-semibold text-[17px] text-foreground-hi">
        Signature
      </div>
      <p className="mb-5 text-muted-foreground-3 text-sm leading-relaxed">
        Signez une fois à la souris ou au trackpad. Opusline l'appose sur chaque
        CRA et chaque facture générés.
      </p>

      {error === null ? null : (
        <Alert className="mb-3.5" variant="warn">
          <CircleAlert />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {hasSignature && !isPadOpen ? (
        <div className="flex flex-wrap items-center gap-4 rounded-md border bg-muted px-4 py-3.5">
          <span className="flex h-15 w-40 shrink-0 items-center justify-center rounded-md border border-border-3 bg-[#FBFAF7] px-2">
            <img
              alt="Signature enregistrée"
              className="max-h-11 max-w-full object-contain"
              src={signatureSrc}
            />
          </span>
          <div className="min-w-40 flex-1">
            <div className="text-foreground-hi text-sm">
              Signature enregistrée
            </div>
            <div className="mt-0.5 text-muted-foreground-3 text-xs leading-relaxed">
              Apposée automatiquement sur les documents générés.
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
              Refaire
            </Button>
            <Button
              disabled={isPending}
              onClick={onRemove}
              size="lg"
              variant="destructive"
            >
              <Trash2 data-icon="inline-start" />
              Supprimer
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <SignaturePad onDrawingChange={setHasDrawing} ref={padRef} />
          <div className="mt-3.5 flex flex-wrap items-center gap-2">
            <Button
              disabled={!hasDrawing || isPending}
              onClick={() => void save()}
              size="2xl"
            >
              Enregistrer la signature
            </Button>
            <Button
              disabled={!hasDrawing}
              onClick={() => {
                padRef.current?.clear();
                setHasDrawing(false);
              }}
              size="2xl"
              variant="outline"
            >
              Effacer
            </Button>
            {hasSignature ? (
              <Button onClick={closePad} size="2xl" variant="ghost">
                Annuler
              </Button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
