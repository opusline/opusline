import { Button } from "@opusline/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@opusline/ui/components/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import {
  isThemePreference,
  type ResolvedTheme,
  THEME_PREFERENCES,
  type ThemePreference,
  themeLabel,
} from "@/lib/theme";
import { m } from "@/paraglide/messages.js";

type ModeToggleProps = {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  onChange: (theme: ThemePreference) => void;
};

/**
 * A menu rather than a two-state switch: « Système » must stay reachable, and
 * a toggle that only emits light/dark would strand the account on an explicit
 * theme forever.
 */
export function ModeToggle({
  theme,
  resolvedTheme,
  onChange,
}: ModeToggleProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            aria-label={m.theme_choose()}
            size="icon-xl"
            title={m.theme_choose()}
            variant="outline"
          >
            {resolvedTheme === "dark" ? <Moon /> : <Sun />}
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          onValueChange={(value) => {
            if (isThemePreference(value)) {
              onChange(value);
            }
          }}
          value={theme}
        >
          {THEME_PREFERENCES.map((preference) => (
            <DropdownMenuRadioItem key={preference} value={preference}>
              {themeLabel(preference)}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
