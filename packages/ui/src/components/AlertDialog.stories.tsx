import type { Meta, StoryObj } from "@storybook/react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./alert-dialog";
import { Button } from "./button";

const meta = {
  title: "UI/AlertDialog",
  component: AlertDialog,
  tags: ["autodocs"],
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof AlertDialog>;

export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" />}>
        Régénérer les codes
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Régénérer les codes de secours ?</AlertDialogTitle>
          <AlertDialogDescription>
            Les huit codes actuels cesseront de fonctionner. Notez les nouveaux
            codes dès qu'ils s'affichent.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction>Régénérer</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const Destructive: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="destructive" />}>
        Désactiver
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Désactiver l'application d'authentification ?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Votre mot de passe suffira de nouveau pour vous connecter. Les codes
            de secours et les navigateurs de confiance seront oubliés.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            render={<Button size="2xl" variant="destructive" />}
          >
            Désactiver
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
