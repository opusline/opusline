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

/** Below `sm`, `md` and `lg` take the full width: 3/4 of a phone is too narrow for a form. */
export const FormOnAPhone: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: () => (
    <Sheet defaultOpen>
      <SheetTrigger
        render={<Button variant="outline">Formulaire (md)</Button>}
      />
      <SheetContent size="md">
        <SheetHeader>
          <SheetTitle size="lg">Ajouter une dépense</SheetTitle>
          <SheetDescription>Toute la largeur de l'écran.</SheetDescription>
        </SheetHeader>
        <SheetBody>
          <p className="text-muted-foreground-3 text-sm">
            Les champs du formulaire défilent ici.
          </p>
        </SheetBody>
        <SheetFooter className="flex-row justify-end">
          <SheetClose render={<Button variant="outline">Annuler</Button>} />
          <Button>Enregistrer</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

/**
 * `side="bottom"` is the phone's stand-in for a popover: it rises from the
 * bottom edge with rounded top corners, as tall as its content up to 85% of
 * the screen, and scrolls beyond that.
 */
export const BottomOnAPhone: Story = {
  globals: { viewport: { value: "mobile1", isRotated: false } },
  render: () => (
    <Sheet defaultOpen>
      <SheetTrigger render={<Button variant="outline">Ouvrir</Button>} />
      <SheetContent showCloseButton={false} side="bottom">
        <SheetHeader>
          <SheetTitle>Suivre quelle mission ?</SheetTitle>
          <SheetDescription>
            Les actions restent à portée de pouce.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button size="xl">Callisto front</Button>
          <SheetClose render={<Button variant="outline">Annuler</Button>} />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};
