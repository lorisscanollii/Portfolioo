import { Check } from "lucide-react";
import SectionHeading from "./SectionHeading";
import { experience } from "@/data/portfolio";

export default function Experience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-heading"
      className="border-t border-border py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="02"
          id="experience-heading"
          title="Professional Experience"
          description={experience.intro}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {experience.areas.map((area) => (
            <article
              key={area.id}
              className="flex flex-col rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-background text-accent">
                  <area.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="font-semibold">{area.title}</h3>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                {area.summary}
              </p>

              <ul className="mt-5 space-y-2.5 border-t border-border pt-5">
                {area.responsibilities.map((responsibility) => (
                  <li
                    key={responsibility}
                    className="flex items-start gap-2.5 text-sm text-foreground"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                      aria-hidden="true"
                    />
                    {responsibility}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
