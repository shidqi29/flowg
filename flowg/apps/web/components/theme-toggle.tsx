"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  // Sync initial state from <html> class or system preference
  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("flowg-theme");

    if (
      stored === "dark" ||
      (!stored && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      root.classList.add("dark");
      setDark(true);
    }
  }, []);

  const toggle = () => {
    const root = document.documentElement;
    const next = !dark;
    root.classList.toggle("dark", next);
    localStorage.setItem("flowg-theme", next ? "dark" : "light");
    setDark(next);
  };

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative inline-flex items-center justify-center size-8 rounded-md border border-border bg-background hover:bg-muted transition-colors cursor-pointer">
      <Sun className="size-4 rotate-0 scale-100 transition-transform dark:rotate-90 dark:scale-0" />
      <Moon className="absolute size-4 rotate-90 scale-0 transition-transform dark:rotate-0 dark:scale-100" />
    </button>
  );
}
