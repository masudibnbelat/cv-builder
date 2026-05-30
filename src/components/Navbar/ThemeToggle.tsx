"use client";

import { useTheme } from "@/src/providers/ThemeProvider";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <button className="h-10 w-10 rounded-lg border border-(--color-active-border)" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className="
        flex h-10 w-10 items-center justify-center
        rounded-lg
        border border-(--color-active-border)
        bg-(--color-bg)
        text-(--color-text)
        transition-all
        hover:bg-(--color-active-bg)
      "
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
