import { Button } from "@opusline/ui/components/button";
import { Play } from "lucide-react";

import { START_BUTTON } from "../lib/labels";

export type TimerStartButtonProps = {
  onClick: () => void;
};

export function TimerStartButton({ onClick }: TimerStartButtonProps) {
  return (
    <Button onClick={onClick} size="2xl" surface="raised" variant="outline">
      <Play aria-hidden className="size-3 fill-current" />
      {START_BUTTON}
    </Button>
  );
}
