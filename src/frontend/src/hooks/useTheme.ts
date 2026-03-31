import { useState } from "react";

export type ThemeName = "royal-gold" | "night-black" | "diamond-silver";

const THEME_KEY = "mk_theme";

const NIGHT_BLACK_TOKENS: Record<string, string> = {
  "--background": "0.12 0.02 40",
  "--foreground": "0.95 0.02 60",
  "--card": "0.16 0.02 40",
  "--card-foreground": "0.95 0.02 60",
  "--popover": "0.16 0.02 40",
  "--popover-foreground": "0.95 0.02 60",
  "--primary": "0.72 0.12 66",
  "--muted": "0.22 0.02 40",
  "--muted-foreground": "0.65 0.05 55",
  "--border": "0.28 0.03 45",
  "--input": "0.28 0.03 45",
  "--ring": "0.72 0.12 66",
};

const DIAMOND_SILVER_TOKENS: Record<string, string> = {
  "--background": "0.97 0.005 240",
  "--foreground": "0.15 0.02 240",
  "--card": "1 0 0",
  "--card-foreground": "0.15 0.02 240",
  "--popover": "1 0 0",
  "--popover-foreground": "0.15 0.02 240",
  "--primary": "0.52 0.18 240",
  "--muted": "0.93 0.01 240",
  "--muted-foreground": "0.45 0.04 240",
  "--border": "0.88 0.01 240",
  "--input": "0.88 0.01 240",
  "--ring": "0.52 0.18 240",
};

const ALL_CUSTOM_KEYS = [
  ...new Set([
    ...Object.keys(NIGHT_BLACK_TOKENS),
    ...Object.keys(DIAMOND_SILVER_TOKENS),
  ]),
];

export function applyTheme(theme: ThemeName) {
  const el = document.documentElement;
  // Clear all custom overrides first
  for (const key of ALL_CUSTOM_KEYS) {
    el.style.removeProperty(key);
  }
  if (theme === "night-black") {
    for (const [key, value] of Object.entries(NIGHT_BLACK_TOKENS)) {
      el.style.setProperty(key, value);
    }
  } else if (theme === "diamond-silver") {
    for (const [key, value] of Object.entries(DIAMOND_SILVER_TOKENS)) {
      el.style.setProperty(key, value);
    }
  }
  // royal-gold: keep defaults, no overrides needed
}

export function useTheme() {
  // Apply saved theme synchronously during initialization
  const [theme, setThemeState] = useState<ThemeName>(() => {
    const saved =
      (localStorage.getItem(THEME_KEY) as ThemeName) ?? "royal-gold";
    applyTheme(saved);
    return saved;
  });

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    localStorage.setItem(THEME_KEY, t);
    applyTheme(t);
  };

  return { theme, setTheme };
}
