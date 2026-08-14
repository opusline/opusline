import { Swatch, SwatchGroup } from "@opusline/ui/components/swatch";
import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useState } from "react";

const PALETTE_TOKENS = [
  { token: "--palette-amber", label: "Ambre", className: "bg-palette-amber" },
  {
    token: "--palette-terracotta",
    label: "Terracotta",
    className: "bg-palette-terracotta",
  },
  { token: "--palette-olive", label: "Olive", className: "bg-palette-olive" },
  { token: "--palette-sage", label: "Sauge", className: "bg-palette-sage" },
  { token: "--palette-slate", label: "Ardoise", className: "bg-palette-slate" },
  { token: "--palette-indigo", label: "Encre", className: "bg-palette-indigo" },
  { token: "--palette-plum", label: "Prune", className: "bg-palette-plum" },
  { token: "--palette-stone", label: "Pierre", className: "bg-palette-stone" },
];

const TEXT_ROLE_TOKENS = [
  "--foreground",
  "--foreground-hi",
  "--foreground-2",
  "--foreground-3",
  "--foreground-4",
  "--muted-foreground",
  "--muted-foreground-2",
  "--muted-foreground-3",
  "--muted-foreground-4",
  "--muted-foreground-5",
  "--muted-foreground-6",
  "--muted-foreground-7",
  "--primary-text",
  "--primary-text-strong",
  "--primary-note",
  "--link",
  "--link-hover",
  "--success",
  "--destructive",
];

const AA_NORMAL_TEXT = 4.5;

function linearChannel(hexPair: string): number {
  const value = Number.parseInt(hexPair, 16) / 255;

  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number | null {
  const raw = hex.replace("#", "");

  if (raw.length !== 6 || Number.isNaN(Number.parseInt(raw, 16))) {
    return null;
  }

  return (
    0.2126 * linearChannel(raw.slice(0, 2)) +
    0.7152 * linearChannel(raw.slice(2, 4)) +
    0.0722 * linearChannel(raw.slice(4, 6))
  );
}

function contrastRatio(foreground: string, background: string): number | null {
  const foregroundLuminance = luminance(foreground);
  const backgroundLuminance = luminance(background);

  if (foregroundLuminance === null || backgroundLuminance === null) {
    return null;
  }

  const [higher, lower] = [foregroundLuminance, backgroundLuminance].sort(
    (a, b) => b - a,
  );

  return (higher + 0.05) / (lower + 0.05);
}

function readToken(token: string): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
}

/** The theme toolbar swaps a class on <html>, which no React state tracks. */
function useThemeVersion(): number {
  const [version, setVersion] = useState(0);

  useEffect(() => {
    const observer = new MutationObserver(() => setVersion((v) => v + 1));

    observer.observe(document.documentElement, { attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  return version;
}

function ContrastCell({ ratio }: { ratio: number | null }) {
  if (ratio === null) {
    return <span className="text-muted-foreground text-xs">non mesurable</span>;
  }

  const passes = ratio >= AA_NORMAL_TEXT;

  return (
    <span
      className={
        passes ? "text-success text-xs" : "font-medium text-destructive text-xs"
      }
    >
      {ratio.toFixed(2)}:1 {passes ? "AA" : "sous AA"}
    </span>
  );
}

function PaletteGrid() {
  useThemeVersion();

  const background = readToken("--background");

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <SwatchGroup aria-label="Couleurs d'identification">
        {PALETTE_TOKENS.map((color) => (
          <Swatch
            aria-label={color.label}
            className={color.className}
            key={color.token}
            title={color.label}
            value={color.token}
          />
        ))}
      </SwatchGroup>
      <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-x-4 gap-y-2">
        {PALETTE_TOKENS.map((color) => {
          const value = readToken(color.token);

          return (
            <div className="contents" key={color.token}>
              <Swatch
                aria-label={color.label}
                className={color.className}
                value={color.token}
              />
              <span className="text-foreground-2 text-sm">
                {color.label}
                <span className="ml-2 font-mono text-muted-foreground text-xs">
                  {color.token}
                </span>
              </span>
              <span className="font-mono text-muted-foreground text-xs">
                {value}
              </span>
              <ContrastCell ratio={contrastRatio(value, background)} />
            </div>
          );
        })}
      </div>
      <p className="text-muted-foreground text-xs">
        Contraste calculé contre le fond courant ({background}). Seuil WCAG AA
        texte : {AA_NORMAL_TEXT}:1.
      </p>
    </div>
  );
}

function TextRolesGrid() {
  useThemeVersion();

  const background = readToken("--background");

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-x-4 gap-y-2">
        {TEXT_ROLE_TOKENS.map((token) => {
          const value = readToken(token);

          return (
            <div className="contents" key={token}>
              <Swatch
                aria-label={token}
                style={{ backgroundColor: `var(${token})` }}
                value={token}
              />
              <span className="font-mono text-foreground-3 text-xs">
                {token}
              </span>
              <span className="font-mono text-muted-foreground text-xs">
                {value}
              </span>
              <ContrastCell ratio={contrastRatio(value, background)} />
            </div>
          );
        })}
      </div>
      <p className="text-muted-foreground text-xs">
        Contraste calculé contre le fond courant ({background}). Les paliers bas
        de l'échelle muted sont des teintes de retrait — ils passent sous AA à
        dessein.
      </p>
    </div>
  );
}

const meta = {
  title: "Tokens/Colors",
  component: PaletteGrid,
  tags: ["autodocs"],
} satisfies Meta<typeof PaletteGrid>;

export default meta;
type Story = StoryObj<typeof PaletteGrid>;

/** Les huit couleurs d'identification client/mission et leur contraste. */
export const Palette: Story = {};

/** L'échelle de premier plan et les accents, mesurés contre le fond. */
export const TextRoles: Story = {
  render: () => <TextRolesGrid />,
};
