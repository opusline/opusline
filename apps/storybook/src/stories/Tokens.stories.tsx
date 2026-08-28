import { Swatch, SwatchGroup } from "@opusline/ui/components/swatch";
import type { Meta, StoryObj } from "@storybook/react";
import { useEffect, useRef, useState } from "react";

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

/** Every surface a foreground token is actually painted on. */
const SURFACE_TOKENS = [
  "--background",
  "--card",
  "--muted",
  "--secondary",
  "--accent",
] as const;

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
  "--primary-text",
  "--primary-text-strong",
  "--primary-note",
  "--link",
  "--link-hover",
  "--success",
  "--destructive",
] as const;

/**
 * Pairs whose background is a fill rather than a page surface — the default
 * Button, the brand Badge, the pressed segment.
 */
const FILL_PAIRS = [
  { foreground: "--primary-foreground", background: "--primary" },
  { foreground: "--secondary-foreground", background: "--secondary" },
  { foreground: "--accent-foreground", background: "--accent" },
  { foreground: "--card-foreground", background: "--card" },
] as const;

const AA_NORMAL_TEXT = 4.5;

/**
 * SC 1.4.11: a control's boundary is "visual information required to identify"
 * it, and needs 3:1. axe-core ships no rule for it.
 */
const AA_NON_TEXT = 3;

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

type TokenReader = (token: string) => string;

/**
 * Reads tokens as resolved inside `element`, so a `.light` and a `.dark`
 * subtree can be measured on the same page. `getComputedStyle` on the root
 * would only ever answer for whichever theme the toolbar is showing.
 */
function readerFor(element: HTMLElement | null): TokenReader {
  return (token) =>
    element === null
      ? ""
      : getComputedStyle(element).getPropertyValue(token).trim();
}

/** Rendering happens before the ref is attached, so the first pass reads nothing. */
function useMeasuredRef(): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => setReady(true), []);

  return [ref, ready];
}

function Ratio({
  ratio,
  threshold,
}: {
  ratio: number | null;
  threshold: number;
}) {
  if (ratio === null) {
    return <span className="text-muted-foreground-2 text-xs">—</span>;
  }

  const passes = ratio >= threshold;

  return (
    <span
      className={
        passes
          ? "text-success text-xs tabular-nums"
          : "font-medium text-destructive text-xs tabular-nums"
      }
    >
      {ratio.toFixed(2)}
    </span>
  );
}

function PairsTable({ read }: { read: TokenReader }) {
  const surfaces = SURFACE_TOKENS.map((token) => ({
    token,
    value: read(token),
  }));

  return (
    <table className="w-full border-collapse text-left">
      <thead>
        <tr>
          <th className="pb-2 pr-3 font-medium text-foreground-2 text-xs">
            Premier plan
          </th>
          {surfaces.map((surface) => (
            <th
              className="pb-2 pr-3 font-mono font-normal text-muted-foreground-2 text-xs"
              key={surface.token}
              scope="col"
            >
              {surface.token.replace("--", "")}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {TEXT_ROLE_TOKENS.map((token) => {
          const value = read(token);

          return (
            <tr key={token}>
              <th
                className="py-1 pr-3 font-mono font-normal text-foreground-3 text-xs"
                scope="row"
              >
                {token.replace("--", "")}
              </th>
              {surfaces.map((surface) => (
                <td className="py-1 pr-3" key={surface.token}>
                  <Ratio
                    ratio={contrastRatio(value, surface.value)}
                    threshold={AA_NORMAL_TEXT}
                  />
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function FillsTable({ read }: { read: TokenReader }) {
  return (
    <table className="w-full border-collapse text-left">
      <tbody>
        {FILL_PAIRS.map((pair) => (
          <tr key={pair.foreground}>
            <th
              className="py-1 pr-3 font-mono font-normal text-foreground-3 text-xs"
              scope="row"
            >
              {pair.foreground.replace("--", "")} sur{" "}
              {pair.background.replace("--", "")}
            </th>
            <td className="py-1">
              <Ratio
                ratio={contrastRatio(
                  read(pair.foreground),
                  read(pair.background),
                )}
                threshold={AA_NORMAL_TEXT}
              />
            </td>
          </tr>
        ))}
        <tr>
          <th
            className="py-1 pr-3 font-mono font-normal text-foreground-3 text-xs"
            scope="row"
          >
            input sur background (SC 1.4.11)
          </th>
          <td className="py-1">
            <Ratio
              ratio={contrastRatio(read("--input"), read("--background"))}
              threshold={AA_NON_TEXT}
            />
          </td>
        </tr>
        <tr>
          <th
            className="py-1 pr-3 font-mono font-normal text-foreground-3 text-xs"
            scope="row"
          >
            input sur muted (SC 1.4.11)
          </th>
          <td className="py-1">
            <Ratio
              ratio={contrastRatio(read("--input"), read("--muted"))}
              threshold={AA_NON_TEXT}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
}

function ThemeColumn({ theme }: { theme: "light" | "dark" }) {
  const [ref, ready] = useMeasuredRef();
  const read = readerFor(ready ? ref.current : null);

  return (
    <div className={theme}>
      <div
        className="flex flex-col gap-4 rounded-md border bg-background p-4"
        ref={ref}
      >
        <h3 className="font-medium text-foreground-hi text-sm">
          {theme === "light" ? "Clair" : "Sombre"}
        </h3>
        <PairsTable read={read} />
        <FillsTable read={read} />
      </div>
    </div>
  );
}

/** Both palettes at once: the failures are never in the one you are looking at. */
function ContrastMatrix() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <ThemeColumn theme="light" />
        <ThemeColumn theme="dark" />
      </div>
      <p className="max-w-2xl text-muted-foreground-2 text-xs">
        Seuil AA texte : {AA_NORMAL_TEXT}:1 — {AA_NON_TEXT}:1 pour la bordure
        d'un champ (SC 1.4.11), que axe-core ne sait pas mesurer. Un chiffre en
        rouge est un bug, pas un choix : toute paire listée ici est réellement
        peinte quelque part dans l'app.
      </p>
    </div>
  );
}

function PaletteGrid() {
  const [ref, ready] = useMeasuredRef();
  const read = readerFor(ready ? ref.current : null);
  const background = read("--background");

  return (
    <div className="flex max-w-xl flex-col gap-6" ref={ref}>
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
          const value = read(color.token);

          return (
            <div className="contents" key={color.token}>
              <Swatch
                aria-label={color.label}
                className={color.className}
                value={color.token}
              />
              <span className="text-foreground-2 text-sm">
                {color.label}
                <span className="ml-2 font-mono text-muted-foreground-2 text-xs">
                  {color.token}
                </span>
              </span>
              <span className="font-mono text-muted-foreground-2 text-xs">
                {value}
              </span>
              <Ratio
                ratio={contrastRatio(value, background)}
                threshold={AA_NORMAL_TEXT}
              />
            </div>
          );
        })}
      </div>
      <p className="text-muted-foreground-2 text-xs">
        Ces huit teintes identifient un client ou une mission : elles sont
        portées en pastille et en filet, jamais en texte courant.
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

/** Chaque premier plan contre chaque surface, dans les deux thèmes. */
export const Contrast: Story = {
  render: () => <ContrastMatrix />,
};
