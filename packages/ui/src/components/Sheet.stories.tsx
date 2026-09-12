import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

const meta = {
  title: "UI/Sheet",
  component: Sheet,
  tags: ["autodocs"],
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof Sheet>;

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger render={<Button variant="outline">Ouvrir</Button>} />
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Détail de la mission</SheetTitle>
          <SheetDescription>
            Panneau latéral pour l'édition rapide.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * `size` widens the panel from the ui component itself: a call-site
 * `sm:max-w-*` loses to the side-prefixed base rule and does nothing. `md` is
 * a form, `lg` a document to read; `SheetBody` scrolls between a fixed header
 * and footer.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex gap-3">
      <Sheet>
        <SheetTrigger
          render={<Button variant="outline">Formulaire (md)</Button>}
        />
        <SheetContent size="md">
          <SheetHeader>
            <SheetTitle size="lg">Ajouter une dépense</SheetTitle>
            <SheetDescription>
              Un panneau de 30 rem pour un formulaire.
            </SheetDescription>
          </SheetHeader>
          <SheetBody>
            <p className="text-muted-foreground-3 text-sm">
              Les champs du formulaire défilent ici, entre l'en-tête et le pied
              qui restent en place.
            </p>
          </SheetBody>
          <SheetFooter className="flex-row justify-end">
            <SheetClose render={<Button variant="outline">Annuler</Button>} />
            <Button>Enregistrer</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
      <Sheet>
        <SheetTrigger
          render={<Button variant="outline">Document (lg)</Button>}
        />
        <SheetContent size="lg">
          <SheetHeader>
            <SheetTitle>2042-C PRO · revenus 2026</SheetTitle>
            <SheetDescription>
              Un panneau de 35 rem pour lire un document.
            </SheetDescription>
          </SheetHeader>
          <SheetBody>
            <p className="text-muted-foreground-3 text-sm">
              Les tableaux et les figures à recopier ont la place de respirer.
            </p>
          </SheetBody>
        </SheetContent>
      </Sheet>
    </div>
  ),
};
