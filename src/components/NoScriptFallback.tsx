import {
  achievement,
  projects,
  siteConfig,
  worldStations,
} from "@/data/portfolio";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/**
 * A complete static document for visitors with JavaScript disabled. The
 * immersive shell is hidden by CSS until the inline bootstrap marks the page
 * as JS-enabled (`html.js`).
 */
export default function NoScriptFallback() {
  const stationLinks = worldStations
    .map(
      (station) => `
        <li>
          <a href="/standard/#${station.id}">
            <span class="no-js-index">${station.index}</span>
            <span>
              <strong>${escapeHtml(station.label)}</strong>
              <small>${escapeHtml(station.summary)}</small>
            </span>
          </a>
        </li>`,
    )
    .join("");

  const projectItems = projects
    .map(
      (project) => `
        <li>
          <span class="no-js-index">${project.number}</span>
          <span>
            <strong>${escapeHtml(project.name)}</strong>
            <small>${escapeHtml(project.description)}</small>
          </span>
        </li>`,
    )
    .join("");

  const html = `
    <div class="no-js-shell">
      <header class="no-js-header">
        <a class="no-js-brand" href="/standard/">
          <span aria-hidden="true">LC</span>
          <strong>${escapeHtml(siteConfig.name)}</strong>
        </a>
        <a class="no-js-header-link" href="/standard/">Accessible portfolio</a>
      </header>

      <main class="no-js-main">
        <p class="no-js-kicker">STATIC FALLBACK / JAVASCRIPT DISABLED</p>
        <h1 class="no-js-title">
          LORIS <span>CANOLLI</span>
        </h1>
        <p class="no-js-roles">IT Support Specialist / IT Administrator / Full-Stack Developer</p>
        <p class="no-js-copy">${escapeHtml(siteConfig.heroSupport)}</p>

        <div class="no-js-actions">
          <a class="no-js-button" href="/standard/">Open the accessible portfolio</a>
          <a class="no-js-button no-js-button-ghost" href="${escapeHtml(siteConfig.cvPath)}" download>Download CV</a>
        </div>

        <section class="no-js-section" aria-labelledby="no-js-sections">
          <h2 id="no-js-sections">Portfolio sections</h2>
          <ul class="no-js-grid">${stationLinks}</ul>
        </section>

        <section class="no-js-section" aria-labelledby="no-js-projects">
          <h2 id="no-js-projects">Selected work</h2>
          <ul class="no-js-grid">${projectItems}</ul>
          <p class="no-js-note">${escapeHtml(achievement.title)} - ${escapeHtml(
            achievement.event,
          )} for ${escapeHtml(achievement.project)}.</p>
        </section>

        <section class="no-js-section" aria-labelledby="no-js-contact">
          <h2 id="no-js-contact">Contact</h2>
          <div class="no-js-contact">
            <a href="mailto:${escapeHtml(siteConfig.social.email)}">${escapeHtml(
              siteConfig.social.email,
            )}</a>
            <a href="${escapeHtml(siteConfig.social.linkedin)}" rel="noopener noreferrer">LinkedIn</a>
            <a href="${escapeHtml(siteConfig.social.github)}" rel="noopener noreferrer">GitHub</a>
          </div>
          <p class="no-js-note">${escapeHtml(siteConfig.location)}. Open to opportunities.</p>
        </section>
      </main>
    </div>
  `;

  return <noscript dangerouslySetInnerHTML={{ __html: html }} />;
}
