import { Globe, Mail, MapPin } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import SectionHeading from "./SectionHeading";
import ContactForm from "./ContactForm";
import { siteConfig } from "@/data/portfolio";

const contactChannels = [
  {
    label: "Email",
    value: siteConfig.social.email,
    href: `mailto:${siteConfig.social.email}`,
    icon: Mail,
    external: false,
  },
  {
    label: "LinkedIn",
    value: siteConfig.social.linkedin.replace("https://", ""),
    href: siteConfig.social.linkedin,
    icon: LinkedinIcon,
    external: true,
  },
  {
    label: "GitHub",
    value: siteConfig.social.github.replace("https://", ""),
    href: siteConfig.social.github,
    icon: GithubIcon,
    external: true,
  },
];

export default function Contact() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="border-t border-border py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          index="06"
          id="contact-heading"
          title="Get in Touch"
          description="Have a technical problem to solve, a role to fill, or a project to discuss? The fastest way to reach me is by email — I'm also open to professional connections and collaboration."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            {contactChannels.map((channel) => (
              <a
                key={channel.label}
                href={channel.href}
                {...(channel.external
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent/40"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-background text-accent">
                  <channel.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-mono text-xs uppercase tracking-wider text-muted-foreground">
                    {channel.label}
                  </span>
                  <span className="mt-0.5 block text-sm font-medium text-foreground">
                    {channel.value}
                  </span>
                </span>
              </a>
            ))}

            <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-background text-accent">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Location
                </span>
                <span className="mt-0.5 block text-sm font-medium text-foreground">
                  {siteConfig.location}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-background text-accent">
                <Globe className="h-5 w-5" aria-hidden="true" />
              </span>
              <span>
                <span className="block font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  Website
                </span>
                <a
                  href={siteConfig.url}
                  className="mt-0.5 block text-sm font-medium text-foreground transition-colors hover:text-accent"
                  rel="noopener noreferrer"
                >
                  {siteConfig.domain}
                </a>
              </span>
            </div>
          </div>

          <ContactForm />
        </div>
      </div>
    </section>
  );
}
