import { Button } from "@opusline/ui/components/button";
import { Play } from "lucide-react";

import { START_BUTTON } from "../lib/labels";

export type TimerStartButtonProps = {
  onClick: () => void;
};

export function TimerStartButton({ onClick }: TimerStartButtonProps) {
  return (
    <Button
      className="bg-card-2"
      onClick={onClick}
      size="2xl"
      variant="outline"
    >
      <Play aria-hidden className="size-3 fill-current" />
      {START_BUTTON}
    </Button>
  );
}
