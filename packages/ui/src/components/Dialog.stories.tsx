import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

const meta = {
  title: "UI/Dialog",
  component: Dialog,
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof Dialog>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger
        render={<Button variant="outline">Supprimer le client</Button>}
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Supprimer Nordlys ?</DialogTitle>
          <DialogDescription>
            Cette action est définitive. Un client qui a encore des missions ne
            peut pas être supprimé — archivez-le plutôt.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Annuler</Button>} />
          <Button variant="destructive">Supprimer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const LargeTitle: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger
        render={<Button variant="outline">Importer un relevé</Button>}
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle size="lg">Importer un relevé</DialogTitle>
          <DialogDescription>
            Le titre en grand pour les dialogues de premier plan — formulaires
            et imports — où le corps du texte est lui aussi plus grand.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Annuler</Button>} />
          <Button>Analyser le relevé</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * A dialog taller than the screen scrolls inside itself: it is centred, so
 * anything past the edges of a phone would otherwise be out of reach.
 */
export const TallOnAPhone: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: () => (
    <Dialog defaultOpen>
      <DialogTrigger render={<Button variant="outline">Ouvrir</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une facture</DialogTitle>
          <DialogDescription>
            Le contenu défile dans la boîte de dialogue.
          </DialogDescription>
        </DialogHeader>
        {Array.from({ length: 14 }, (_, index) => `Ligne ${index + 1}`).map(
          (line) => (
            <p className="rounded-md border px-3 py-4 text-sm" key={line}>
              {line}
            </p>
          ),
        )}
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Annuler</Button>} />
          <Button>Enregistrer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
