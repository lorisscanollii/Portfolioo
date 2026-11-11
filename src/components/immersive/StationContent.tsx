"use client";

import {
  ArrowRight,
  ArrowUpRight,
  Braces,
  ChevronRight,
  Download,
  Headset,
  Mail,
  MapPin,
  Puzzle,
  Server,
  Terminal,
  Trophy,
} from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import StatusBadge from "@/components/StatusBadge";
import {
  about,
  aboutArtifacts,
  achievement,
  experience,
  experienceObjects,
  infrastructure,
  projects,
  siteConfig,
  skillDetails,
  skills,
  toolchain,
  type StationId,
} from "@/data/portfolio";
import {
  getExperienceDetail,
  getSkillDetail,
  type WorldSelection,
} from "@/lib/world";

interface StationContentProps {
  station: StationId;
  onNavigate: (station: StationId) => void;
  onSelect: (selection: WorldSelection) => void;
  reduced: boolean;
}

const aboutIcons = {
  infrastructure: Server,
  support: Headset,
  development: Braces,
  "problem-solving": Puzzle,
} as const;

const areaObjectIds: Record<string, string> = {
  "it-support": "support-desk",
  "it-administration": "server-core",
  networking: "network-spine",
};

function StationHeader({
  index,
  label,
  kicker,
  title,
  lede,
}: {
  index: string;
  label: string;
  kicker: string;
  title: string;
  lede?: string;
}) {
  return (
    <>
      <p className="world-kicker">
        <span>{index}</span>
        <span className="world-kicker-divider" aria-hidden="true">
          /
        </span>
        <span>{label}</span>
        <span className="world-kicker-divider" aria-hidden="true">
          ·
        </span>
        <span className="world-kicker-muted">{kicker}</span>
      </p>
      <h1 id="station-heading" tabIndex={-1} className="world-title">
        {title}
      </h1>
      {lede && <p className="world-lede">{lede}</p>}
    </>
  );
}

function HomeContent({
  onNavigate,
}: {
  onNavigate: (station: StationId) => void;
}) {
  return (
    <div className="world-home">
      <p className="world-status-line">
        <span className="status-dot" aria-hidden="true" />
        {siteConfig.availability.label}
        <span className="world-status-separator" aria-hidden="true">
          ·
        </span>
        {siteConfig.location}
      </p>

      <h1 id="station-heading" tabIndex={-1} className="world-hero-title">
        <span>LORIS</span>
        <span>CANOLLI</span>
      </h1>

      <p className="world-role-line">
        <span>IT Support Specialist</span>
        <span className="world-role-divider" aria-hidden="true">
          /
        </span>
        <span>IT Administrator</span>
        <span className="world-role-divider" aria-hidden="true">
          /
        </span>
        <span>Full-Stack Developer</span>
      </p>

      <p className="world-lead world-lead-home">{siteConfig.heroSupport}</p>

      <div className="world-actions">
        <button
          type="button"
          className="world-button"
          onClick={() => onNavigate("about")}
        >
          Enter the world
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="world-button world-button-ghost"
          onClick={() => onNavigate("projects")}
        >
          View projects
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </button>
        <a
          href={siteConfig.cvPath}
          download
          className="world-text-link"
          data-no-swipe
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Download CV
        </a>
      </div>

      <div className="world-home-meta">
        <p>
          <span className="world-meta-label">Current zone</span>
          <span>Central entrance</span>
        </p>
        <p>
          <span className="world-meta-label">Interface</span>
          <span>Scroll / swipe / click to explore</span>
        </p>
      </div>
    </div>
  );
}

function AboutContent({
  onSelect,
}: {
  onSelect: (selection: WorldSelection) => void;
}) {
  return (
    <>
      <StationHeader
        index="01"
        label="About"
        kicker="Profile terminal"
        title="Systems, support, and software."
        lede={about.paragraphs[0]}
      />

      <div className="world-prose">
        {about.paragraphs.slice(1).map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>

      <div className="world-section-label">
        <span>Interactive profile modules</span>
        <span className="world-section-hint">Click an object in the world or a module below</span>
      </div>

      <div className="world-module-grid">
        {aboutArtifacts.map((artifact) => {
          const Icon = aboutIcons[artifact.id];
          return (
            <button
              key={artifact.id}
              type="button"
              className="world-module"
              onClick={() => onSelect({ kind: "about", id: artifact.id })}
            >
              <span className="world-module-icon">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="world-module-body">
                <span className="world-module-title">{artifact.title}</span>
                <span className="world-module-copy">{artifact.description}</span>
              </span>
              <ChevronRight className="world-module-arrow h-4 w-4" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      <dl className="world-facts">
        {about.glance.map((item) => (
          <div key={item.label}>
            <dt>{item.label}</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </>
  );
}

function ExperienceContent({
  onSelect,
}: {
  onSelect: (selection: WorldSelection) => void;
}) {
  const additionalObjects = experienceObjects.filter(
    (object) => !object.areaId,
  );

  return (
    <>
      <StationHeader
        index="02"
        label="Experience"
        kicker="IT infrastructure floor"
        title="Inside the infrastructure."
        lede={experience.intro}
      />

      <div className="world-experience-list">
        {experience.areas.map((area) => (
          <button
            key={area.id}
            type="button"
            className="world-experience-card"
            onClick={() =>
              onSelect({
                kind: "experience",
                id: areaObjectIds[area.id] ?? "support-desk",
              })
            }
          >
            <span className="world-module-icon">
              <area.icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="world-experience-body">
              <span className="world-module-title">{area.title}</span>
              <span className="world-module-copy">{area.summary}</span>
              <span className="world-inline-meta">
                {area.responsibilities.length} responsibilities
              </span>
            </span>
            <ChevronRight className="world-module-arrow h-4 w-4" aria-hidden="true" />
          </button>
        ))}
      </div>

      <div className="world-section-label">
        <span>Physical systems</span>
        <span className="world-section-hint">Illustrative 3D environment</span>
      </div>

      <div className="world-chip-grid">
        {additionalObjects.map((object) => {
          const detail = getExperienceDetail(object.id);
          return (
            <button
              key={object.id}
              type="button"
              className="world-chip-button"
              onClick={() => onSelect({ kind: "experience", id: object.id })}
            >
              <span>{detail?.title ?? object.label}</span>
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      <p className="world-note">
        The 3D floor is an illustrative environment based on the systems I work
        with - not a live monitoring view.
      </p>

      <div className="world-system-strip" aria-label="Infrastructure components">
        {infrastructure.nodes.slice(0, 6).map((node) => (
          <span key={node.id}>{node.label}</span>
        ))}
      </div>
    </>
  );
}

function SkillsContent({
  onSelect,
}: {
  onSelect: (selection: WorldSelection) => void;
}) {
  return (
    <>
      <StationHeader
        index="03"
        label="Skills"
        kicker="Technology network"
        title="A connected technology stack."
        lede="The disciplines and tools I use in practice. Select a network node to see where it fits into the work."
      />

      <div className="world-skill-list">
        {skills.map((category) => {
          const detail = getSkillDetail(category.category);
          const Icon = category.icon;
          return (
            <button
              key={category.category}
              type="button"
              className="world-skill-row"
              onClick={() => onSelect({ kind: "skill", id: category.category })}
            >
              <span className="world-module-icon">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="world-skill-body">
                <span className="world-skill-heading">
                  <span className="world-module-title">{category.category}</span>
                  <span className="world-inline-meta">{category.items.length} tools</span>
                </span>
                <span className="world-module-copy">
                  {detail?.usage ?? skillDetails[category.category]}
                </span>
                <span className="world-skill-tags">
                  {category.items.slice(0, 4).map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                  {category.items.length > 4 && (
                    <span>+{category.items.length - 4}</span>
                  )}
                </span>
              </span>
              <ChevronRight className="world-module-arrow h-4 w-4" aria-hidden="true" />
            </button>
          );
        })}
      </div>

      <div className="world-toolchain">
        <p>
          <Terminal className="h-4 w-4" aria-hidden="true" />
          Daily toolchain
        </p>
        <div>
          {toolchain.map((tool) => (
            <span key={tool}>{tool}</span>
          ))}
        </div>
      </div>
    </>
  );
}

function ProjectsContent({
  onSelect,
}: {
  onSelect: (selection: WorldSelection) => void;
}) {
  return (
    <>
      <StationHeader
        index="04"
        label="Projects"
        kicker="Project exhibition"
        title="Selected work."
        lede="Applications and systems I have designed, built and deployed. The exhibition objects are illustrative environments, not product screenshots."
      />

      <p className="world-note world-note-accent">
        <span className="world-live-dot" aria-hidden="true" />
        Select a display in the exhibition to inspect the project details.
      </p>

      <div className="world-project-list">
        {projects.map((project) => (
          <button
            key={project.id}
            type="button"
            className="world-project-row"
            onClick={() => onSelect({ kind: "project", id: project.id })}
          >
            <span className="world-project-number">{project.number}</span>
            <span className="world-project-body">
              <span className="world-project-heading">
                <span className="world-project-name">{project.name}</span>
                <StatusBadge status={project.status} label={project.statusLabel} />
              </span>
              <span className="world-project-category">{project.category}</span>
              <span className="world-project-description">{project.description}</span>
              {project.technologies.length > 0 && (
                <span className="world-skill-tags">
                  {project.technologies.slice(0, 5).map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </span>
              )}
            </span>
            <ChevronRight className="world-module-arrow h-4 w-4" aria-hidden="true" />
          </button>
        ))}
      </div>
    </>
  );
}

function AchievementsContent({
  onSelect,
}: {
  onSelect: (selection: WorldSelection) => void;
}) {
  return (
    <>
      <StationHeader
        index="05"
        label="Achievements"
        kicker="Award gallery"
        title="Recognition for useful technology."
        lede="A healthcare technology project built to support autistic children through interactive learning and social play."
      />

      <article className="world-award">
        <div className="world-award-mark" aria-hidden="true">
          <Trophy className="h-7 w-7" />
        </div>
        <div>
          <p className="world-award-status">Winner / Healthcare technology</p>
          <h2 className="world-award-title">FIRST PLACE WINNER</h2>
          <p className="world-award-event">Prishtina Inovate Healthcare</p>
          <p className="world-award-project">
            Playground Life - Social Play for Autism
          </p>
          <p className="world-award-copy">{achievement.description}</p>
        </div>
      </article>

      <button
        type="button"
        className="world-button world-button-ghost world-button-full"
        onClick={() => onSelect({ kind: "achievement", id: "prishtina-inovate" })}
      >
        Inspect the award
        <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
      </button>

      <div className="world-facts world-facts-achievement">
        <div>
          <dt>Event</dt>
          <dd>{achievement.event}</dd>
        </div>
        <div>
          <dt>Project</dt>
          <dd>Playground Life</dd>
        </div>
        <div>
          <dt>Result</dt>
          <dd>1st Place Winner</dd>
        </div>
      </div>

      <p className="world-note">
        The award stands at the centre of this zone. The surrounding light and
        motion are illustrative - the achievement is the real part.
      </p>
    </>
  );
}

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

function ContactContent() {
  return (
    <>
      <StationHeader
        index="06"
        label="Contact"
        kicker="Communication terminal"
        title="Open a channel."
        lede="Have a technical problem to solve, a role to fill, or a project to discuss? The terminal is open."
      />

      <div className="world-contact-channels">
        {contactChannels.map((channel) => (
          <a
            key={channel.label}
            href={channel.href}
            className="world-contact-channel"
            {...(channel.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            <span className="world-module-icon">
              <channel.icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span>
              <span className="world-contact-label">{channel.label}</span>
              <span className="world-contact-value">{channel.value}</span>
            </span>
            <ArrowUpRight className="world-module-arrow h-4 w-4" aria-hidden="true" />
          </a>
        ))}
      </div>

      <div className="world-contact-meta">
        <span>
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {siteConfig.location}
        </span>
        <span>
          <span className="world-live-dot" aria-hidden="true" />
          Available for opportunities
        </span>
      </div>

      <div className="world-contact-form">
        <ContactForm />
      </div>
    </>
  );
}

export default function StationContent({
  station,
  onNavigate,
  onSelect,
  reduced,
}: StationContentProps) {
  const rootClass =
    station === "home"
      ? "world-station-body world-station-body-home"
      : "world-station-body";

  return (
    <div className={rootClass} data-reduced={reduced ? "true" : undefined}>
      {station === "home" && <HomeContent onNavigate={onNavigate} />}
      {station === "about" && <AboutContent onSelect={onSelect} />}
      {station === "experience" && <ExperienceContent onSelect={onSelect} />}
      {station === "skills" && <SkillsContent onSelect={onSelect} />}
      {station === "projects" && <ProjectsContent onSelect={onSelect} />}
      {station === "achievements" && <AchievementsContent onSelect={onSelect} />}
      {station === "contact" && <ContactContent />}
    </div>
  );
}
