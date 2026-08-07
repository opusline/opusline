import { Button } from "@opusline/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@opusline/ui/components/dropdown-menu";
import { Moon, Sun } from "lucide-react";

import { type Theme, useTheme } from "./theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button aria-label="Changer de thème" size="icon" variant="ghost">
            <Sun className="size-4 dark:hidden" />
            <Moon className="hidden size-4 dark:block" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          onValueChange={(value) => setTheme(value as Theme)}
          value={theme}
        >
          <DropdownMenuRadioItem value="light">Clair</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Sombre</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">Système</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
