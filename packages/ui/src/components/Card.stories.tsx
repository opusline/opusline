import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

const meta = {
  title: "UI/Card",
  component: Card,
  tags: ["autodocs"],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>URSSAF · juillet</CardTitle>
        <CardDescription>Déclaration à envoyer avant le 31.</CardDescription>
      </CardHeader>
      <CardContent>Le CA encaissé du mois est prêt à être déclaré.</CardContent>
      <CardFooter>
        <Button>Préparer la déclaration</Button>
      </CardFooter>
    </Card>
  ),
};

export const Small: Story = {
  render: () => (
    <Card className="max-w-sm" size="sm">
      <CardHeader>
        <CardTitle>Provision TVA</CardTitle>
      </CardHeader>
      <CardContent>1 500 € mis de côté ce mois-ci.</CardContent>
    </Card>
  ),
};
