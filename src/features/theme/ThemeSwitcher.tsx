"use client";

import { useEffect, useState } from "react";
import { THEMES } from "./theme.constants";

export const ThemeSwitcher = () => {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || THEMES.LIGHT;
    }
    return THEMES.LIGHT;
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        className="toggle toggle-sm"
        checked={theme === THEMES.DARK}
        onChange={toggleTheme}
        aria-label="Toggle theme"
      />
      <span className="text-lg">{theme === THEMES.LIGHT ? "☀️" : "🌙"}</span>
    </div>
  );
};
