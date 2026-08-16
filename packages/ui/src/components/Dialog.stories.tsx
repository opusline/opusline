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
