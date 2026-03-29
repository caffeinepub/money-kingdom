import { useEffect, useState } from "react";

const STORAGE_KEY = "mk_dark_mode";

function getStored(): boolean {
  return localStorage.getItem(STORAGE_KEY) === "true";
}

function applyDark(dark: boolean) {
  if (dark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    const stored = getStored();
    applyDark(stored);
    return stored;
  });

  useEffect(() => {
    applyDark(dark);
    localStorage.setItem(STORAGE_KEY, String(dark));
  }, [dark]);

  const toggle = () => setDark((d) => !d);

  return { dark, toggle, setDark };
}
