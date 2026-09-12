import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { Toaster, ToastProvider, useToast } from "./toast";

function Demo() {
  const toast = useToast();

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        onClick={() => toast.add({ title: "Dépense ajoutée", tone: "success" })}
        variant="outline"
      >
        Succès
      </Button>
      <Button
        onClick={() =>
          toast.add({
            title: "Notion Plus résilié au 9 septembre",
            description: "Les dépenses passées sont conservées.",
            tone: "primary",
            action: { label: "Annuler", onClick: () => {} },
          })
        }
        variant="outline"
      >
        Avec annulation
      </Button>
      <Button
        onClick={() =>
          toast.add({
            title: "Déposez un PDF sur chaque ligne sélectionnée",
          })
        }
        variant="outline"
      >
        Neutre
      </Button>
    </div>
  );
}

const meta = {
  title: "UI/Toast",
  component: Toaster,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
        <Toaster />
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof Toaster>;

/**
 * A toast is a transient confirmation, with at most one undo-style action;
 * anything the user must still act on is an Alert. The viewport sits bottom
 * left, pauses its timer on hover and closes on Escape.
 */
export const Default: Story = {
  render: () => <Demo />,
};
