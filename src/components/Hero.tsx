import { ArrowRight, Download, Mail } from "lucide-react";
import Terminal from "./Terminal";
import { siteConfig } from "@/data/portfolio";

export default function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      <div className="hero-grid absolute inset-0 -z-10" aria-hidden="true" />

      <div className="mx-auto grid max-w-6xl gap-14 px-4 pb-20 pt-14 sm:px-6 md:pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-12 lg:pb-28">
        {/* Introduction */}
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            <span
              className="status-dot h-2 w-2 rounded-full bg-accent"
              aria-hidden="true"
            />
            {siteConfig.availability.label}
          </p>

          <h1
            id="hero-heading"
            className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl"
          >
            {siteConfig.name}
          </h1>

          <p className="mt-3 font-mono text-lg text-accent sm:text-xl">
            {siteConfig.heroHeadline}
          </p>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Professional titles">
            {siteConfig.titles.map((title) => (
              <li
                key={title}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground"
              >
                {title}
              </li>
            ))}
          </ul>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            {siteConfig.heroSupport}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
            >
              View Projects
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/50 hover:text-accent"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              Contact
            </a>
            <a
              href={siteConfig.cvPath}
              download
              className="inline-flex items-center gap-2 rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download CV
            </a>
          </div>
        </div>

        {/* Interactive terminal */}
        <div role="region" aria-label="Interactive terminal — a technical overview of Loris Canolli">
          <Terminal />
        </div>
      </div>
    </section>
  );
}
