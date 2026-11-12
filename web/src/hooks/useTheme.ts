import { useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "manka-theme";
const THEME_EVENT = "manka:theme";

export function getSavedTheme(): Theme | null {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === "light" || saved === "dark" ? saved : null;
}

const getInitialTheme = (): Theme =>
  getSavedTheme() ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const onChange = () => setTheme(getInitialTheme());
    window.addEventListener(THEME_EVENT, onChange);
    return () => window.removeEventListener(THEME_EVENT, onChange);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.setAttribute("data-theme", next);
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  return { theme, toggleTheme };
}
