"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ExternalLink,
  Mail,
  MapPin,
  Trophy,
  X,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/BrandIcons";
import StatusBadge from "@/components/StatusBadge";
import {
  achievement,
  siteConfig,
  type StationId,
} from "@/data/portfolio";
import {
  getAboutArtifact,
  getExperienceDetail,
  getProject,
  getSkillDetail,
  type WorldSelection,
} from "@/lib/world";

interface DetailDrawerProps {
  selection: WorldSelection | null;
  onClose: () => void;
  onNavigate: (station: StationId) => void;
  reduced: boolean;
}

const kindLabels: Record<WorldSelection["kind"], string> = {
  about: "Profile module",
  experience: "Infrastructure object",
  skill: "Technology node",
  project: "Project exhibit",
  achievement: "Award record",
  contact: "Communication terminal",
};

function DetailContent({
  selection,
  onClose,
  onNavigate,
}: {
  selection: WorldSelection;
  onClose: () => void;
  onNavigate: (station: StationId) => void;
}) {
  if (selection.kind === "about") {
    const artifact = getAboutArtifact(selection.id);
    if (!artifact) return null;

    return (
      <>
        <p className="world-kicker world-kicker-detail">
          <span>PROFILE MODULE</span>
          <span className="world-kicker-divider">/</span>
          <span>{artifact.label}</span>
        </p>
        <h2 id="detail-title" className="world-detail-title">
          {artifact.title}
        </h2>
        <p className="world-detail-lede">{artifact.description}</p>
        <ul className="world-detail-list">
          {artifact.points.map((point) => (
            <li key={point}>
              <Check className="h-4 w-4" aria-hidden="true" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <div className="world-detail-actions">
          <button
            type="button"
            className="world-button world-button-ghost"
            onClick={() => {
              onClose();
              onNavigate("experience");
            }}
          >
            Explore the infrastructure
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </>
    );
  }

  if (selection.kind === "experience") {
    const detail = getExperienceDetail(selection.id);
    if (!detail) return null;

    return (
      <>
        <p className="world-kicker world-kicker-detail">
          <span>INFRASTRUCTURE OBJECT</span>
          <span className="world-kicker-divider">/</span>
          <span>{detail.source}</span>
        </p>
        <h2 id="detail-title" className="world-detail-title">
          {detail.title}
        </h2>
        <p className="world-detail-lede">{detail.summary}</p>
        {detail.points.length > 0 && (
          <ul className="world-detail-list">
            {detail.points.map((point) => (
              <li key={point}>
                <Check className="h-4 w-4" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="world-note">
          This is an illustrative environment based on the systems I work with,
          not a live monitoring view.
        </p>
      </>
    );
  }

  if (selection.kind === "skill") {
    const detail = getSkillDetail(selection.id);
    if (!detail) return null;
    const Icon = detail.category.icon;

    return (
      <>
        <p className="world-kicker world-kicker-detail">
          <span>TECHNOLOGY NODE</span>
          <span className="world-kicker-divider">/</span>
          <span>{detail.category.items.length} tools</span>
        </p>
        <div className="world-detail-heading">
          <span className="world-detail-icon">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 id="detail-title" className="world-detail-title">
            {detail.category.category}
          </h2>
        </div>
        <p className="world-detail-lede">{detail.usage}</p>
        <div className="world-skill-tags world-skill-tags-detail">
          {detail.category.items.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <p className="world-note">
          No invented proficiency percentages - these are tools and systems I
          work with in practice.
        </p>
      </>
    );
  }

  if (selection.kind === "project") {
    const project = getProject(selection.id);
    if (!project) return null;

    return (
      <>
        <p className="world-kicker world-kicker-detail">
          <span>PROJECT {project.number}</span>
          <span className="world-kicker-divider">/</span>
          <span>{project.category}</span>
        </p>
        <div className="world-detail-heading world-detail-heading-project">
          <h2 id="detail-title" className="world-detail-title">
            {project.name}
          </h2>
          <StatusBadge status={project.status} label={project.statusLabel} />
        </div>
        <p className="world-detail-lede">{project.description}</p>

        {project.achievement && (
          <p className="world-project-award">
            <Trophy className="h-4 w-4" aria-hidden="true" />
            {project.achievement}
          </p>
        )}

        <div className="world-detail-section">
          <h3>{project.highlightsLabel}</h3>
          <ul className="world-detail-list">
            {project.highlights.map((highlight) => (
              <li key={highlight}>
                <Check className="h-4 w-4" aria-hidden="true" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        {project.technologies.length > 0 && (
          <div className="world-detail-section">
            <h3>Technologies</h3>
            <div className="world-skill-tags">
              {project.technologies.map((technology) => (
                <span key={technology}>{technology}</span>
              ))}
            </div>
          </div>
        )}

        {project.note && <p className="world-note">{project.note}</p>}

        <p className="world-note world-note-accent">
          <span className="world-live-dot" aria-hidden="true" />
          The 3D exhibit is an illustrative environment, not a product
          screenshot.
        </p>

        <div className="world-detail-actions">
          {project.links.live ? (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="world-button"
            >
              Visit live application
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          ) : (
            <span className="world-link-note">
              No public live link is available for this project.
            </span>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="world-button world-button-ghost"
            >
              View source
              <GithubIcon className="h-4 w-4" aria-hidden="true" />
            </a>
          )}
        </div>
      </>
    );
  }

  if (selection.kind === "achievement") {
    return (
      <>
        <p className="world-kicker world-kicker-detail">
          <span>AWARD RECORD</span>
          <span className="world-kicker-divider">/</span>
          <span>HEALTHCARE TECHNOLOGY</span>
        </p>
        <div className="world-detail-heading">
          <span className="world-detail-icon world-detail-icon-gold">
            <Trophy className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 id="detail-title" className="world-detail-title">
            {achievement.title}
          </h2>
        </div>
        <p className="world-award-event">{achievement.event}</p>
        <p className="world-award-project">{achievement.project}</p>
        <p className="world-detail-lede">{achievement.description}</p>
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
        <button
          type="button"
          className="world-button world-button-ghost world-button-full"
          onClick={() => {
            onClose();
            onNavigate("projects");
          }}
        >
          Visit the project exhibition
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </>
    );
  }

  return (
    <>
      <p className="world-kicker world-kicker-detail">
        <span>COMMUNICATION TERMINAL</span>
        <span className="world-kicker-divider">/</span>
        <span>ONLINE</span>
      </p>
      <h2 id="detail-title" className="world-detail-title">
        Open a channel.
      </h2>
      <p className="world-detail-lede">
        The contact form is available in this zone. You can also reach me
        directly through any of the channels below.
      </p>
      <div className="world-contact-channels world-contact-channels-detail">
        <a
          href={`mailto:${siteConfig.social.email}`}
          className="world-contact-channel"
        >
          <span className="world-module-icon">
            <Mail className="h-4 w-4" aria-hidden="true" />
          </span>
          <span>
            <span className="world-contact-label">Email</span>
            <span className="world-contact-value">{siteConfig.social.email}</span>
          </span>
          <ArrowRight className="world-module-arrow h-4 w-4" aria-hidden="true" />
        </a>
        <a
          href={siteConfig.social.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="world-contact-channel"
        >
          <span className="world-module-icon">
            <LinkedinIcon className="h-4 w-4" aria-hidden="true" />
          </span>
          <span>
            <span className="world-contact-label">LinkedIn</span>
            <span className="world-contact-value">
              {siteConfig.social.linkedin.replace("https://", "")}
            </span>
          </span>
          <ArrowRight className="world-module-arrow h-4 w-4" aria-hidden="true" />
        </a>
        <a
          href={siteConfig.social.github}
          target="_blank"
          rel="noopener noreferrer"
          className="world-contact-channel"
        >
          <span className="world-module-icon">
            <GithubIcon className="h-4 w-4" aria-hidden="true" />
          </span>
          <span>
            <span className="world-contact-label">GitHub</span>
            <span className="world-contact-value">
              {siteConfig.social.github.replace("https://", "")}
            </span>
          </span>
          <ArrowRight className="world-module-arrow h-4 w-4" aria-hidden="true" />
        </a>
      </div>
      <p className="world-contact-meta">
        <span>
          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
          {siteConfig.location}
        </span>
      </p>
      <button
        type="button"
        className="world-button world-button-full"
        onClick={onClose}
      >
        Return to the contact form
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </>
  );
}

export default function DetailDrawer({
  selection,
  onClose,
  onNavigate,
  reduced,
}: DetailDrawerProps) {
  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!selection) {
      const target = previousFocus.current;
      previousFocus.current = null;
      target?.focus();
      return;
    }

    // Keep the original trigger when the inspector switches from one item to
    // another; by then focus is already inside the drawer.
    if (!previousFocus.current) {
      previousFocus.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
    }

    const frame = window.requestAnimationFrame(() => closeRef.current?.focus());

    return () => window.cancelAnimationFrame(frame);
  }, [selection]);

  useEffect(() => {
    if (!selection) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;

      const focusable = panel.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selection]);

  return (
    <AnimatePresence>
      {selection && (
        <motion.aside
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="detail-title"
          className="world-detail"
          initial={reduced ? false : { opacity: 0, x: 34 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduced ? undefined : { opacity: 0, x: 20 }}
          transition={{ duration: reduced ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="world-detail-top">
            <span>{kindLabels[selection.kind]}</span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="world-icon-button"
              aria-label="Close object details"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="world-detail-scroll" data-scroll-region>
            <DetailContent
              selection={selection}
              onClose={onClose}
              onNavigate={onNavigate}
            />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
