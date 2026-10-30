import type { ThemeId } from "./types";

export interface ThemeMeta {
  id: ThemeId;
  name: string;
  blurb: string;
}

export const THEMES: ThemeMeta[] = [
  {
    id: "midnight",
    name: "Midnight",
    blurb: "Deep forest dark with mint signal.",
  },
  {
    id: "soft-buds",
    name: "Soft buds",
    blurb: "Misty greens, warmer glow.",
  },
  {
    id: "signal",
    name: "Signal",
    blurb: "High-contrast amber on ink.",
  },
];
