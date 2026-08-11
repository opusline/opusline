import { Field, FieldLabel } from "@opusline/ui/components/field";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@opusline/ui/components/segmented-control";

import {
  isThemePreference,
  THEME_LABELS,
  THEME_PREFERENCES,
  type ThemePreference,
} from "@/lib/theme";

type AppearanceSettingsProps = {
  theme: ThemePreference;
  onChange: (theme: ThemePreference) => void;
};

export function AppearanceSettings({
  theme,
  onChange,
}: AppearanceSettingsProps) {
  return (
    <div className="rounded-md border bg-card px-7 py-6.5">
      <div className="mb-1 font-heading font-semibold text-[17px] text-foreground-hi">
        Apparence
      </div>
      <p className="mb-5 text-muted-foreground-3 text-sm leading-relaxed">
        Le thème est enregistré sur votre compte : il vous suit d'un navigateur
        à l'autre.
      </p>

      <Field>
        <FieldLabel className="text-foreground-3" htmlFor="appearance-theme">
          Thème
        </FieldLabel>
        <SegmentedControl
          aria-label="Thème"
          className="max-w-96"
          id="appearance-theme"
          onValueChange={(value) => {
            const next = value[0];

            if (isThemePreference(next)) {
              onChange(next);
            }
          }}
          value={[theme]}
        >
          {THEME_PREFERENCES.map((preference) => (
            <SegmentedControlItem key={preference} value={preference}>
              {THEME_LABELS[preference]}
            </SegmentedControlItem>
          ))}
        </SegmentedControl>
      </Field>

      <p className="mt-2.5 text-muted-foreground-3 text-xs leading-relaxed">
        « Système » suit le réglage clair/sombre de votre appareil.
      </p>
    </div>
  );
}
