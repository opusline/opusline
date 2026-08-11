import { Button } from "@opusline/ui/components/button";
import { Moon, Sun } from "lucide-react";

import type { ResolvedTheme, ThemePreference } from "@/lib/theme";

type ModeToggleProps = {
  resolvedTheme: ResolvedTheme;
  onChange: (theme: ThemePreference) => void;
};

export function ModeToggle({ resolvedTheme, onChange }: ModeToggleProps) {
  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Passer en thème clair" : "Passer en thème sombre";

  return (
    <Button
      aria-label={label}
      onClick={() => onChange(isDark ? "light" : "dark")}
      size="icon-xl"
      title={label}
      variant="outline"
    >
      {isDark ? <Moon /> : <Sun />}
    </Button>
  );
}
