import type { UserData } from "@opusline/api-client";
import {
  currentUserQueryKey,
  updateUserThemeMutation,
} from "@opusline/api-client/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { useTheme } from "@/components/theme-provider";
import {
  preferenceFromTheme,
  type ThemePreference,
  themeFromPreference,
} from "@/lib/theme";

export function useThemeSync(user: UserData): void {
  const { setTheme } = useTheme();
  const preference = preferenceFromTheme(user.theme);

  useEffect(() => {
    setTheme(preference);
  }, [preference, setTheme]);
}

export function useThemeControl() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const queryClient = useQueryClient();

  const updateTheme = useMutation({
    ...updateUserThemeMutation(),
    onSuccess: (user) => {
      queryClient.setQueryData(currentUserQueryKey(), user);
    },
  });

  return {
    theme,
    resolvedTheme,
    setTheme: (next: ThemePreference) => {
      const previous = theme;

      setTheme(next);
      updateTheme.mutate(
        { body: { theme: themeFromPreference(next) } },
        { onError: () => setTheme(previous) },
      );
    },
  };
}
