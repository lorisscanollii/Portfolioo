"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "dark" | "light";

function readTheme(): Theme {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  // Sync with the theme applied by the inline script in layout.tsx and keep
  // every toggle instance in sync (desktop + mobile controls).
  useEffect(() => {
    setTheme(readTheme());
    const observer = new MutationObserver(() => setTheme(readTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const next: Theme = readTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    document.documentElement.style.colorScheme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // localStorage unavailable — theme still applies for this session.
    }
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
      title="Toggle color theme"
      className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:text-accent"
    >
      {theme === "light" ? (
        <Sun className="h-4.5 w-4.5" aria-hidden="true" />
      ) : (
        <Moon className="h-4.5 w-4.5" aria-hidden="true" />
      )}
    </button>
  );
}
