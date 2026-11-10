import SectionHeading from "./SectionHeading";
import { about, siteConfig } from "@/data/portfolio";

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="border-t border-border py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading index="01" id="about-heading" title="About Me" />

        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

          <aside className="h-fit rounded-xl border border-border bg-card p-6">
            <h3 className="font-mono text-xs font-semibold uppercase tracking-widest text-accent">
              At a glance
            </h3>
            <dl className="mt-4 space-y-3.5 text-sm">
              {about.glance.map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-0.5 border-b border-border pb-3 last:border-b-0 last:pb-0"
                >
                  <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {item.label}
                  </dt>
                  <dd className="font-medium text-foreground">
                    {item.label === "Website" ? (
                      <a
                        href={siteConfig.url}
                        className="transition-colors hover:text-accent"
                        rel="noopener noreferrer"
                      >
                        {item.value}
                      </a>
                    ) : (
                      item.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </aside>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {about.roles.map((role) => (
            <article
              key={role.title}
              className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent/40"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-background text-accent">
                <role.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 font-semibold">{role.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {role.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
