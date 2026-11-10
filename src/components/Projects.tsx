import { Check, ExternalLink, Server, Trophy } from "lucide-react";
import { GithubIcon } from "./BrandIcons";
import ProjectVisual from "./ProjectVisual";
import SectionHeading from "./SectionHeading";
import StatusBadge from "./StatusBadge";
import { projects } from "@/data/portfolio";

const projectVisuals: Record<string, "playground" | "college"> = {
  "playground-life": "playground",
  "college-tv-display": "college",
};

function TechList({ technologies }: { technologies: string[] }) {
  if (technologies.length === 0) return null;
  return (
    <ul className="mt-6 flex flex-wrap gap-2" aria-label="Technologies">
      {technologies.map((technology) => (
        <li
          key={technology}
          className="rounded-md border border-border bg-background px-2.5 py-1 font-mono text-xs text-muted-foreground"
        >
          {technology}
        </li>
      ))}
    </ul>
  );
}

function HighlightList({
  label,
  items,
}: {
  label: string;
  items: string[];
}) {
  return (
    <div>
      <h4 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </h4>
      <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex items-start gap-2.5 text-sm text-foreground"
          >
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-accent"
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Projects() {
  const featured = projects.find((project) => project.featured) ?? projects[0];
  const rest = projects.filter((project) => project.id !== featured.id);

  return (
    <section
      id="projects"
      aria-labelledby="projects-heading"
      className="border-t border-border py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="05"
          id="projects-heading"
          title="Featured Projects"
          description="A selection of applications I have designed, built, and deployed — from a production finance platform running on my own server infrastructure to award-winning educational software."
        />

        {/* Featured project */}
        <article
          id={`project-${featured.id}`}
          className="rounded-xl border border-accent/30 bg-card p-6 md:p-8"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-sm text-muted-foreground">
              {featured.number}
            </span>
            <StatusBadge status={featured.status} label={featured.statusLabel} />
            <span className="font-mono text-xs text-muted-foreground">
              {featured.category}
            </span>
          </div>

          <div className="mt-3 grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight md:text-3xl">
                {featured.name}
              </h3>

              <p className="mt-4 max-w-3xl leading-relaxed text-muted-foreground">
                {featured.description}
              </p>

              <div className="mt-6">
                <HighlightList
                  label={featured.highlightsLabel}
                  items={featured.highlights}
                />
              </div>

              <TechList technologies={featured.technologies} />

              {featured.note && (
                <p className="mt-6 flex items-start gap-2.5 rounded-lg border border-accent/25 bg-accent/5 px-4 py-3 text-sm text-foreground">
                  <Server
                    className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                    aria-hidden="true"
                  />
                  {featured.note}
                </p>
              )}

              {featured.links.live && (
                <div className="mt-6 border-t border-border pt-5">
                  <a
                    href={featured.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-emerald-950 transition-colors hover:bg-emerald-400"
                  >
                    Visit Live Application
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    <span className="sr-only">
                      (opens {featured.links.live} in a new tab)
                    </span>
                  </a>
                </div>
              )}
            </div>

            <ProjectVisual
              variant="finora"
              size="featured"
              className="lg:sticky lg:top-24"
            />
          </div>
        </article>

        {/* Remaining projects */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {rest.map((project) => {
            const visual = projectVisuals[project.id];

            return (
              <article
                key={project.id}
                id={`project-${project.id}`}
                className="flex flex-col rounded-xl border border-border bg-card p-6"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-sm text-muted-foreground">
                    {project.number}
                  </span>
                  <StatusBadge status={project.status} label={project.statusLabel} />
                </div>

                <h3 className="mt-3 text-xl font-semibold tracking-tight">
                  {project.name}
                </h3>
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  {project.category}
                </p>

                {visual && (
                  <ProjectVisual variant={visual} className="mt-4" />
                )}

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>

                {project.achievement && (
                  <p className="mt-4 flex items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3.5 py-2.5 text-sm font-medium text-accent">
                    <Trophy className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {project.achievement}
                  </p>
                )}

                <div className="mt-5">
                  <HighlightList
                    label={project.highlightsLabel}
                    items={project.highlights}
                  />
                </div>

                <div className="mt-auto">
                  <TechList technologies={project.technologies} />
                  {project.links.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-foreground"
                    >
                      Visit application
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                  )}
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent transition-colors hover:text-foreground"
                    >
                      View source
                      <GithubIcon className="h-4 w-4" aria-hidden="true" />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
