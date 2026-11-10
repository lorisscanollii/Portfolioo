"use client";

import { useEffect, useState } from "react";
import { Download, Menu, X } from "lucide-react";
import { navLinks, siteConfig } from "@/data/portfolio";
import ThemeToggle from "./ThemeToggle";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  // Highlight the nav link of the section currently in view.
  useEffect(() => {
    const ids = ["home", ...navLinks.map((link) => link.href.slice(1))];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`);
          }
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu with the Escape key.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <nav
        className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
        aria-label="Main navigation"
      >
        <a href="#home" className="group flex items-center gap-2.5">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-card font-mono text-sm font-semibold text-accent"
            aria-hidden="true"
          >
            &gt;_
          </span>
          <span className="font-mono text-sm font-medium tracking-tight text-foreground">
            {siteConfig.domain}
          </span>
        </a>

        {/* Desktop navigation */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={
                  activeSection === link.href ? "true" : undefined
                }
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  activeSection === link.href
                    ? "text-accent"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <ThemeToggle />
          <a
            href={siteConfig.cvPath}
            download
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:border-accent/50 hover:text-accent"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Download CV
          </a>
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-foreground"
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile navigation panel */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-border bg-background lg:hidden"
        >
          <ul className="mx-auto max-w-6xl space-y-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "block rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                    activeSection === link.href
                      ? "bg-accent/10 text-accent"
                      : "text-muted-foreground hover:bg-card hover:text-foreground",
                  )}
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="border-t border-border pt-3">
              <a
                href={siteConfig.cvPath}
                download
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-accent"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Download CV
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
