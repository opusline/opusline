import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  DARK_MEDIA_QUERY,
  type ResolvedTheme,
  readThemeCookie,
  resolveTheme,
  type ThemePreference,
  writeThemeCookie,
} from "@/lib/theme";

type ThemeProviderState = {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemePreference) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(
  undefined,
);

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: {
  children: ReactNode;
  defaultTheme?: ThemePreference;
}) {
  const [theme, setThemeState] = useState<ThemePreference>(
    () => readThemeCookie() ?? defaultTheme,
  );
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(theme, window.matchMedia(DARK_MEDIA_QUERY).matches),
  );

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia(DARK_MEDIA_QUERY);

    const apply = () => {
      const resolved = resolveTheme(theme, media.matches);

      setResolvedTheme(resolved);
      root.classList.remove("light", "dark");
      root.classList.add(resolved);
      root.style.colorScheme = resolved;
    };

    apply();

    if (theme !== "system") {
      return;
    }

    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, [theme]);

  const setTheme = useCallback((next: ThemePreference) => {
    writeThemeCookie(next);
    setThemeState(next);
  }, []);

  return (
    <ThemeProviderContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeProviderContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
