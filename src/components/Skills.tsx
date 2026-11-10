import { Terminal } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { skills, toolchain } from "@/data/portfolio";

export default function Skills() {
  return (
    <section
      id="skills"
      aria-labelledby="skills-heading"
      className="border-t border-border py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="03"
          id="skills-heading"
          title="Technical Skills"
          description="The technologies and systems I work with, grouped by discipline — no invented percentages, just the tools I actually use."
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((category) => (
            <article
              key={category.category}
              className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/40"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-background text-accent">
                  <category.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="font-semibold">{category.category}</h3>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-border bg-background px-2.5 py-1 font-mono text-xs text-muted-foreground"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-6 rounded-xl border border-dashed border-border bg-card/50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <p className="flex shrink-0 items-center gap-2 font-mono text-sm font-medium text-accent">
              <Terminal className="h-4 w-4" aria-hidden="true" />
              Daily toolchain
            </p>
            <ul className="flex flex-wrap gap-2">
              {toolchain.map((tool) => (
                <li
                  key={tool}
                  className="rounded-md border border-border bg-background px-2.5 py-1 font-mono text-xs text-muted-foreground"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
