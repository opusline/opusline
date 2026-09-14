import type { Color } from "@opusline/api-client";

import { m } from "@/paraglide/messages.js";

export const COLORS: Color[] = [0, 1, 2, 3, 4, 5, 6, 7];

const COLOR_MESSAGES: Record<Color, () => string> = {
  0: m.color_amber,
  1: m.color_terracotta,
  2: m.color_olive,
  3: m.color_sage,
  4: m.color_slate,
  5: m.color_ink,
  6: m.color_plum,
  7: m.color_stone,
};

export function colorLabel(color: Color): string {
  return COLOR_MESSAGES[color]();
}

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

/**
 * The identification colour as a surface, never as running text: the palette
 * hues are deliberately desaturated, and four of the eight land under 4.5:1 when
 * painted as text on their own 15 % wash. The foreground stays the text role, so
 * every client reads the same whatever colour identifies it.
 */
export const COLOR_WASH_CLASSES: Record<Color, string> = {
  0: "border-palette-amber/45 bg-palette-amber/15 text-foreground-2",
  1: "border-palette-terracotta/45 bg-palette-terracotta/15 text-foreground-2",
  2: "border-palette-olive/45 bg-palette-olive/15 text-foreground-2",
  3: "border-palette-sage/45 bg-palette-sage/15 text-foreground-2",
  4: "border-palette-slate/45 bg-palette-slate/15 text-foreground-2",
  5: "border-palette-indigo/45 bg-palette-indigo/15 text-foreground-2",
  6: "border-palette-plum/45 bg-palette-plum/15 text-foreground-2",
  7: "border-palette-stone/45 bg-palette-stone/15 text-foreground-2",
};
