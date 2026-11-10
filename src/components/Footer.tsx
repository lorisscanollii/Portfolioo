import { ChevronUp, Globe, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./BrandIcons";
import CopyrightYear from "./CopyrightYear";
import { navLinks, siteConfig } from "@/data/portfolio";

const socialLinks = [
  { label: "GitHub", href: siteConfig.social.github, icon: GithubIcon },
  { label: "LinkedIn", href: siteConfig.social.linkedin, icon: LinkedinIcon },
  { label: "Email", href: `mailto:${siteConfig.social.email}`, icon: Mail },
  { label: "Website", href: siteConfig.url, icon: Globe },
];

export default function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <a href="#home" className="flex items-center gap-2.5">
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
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {siteConfig.footerBlurb}
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Sections
            </h2>
            <ul className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-accent"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Elsewhere
            </h2>
            <ul className="mt-3 flex gap-2">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    {...(social.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                    aria-label={social.label}
                    title={social.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-accent/50 hover:text-accent"
                  >
                    <social.icon className="h-4.5 w-4.5" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            © <CopyrightYear /> {siteConfig.name}. All rights reserved.
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Built with Next.js · TypeScript · Tailwind CSS
          </p>
          <a
            href="#home"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-accent"
          >
            Back to top
            <ChevronUp className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
