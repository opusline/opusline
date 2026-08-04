import type { Color } from "@opusline/api-client";

export const COLORS: Color[] = [0, 1, 2, 3, 4, 5, 6, 7];

export const COLOR_LABELS: Record<Color, string> = {
  0: "Ambre",
  1: "Terracotta",
  2: "Olive",
  3: "Sauge",
  4: "Ardoise",
  5: "Encre",
  6: "Prune",
  7: "Pierre",
};

export const COLOR_CLASSES: Record<Color, string> = {
  0: "bg-palette-amber",
  1: "bg-palette-terracotta",
  2: "bg-palette-olive",
  3: "bg-palette-sage",
  4: "bg-palette-slate",
  5: "bg-palette-indigo",
  6: "bg-palette-plum",
  7: "bg-palette-stone",
};

export const COLOR_WASH_CLASSES: Record<Color, string> = {
  0: "border-palette-amber/45 bg-palette-amber/15 text-primary-text",
  1: "border-palette-terracotta/45 bg-palette-terracotta/15 text-palette-terracotta",
  2: "border-palette-olive/45 bg-palette-olive/15 text-palette-olive",
  3: "border-palette-sage/45 bg-palette-sage/15 text-palette-sage",
  4: "border-palette-slate/45 bg-palette-slate/15 text-palette-slate",
  5: "border-palette-indigo/45 bg-palette-indigo/15 text-palette-indigo",
  6: "border-palette-plum/45 bg-palette-plum/15 text-palette-plum",
  7: "border-palette-stone/45 bg-palette-stone/15 text-palette-stone",
};
