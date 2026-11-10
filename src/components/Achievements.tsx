import { ArrowRight, Trophy } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { achievement } from "@/data/portfolio";

export default function Achievements() {
  return (
    <section
      id="achievements"
      aria-labelledby="achievements-heading"
      className="border-t border-border py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="06"
          id="achievements-heading"
          title="Achievements"
          description="Recognition for building technology that makes a difference."
        />

        <article className="relative overflow-hidden rounded-2xl border border-accent/30 bg-gradient-to-br from-accent/15 via-card to-card p-8 md:p-10">
          <span
            className="absolute right-6 top-6 font-mono text-xs font-semibold uppercase tracking-widest text-accent/70"
            aria-hidden="true"
          >
            # Winner
          </span>

          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10">
              <Trophy className="h-8 w-8 text-accent" aria-hidden="true" />
            </div>

            <div>
              <p className="font-mono text-sm font-semibold text-accent">
                {achievement.title} — {achievement.event}
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                {achievement.project}
              </h3>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
                {achievement.description}
              </p>

              <a
                href="#project-playground-life"
                className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-foreground"
              >
                View project details
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
