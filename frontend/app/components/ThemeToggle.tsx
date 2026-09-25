"use client";

import { useEffect, useState } from "react";

const THEME_KEY = "parabolica-theme";

type ThemeMode = "dark" | "light";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_KEY);
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initialTheme: ThemeMode =
      stored === "light" || stored === "dark"
        ? stored
        : systemPrefersDark
          ? "dark"
          : "light";

    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-pressed={theme === "dark"}
      aria-label={`Switch to ${nextTheme} mode`}
      onClick={() => setTheme(nextTheme)}
    >
      <span className="theme-toggle__label">
        {theme === "dark" ? "Dark" : "Light"}
      </span>
      <span className="theme-toggle__track">
        <span className="theme-toggle__thumb" />
      </span>
    </button>
  );
}
